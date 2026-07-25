import SwiftUI

/// MUSCLE Field Terminal design tokens.
/// Phosphor CRT: near-black ground, green primary, amber caution, red alert.
enum Theme {
    static let background = Color(red: 0.02, green: 0.04, blue: 0.03)
    static let panel      = Color(red: 0.04, green: 0.09, blue: 0.06)
    static let phosphor   = Color(red: 0.20, green: 1.00, blue: 0.40)
    static let phosphorDim = Color(red: 0.20, green: 1.00, blue: 0.40).opacity(0.45)
    static let amber      = Color(red: 1.00, green: 0.69, blue: 0.00)
    static let alert      = Color(red: 1.00, green: 0.23, blue: 0.19)

    static func mono(_ size: CGFloat, weight: Font.Weight = .regular) -> Font {
        .system(size: size, weight: weight, design: .monospaced)
    }
}

/// A thin scanline overlay to sell the CRT look. Cheap and respectful of battery.
struct Scanlines: View {
    var body: some View {
        GeometryReader { geo in
            let lineCount = Int(geo.size.height / 3)
            VStack(spacing: 2) {
                ForEach(0..<lineCount, id: \.self) { _ in
                    Rectangle()
                        .fill(Color.black.opacity(0.18))
                        .frame(height: 1)
                }
            }
        }
        .allowsHitTesting(false)
    }
}

/// Bordered terminal panel with a header label, e.g. `// AGENT VITALS`.
struct TerminalPanel<Content: View>: View {
    let header: String
    @ViewBuilder var content: Content

    var body: some View {
        VStack(alignment: .leading, spacing: 10) {
            Text("// \(header)")
                .font(Theme.mono(11, weight: .bold))
                .foregroundStyle(Theme.phosphorDim)
                .kerning(1.5)
            content
        }
        .padding(14)
        .frame(maxWidth: .infinity, alignment: .leading)
        .background(Theme.panel)
        .overlay(Rectangle().stroke(Theme.phosphorDim, lineWidth: 1))
    }
}
