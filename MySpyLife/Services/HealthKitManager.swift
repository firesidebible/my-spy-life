import Foundation
import HealthKit

@MainActor
final class HealthKitManager: ObservableObject {
    @Published var stats = AgentStats()
    @Published var authorized = false
    @Published var lastSync: Date?

    private let store = HKHealthStore()

    private var readTypes: Set<HKObjectType> {
        var types = Set<HKObjectType>()
        if let steps = HKObjectType.quantityType(forIdentifier: .stepCount) {
            types.insert(steps)
        }
        if let stand = HKObjectType.categoryType(forIdentifier: .appleStandHour) {
            types.insert(stand)
        }
        if let mindful = HKObjectType.categoryType(forIdentifier: .mindfulSession) {
            types.insert(mindful)
        }
        return types
    }

    func requestAuthorization() async {
        guard HKHealthStore.isHealthDataAvailable() else { return }
        do {
            try await store.requestAuthorization(toShare: [], read: readTypes)
            authorized = true
        } catch {
            authorized = false
        }
    }

    /// Pull today's numbers and update the L.I.F.E. uplink.
    func refresh() async {
        guard authorized else { return }
        async let steps = todaySteps()
        async let stand = todayStandHours()
        async let mindful = todayMindfulMinutes()
        let (s, h, m) = await (steps, stand, mindful)
        stats.steps = s
        stats.standHours = h
        stats.mindfulMinutes = m
        lastSync = Date()
    }

    // MARK: - Queries

    private var todayPredicate: NSPredicate {
        let start = Calendar.current.startOfDay(for: Date())
        return HKQuery.predicateForSamples(withStart: start, end: Date())
    }

    private func todaySteps() async -> Int {
        guard let type = HKQuantityType.quantityType(forIdentifier: .stepCount) else { return 0 }
        return await withCheckedContinuation { cont in
            let query = HKStatisticsQuery(quantityType: type,
                                          quantitySamplePredicate: todayPredicate,
                                          options: .cumulativeSum) { _, result, _ in
                let value = result?.sumQuantity()?.doubleValue(for: .count()) ?? 0
                cont.resume(returning: Int(value))
            }
            store.execute(query)
        }
    }

    private func todayStandHours() async -> Int {
        guard let type = HKCategoryType.categoryType(forIdentifier: .appleStandHour) else { return 0 }
        return await withCheckedContinuation { cont in
            let query = HKSampleQuery(sampleType: type,
                                      predicate: todayPredicate,
                                      limit: HKObjectQueryNoLimit,
                                      sortDescriptors: nil) { _, samples, _ in
                let stood = (samples as? [HKCategorySample])?
                    .filter { $0.value == HKCategoryValueAppleStandHour.stood.rawValue }
                    .count ?? 0
                cont.resume(returning: stood)
            }
            store.execute(query)
        }
    }

    private func todayMindfulMinutes() async -> Int {
        guard let type = HKCategoryType.categoryType(forIdentifier: .mindfulSession) else { return 0 }
        return await withCheckedContinuation { cont in
            let query = HKSampleQuery(sampleType: type,
                                      predicate: todayPredicate,
                                      limit: HKObjectQueryNoLimit,
                                      sortDescriptors: nil) { _, samples, _ in
                let seconds = (samples as? [HKCategorySample])?
                    .reduce(0.0) { $0 + $1.endDate.timeIntervalSince($1.startDate) } ?? 0
                cont.resume(returning: Int(seconds / 60))
            }
            store.execute(query)
        }
    }
}
