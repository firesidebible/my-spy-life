import Foundation

/// L.I.F.E. Support transfer model.
/// Your health activity becomes Agent 86's field capabilities:
///   Stand hours  -> STAMINA
///   Steps        -> STRENGTH
///   Mindful mins -> INTELLIGENCE
struct AgentStats {
    var standHours: Int = 0
    var steps: Int = 0
    var mindfulMinutes: Int = 0

    // Daily transfer goals. Tune to taste (or make user-configurable later).
    static let standGoal = 12
    static let stepGoal = 10_000
    static let mindfulGoal = 10

    var stamina: Double      { min(Double(standHours) / Double(Self.standGoal), 1.0) }
    var strength: Double     { min(Double(steps) / Double(Self.stepGoal), 1.0) }
    var intelligence: Double { min(Double(mindfulMinutes) / Double(Self.mindfulGoal), 1.0) }

    /// Overall uplink integrity: the mean of all three transfers.
    var uplink: Double { (stamina + strength + intelligence) / 3.0 }

    var status: String {
        switch uplink {
        case 0.85...: return "AGENT 86 VITALS OPTIMAL"
        case 0.5..<0.85: return "AGENT 86 VITALS NOMINAL"
        case 0.2..<0.5: return "AGENT 86 VITALS DEGRADED"
        default: return "AGENT 86 VITALS CRITICAL"
        }
    }
}
