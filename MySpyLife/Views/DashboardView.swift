import SwiftUI

struct DashboardView: View {
    @EnvironmentObject var healthKit: HealthKitManager
    @State private var showBriefing = false

    var body: some View {
        ZStack {
            ScrollView {
                VStack(spacing: 16) {
                    header

                    TerminalPanel(header: "AGENT VITALS") {
                        Text(healthKit.stats.status)
                            .font(Theme.mono(15, weight: .bold))
                            .foregroundStyle(healthKit.stats.uplink < 0.2 ? Theme.alert : Theme.phosphor)
                    }

                    TerminalPanel(header: "L.I.F.E. TRANSFER") {
                        StatBarView(label: "STAMINA",
                                    detail: "\(healthKit.stats.standHours)/\(AgentStats.standGoal) STAND HRS",
                                    progress: healthKit.stats.stamina)
                        StatBarView(label: "STRENGTH",
                                    detail: "\(healthKit.stats.steps)/\(AgentStats.stepGoal) STEPS",
                                    progress: healthKit.stats.strength)
                        StatBarView(label: "INTEL",
                                    detail: "\(healthKit.stats.mindfulMinutes)/\(AgentStats.mindfulGoal) MINDFUL MIN",
                                    progress: healthKit.stats.intelligence)
                    }

                    TerminalPanel(header: "FIELD COMMS") {
                        Button {
                            showBriefing = true
                        } label: {
                            Text("> OPEN BRIEFING FROM AGENT 86")
                                .font(Theme.mono(13, weight: .bold))
                                .foregroundStyle(Theme.amber)
                        }
                    }

                    footer
                }
                .padding(16)
            }
            .refreshable { await healthKit.refresh() }

            Scanlines().ignoresSafeArea()
        }
        .sheet(isPresented: $showBriefing) {
            BriefingView(uplink: healthKit.stats.uplink)
        }
    }

    private var header: some View {
        VStack(alignment: .leading, spacing: 4) {
            Text("M.U.S.C.L.E.")
                .font(Theme.mono(26, weight: .heavy))
                .foregroundStyle(Theme.phosphor)
            Text("MULTINATIONAL UNITED SYNDICATE OF COVERT LAW ENFORCEMENT")
                .font(Theme.mono(9))
                .foregroundStyle(Theme.phosphorDim)
            HStack {
                Text("LINK 04")
                Text("ENCR AES-256")
                Text("F.L.A.B. ACTIVE").foregroundStyle(Theme.alert)
            }
            .font(Theme.mono(10, weight: .bold))
            .foregroundStyle(Theme.phosphorDim)
        }
        .frame(maxWidth: .infinity, alignment: .leading)
    }

    private var footer: some View {
        VStack(spacing: 4) {
            if !healthKit.authorized {
                Text("!! HEALTH UPLINK OFFLINE — GRANT ACCESS IN SETTINGS > HEALTH")
                    .font(Theme.mono(10))
                    .foregroundStyle(Theme.amber)
            }
            if let sync = healthKit.lastSync {
                Text("LAST UPLINK: \(sync.formatted(date: .omitted, time: .standard))")
                    .font(Theme.mono(10))
                    .foregroundStyle(Theme.phosphorDim)
            }
            Text("PULL DOWN TO RE-SYNC // CLR: SIERRA-04")
                .font(Theme.mono(10))
                .foregroundStyle(Theme.phosphorDim)
        }
        .frame(maxWidth: .infinity)
        .padding(.top, 8)
    }
}
