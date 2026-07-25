import SwiftUI

/// Terminal-style transfer gauge: STAMINA [██████░░░░] 60%
struct StatBarView: View {
    let label: String
    let detail: String
    let progress: Double

    private var blocks: String {
        let filled = Int((progress * 10).rounded(.down))
        return String(repeating: "█", count: filled) + String(repeating: "░", count: 10 - filled)
    }

    var body: some View {
        VStack(alignment: .leading, spacing: 2) {
            HStack {
                Text(label)
                    .font(Theme.mono(13, weight: .bold))
                Spacer()
                Text("\(Int(progress * 100))%")
                    .font(Theme.mono(13, weight: .bold))
            }
            .foregroundStyle(progress >= 1.0 ? Theme.amber : Theme.phosphor)

            Text("[\(blocks)]")
                .font(Theme.mono(15))
                .foregroundStyle(progress >= 1.0 ? Theme.amber : Theme.phosphor)

            Text(detail)
                .font(Theme.mono(10))
                .foregroundStyle(Theme.phosphorDim)
        }
        .padding(.vertical, 4)
        .accessibilityElement(children: .combine)
        .accessibilityLabel("\(label) \(Int(progress * 100)) percent. \(detail)")
    }
}
