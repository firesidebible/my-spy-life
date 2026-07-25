# MY SPY LIFE // MUSCLE Field Terminal

A HealthKit-powered fitness app. Your real-world activity is a L.I.F.E.
(Long-range Inductively Focused Energy) transfer keeping Agent 86 alive in
the field against F.L.A.B.

- Stand hours → **STAMINA**
- Steps → **STRENGTH**
- Mindful minutes → **INTELLIGENCE**

## Setup (one time, ~10 minutes)

You need Xcode (free, Mac App Store) and an iPhone.

1. **Create the Xcode project.** Open Xcode → File → New → Project →
   iOS → App. Product Name: `MySpyLife`. Interface: SwiftUI.
   Language: Swift. Save it anywhere.

2. **Add these source files.** Delete the auto-generated `ContentView.swift`
   and `MySpyLifeApp.swift` from the new project, then drag the entire
   contents of this repo's `MySpyLife/` folder (Theme.swift, Models,
   Services, Views, Data, MySpyLifeApp.swift) into the project navigator.
   Check "Copy items if needed."

3. **Enable HealthKit.** Select the project → your app target →
   Signing & Capabilities → "+ Capability" → HealthKit.

4. **Add the privacy string.** Target → Info tab → add key
   `Privacy - Health Share Usage Description` with value:
   `My Spy Life reads your stand hours, steps, and mindful minutes to power Agent 86's stamina, strength, and intelligence in the field.`

5. **Run it.** Plug in your iPhone, select it as the run destination, press
   ▶. First run: enable Developer Mode on the phone if prompted
   (Settings → Privacy & Security → Developer Mode), and trust your
   Apple ID under Settings → General → VPN & Device Management.

   Note: HealthKit returns no data in the Simulator — test on the real phone.

## Push to GitHub

From Terminal, inside the project folder:

```bash
git init
git add .
git commit -m "SYS// COLD BOOT — initial commit"
gh repo create my-spy-life --private --source=. --push
```

(Or create an empty repo at github.com and follow its "push an existing
repository" instructions.)

## Roadmap ideas

- Missions: multi-day objectives ("Get Agent 86 through the Alps: 30k steps this week")
- Notifications: Agent 86 radios in when your rings stall
- Streaks as "days survived in the field"
- Apple Watch complication showing uplink integrity
- App Store release via TestFlight ($99/yr Apple Developer Program)

## Status codes

| Uplink | Status |
|--------|--------|
| 85%+   | VITALS OPTIMAL |
| 50–84% | VITALS NOMINAL |
| 20–49% | VITALS DEGRADED |
| <20%   | VITALS CRITICAL |

SECURE THIS TERMINAL // DO NOT SHARE
