import SwiftUI

/// Incoming transmission from Agent 86, keyed to today's uplink strength.
struct BriefingView: View {
    let uplink: Double
    @Environment(\.dismiss) private var dismiss
    @State private var message = ""

    var body: some View {
        ZStack {
            Theme.background.ignoresSafeArea()
            VStack(alignment: .leading, spacing: 16) {
                Text("// INCOMING TRANSMISSION")
                    .font(Theme.mono(11, weight: .bold))
                    .foregroundStyle(Theme.phosphorDim)
                    .kerning(1.5)

                Text("AGENT 86 // FIELD")
                    .font(Theme.mono(18, weight: .heavy))
                    .foregroundStyle(Theme.amber)

                Text(message)
                    .font(Theme.mono(14))
                    .foregroundStyle(Theme.phosphor)
                    .lineSpacing(5)

                Spacer()

                Button {
                    dismiss()
                } label: {
                    Text("> ACKNOWLEDGE // BURN AFTER READING")
                        .font(Theme.mono(13, weight: .bold))
                        .foregroundStyle(Theme.phosphor)
                        .padding(12)
                        .frame(maxWidth: .infinity)
                        .overlay(Rectangle().stroke(Theme.phosphor, lineWidth: 1))
                }
            }
            .padding(24)
            Scanlines().ignoresSafeArea()
        }
        .onAppear { message = Briefings.line(for: uplink) }
    }
}
