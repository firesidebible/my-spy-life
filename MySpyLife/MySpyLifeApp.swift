import SwiftUI

@main
struct MySpyLifeApp: App {
    @StateObject private var healthKit = HealthKitManager()
    @State private var booted = false

    var body: some Scene {
        WindowGroup {
            ZStack {
                Theme.background.ignoresSafeArea()
                if booted {
                    DashboardView()
                        .environmentObject(healthKit)
                        .transition(.opacity)
                } else {
                    BootScreenView {
                        withAnimation(.easeIn(duration: 0.4)) { booted = true }
                    }
                }
            }
            .preferredColorScheme(.dark)
            .task {
                await healthKit.requestAuthorization()
                await healthKit.refresh()
            }
        }
    }
}
