# 🚀 OrbitFit — Health Monitoring for Astronauts (and the rest of us)

**NASA Space Apps Challenge 2026 · Health Monitoring Software**

OrbitFit is a Duolingo-style health companion. Pick your environment — **Earth, Low Earth Orbit, Moon, Mars or Deep Space** — complete daily missions, log vital signs, learn from short NASA-based lessons and keep a streak going.

> **Space ↔ Earth:** the effects of weightlessness resemble accelerated aging and a sedentary lifestyle ([CSA](https://www.asc-csa.gc.ca/eng/iss/science/why-do-we-conduct-science-experiments-in-space.asp)). So Earth is a first-class environment: sedentary habits replace microgravity, and a **sunscreen streak** replaces the space-radiation shield.

## ▶ Try it (no install)

- **Live demo (GitHub Pages):** after you push, enable *Settings → Pages → Deploy from branch → `main` / root*. The site will be at `https://<your-user>.github.io/<repo>/`.
- **Locally:** just double-click `index.html`. No server, no build, no dependencies.

## Features (mapped to the challenge)

| Challenge idea | In OrbitFit |
|---|---|
| Health indicators (BP, heart rate, blood sugar, temperature, sleep, mood) | **Health** tab: log, color status (🟢🟡🔴) and trend sparklines |
| Clickable human figure | **Body** tab: tap a region (mind, heart, nutrition, muscles & bones, skin/radiation shield); it changes color as you train it |
| Gamification | Daily missions, XP, levels, streaks, badges, daily bonus |
| Dynamic charts / color coding | Sparklines per vital, color-coded body and statuses |
| Different environments | Earth, LEO, Moon, Mars, Deep Space (gravity, comms delay, focus areas, missions change) |
| What to do in a medical problem | **SOS** tab: quick-question triage trees (unresponsive crewmate, hypoxia, decompression sickness, dizziness, mental health, solar storm) |
| Radiation | **Radiation** tab: space-weather status & shelter steps (space) / UV index & sunscreen streak (Earth) |
| Simple instructions for non-experts | Every mission and vital explains *why* it matters, with a source link |

## Project structure

```
index.html          page shell
css/style.css       styling
js/app.js           app logic (rarely needs editing)
data/content.js     ALL content: missions, lessons, SOS trees, vitals, sources
```

## Adding content (no coding needed)

Open `data/content.js`, copy an existing entry, change the text, save, refresh.

- **New mission:** add to `tasks.space`, `tasks.earth`, or `envTasks.moon|mars|deep`
  `{ id:"unique-id", region:"mind|heart|gut|muscle|shield", icon:"🧘", title:"...", xp:10, why:"...", src:"risks" }`
- **New quiz lesson:** add to `lessons` (`kind: "space" | "earth" | "both"`, each question has `a` answers and `c` = index of the correct one).
- **New SOS scenario:** add to `sos.space` or `sos.earth` (small decision tree).
- **New vital sign:** add to `vitals` with its typical (`ok`) and caution (`watch`) ranges.
- **New source:** add to `sources` and reference it with `src:"key"`.

## Rules of the game

- Completing a mission gives XP and raises its body region (+15 by default).
- Untrained regions lose 8 points per missed day, so the body needs daily training.
- Finishing all missions in a day gives a bonus. Streak = consecutive days with activity.
- Progress is stored in the browser (`localStorage`); nothing leaves the device.

## Data & sources

- NASA HRP — [5 Hazards](https://www.nasa.gov/hrp/hazards/), [Risks](https://www.nasa.gov/hrp/risks/), [Ongoing Research](https://www.nasa.gov/hrp/ongoing-hrp-research/)
- CSA — [Monitoring radiation for astronaut health](https://www.asc-csa.gc.ca/eng/news/articles/2026/2026-02-26-monitoring-radiation-astronaut-health.asp) · [Why do we conduct science experiments in space?](https://www.asc-csa.gc.ca/eng/iss/science/why-do-we-conduct-science-experiments-in-space.asp)
- WHO — [Physical activity fact sheet](https://www.who.int/news-room/fact-sheets/detail/physical-activity) (31% of adults insufficiently active, 2022)
- Challenge — [Health Monitoring Software](https://www.spaceappschallenge.org/2026/challenges/health-monitoring-software/?tab=details)

## Disclaimer

Educational prototype. Reference ranges and SOS steps are simplified for demonstration and are **not medical advice**. Real crews follow flight-surgeon protocols.
