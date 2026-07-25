import SwiftUI

/// SYS// COLD BOOT — types out the startup sequence, then hands off to the terminal.
struct BootScreenView: View {
    let onComplete: () -> Void

    private let lines = [
        "M.U.S.C.L.E. SECURE TERMINAL",
        "LINK 04 // ENCR AES-256",
        "SYS// COLD BOOT ...........",
        "L.I.F.E. UPLINK ... STABLE",
        "CLR: SIERRA-04 VERIFIED",
        "SECURE THIS TERMINAL // DO NOT SHARE",
        "> STAND RING  -> STAMINA TRANSFER",
        "> FOOT PATROL -> STRENGTH TRANSFER",
        "> BREATH SESSION -> INTEL BOOST",
        "",
        "AWAITING OPERATIVE ...",
    ]

    @State private var shown = 0

    var body: some View {
        ZStack {
            Theme.background.ignoresSafeArea()
            VStack(alignment: .leading, spacing: 8) {
                ForEach(0..<shown, id: \.self) { i in
                    Text(lines[i])
                        .font(Theme.mono(14))
                        .foregroundStyle(Theme.phosphor)
                }
                if shown < lines.count {
                    Text("_")
                        .font(Theme.mono(14, weight: .bold))
                        .foregroundStyle(Theme.phosphor)
                }
                Spacer()
            }
            .frame(maxWidth: .infinity, alignment: .leading)
            .padding(24)
            Scanlines().ignoresSafeArea()
        }
        .contentShape(Rectangle())
        .onTapGesture { onComplete() } // impatient operatives may skip
        .task {
            for i in 1...lines.count {
                try? await Task.sleep(nanoseconds: 220_000_000)
                shown = i
            }
            try? await Task.sleep(nanoseconds: 600_000_000)
            onComplete()
        }
    }
}
