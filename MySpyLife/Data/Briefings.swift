import Foundation

/// Agent 86's dispatches from the field. Tone: Mission Impossible gravitas
/// that keeps tripping over itself.
enum Briefings {
    static let recruitment = """
    Your mission, should you choose to accept it, is to train for me. \
    Your success means my success. And it goes without saying, your failure \
    means my... untimely demise at the hands of a nefarious enemy. Now that \
    I've said it I realize that I should have stuck with 'it goes without saying'...
    """

    static let lowUplink = [
        "Operative, my legs just gave out mid-chase. Coincidence? Check your stand ring.",
        "I attempted to disarm the device. My hands shook. Someone skipped their transfer today.",
        "F.L.A.B. is gaining on me and frankly, so is gravity. I need stamina. Yesterday.",
    ]

    static let midUplink = [
        "Uplink holding. I scaled the embassy wall on the strength you sent. The second wall, however...",
        "Adequate transfer received. 'Adequate' is what my handler wrote on every report I've ever gotten.",
        "The signal is steady. Keep it coming — I'm two vents away from the mainframe.",
    ]

    static let highUplink = [
        "Whatever you did today — the standing, the walking, the breathing — I just outran a speedboat. On foot. Debrief later.",
        "Intel boost received. I've cracked their cipher. It was 'password1'. F.L.A.B. never learns.",
        "Full transfer. I feel invincible, which historically is when things go wrong. Stand by.",
    ]

    static func line(for uplink: Double) -> String {
        switch uplink {
        case 0.7...: return highUplink.randomElement() ?? recruitment
        case 0.35..<0.7: return midUplink.randomElement() ?? recruitment
        default: return lowUplink.randomElement() ?? recruitment
        }
    }
}
