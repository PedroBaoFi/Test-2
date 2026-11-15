/* =====================================================================
   OrbitFit — ALL editable content lives in this file.
   To add content, copy an existing entry and change the text:
     • a daily mission  -> CONTENT.tasks.space / CONTENT.tasks.earth / CONTENT.envTasks.<env>
     • a quiz lesson    -> CONTENT.lessons
     • an SOS scenario  -> CONTENT.sos.space / CONTENT.sos.earth
     • a vital sign     -> CONTENT.vitals
     • a source link    -> CONTENT.sources  (then reference it with src:'key')
   No build step. Save the file and refresh the browser.
   ===================================================================== */

const CONTENT = {
  app: { name: "OrbitFit", tagline: "Train your body like an astronaut — wherever you live." },
  xpPerLevel: 100,
  dailyBonusXp: 20,
  ranks: ["Cadet", "Crew Member", "Flight Engineer", "Mission Specialist", "Commander"],

  /* ---------- Sources (every fact points to one of these) ---------- */
  sources: {
    hazards:  { label: "NASA HRP – 5 Hazards of Human Spaceflight", url: "https://www.nasa.gov/hrp/hazards/" },
    risks:    { label: "NASA HRP – Risks of Human Spaceflight", url: "https://www.nasa.gov/hrp/risks/" },
    research: { label: "NASA HRP – Ongoing HRP Research", url: "https://www.nasa.gov/hrp/ongoing-hrp-research/" },
    radiation:{ label: "NASA HRP – Space Radiation hazard", url: "https://www.nasa.gov/hrp/hazard-space-radiation/" },
    csaRad:   { label: "CSA – Monitoring radiation for astronaut health (2026)", url: "https://www.asc-csa.gc.ca/eng/news/articles/2026/2026-02-26-monitoring-radiation-astronaut-health.asp" },
    csaSci:   { label: "CSA – Why do we conduct science experiments in space?", url: "https://www.asc-csa.gc.ca/eng/iss/science/why-do-we-conduct-science-experiments-in-space.asp" },
    who:      { label: "WHO – Physical activity fact sheet", url: "https://www.who.int/news-room/fact-sheets/detail/physical-activity" },
    challenge:{ label: "NASA Space Apps 2026 – Health Monitoring Software", url: "https://www.spaceappschallenge.org/2026/challenges/health-monitoring-software/?tab=details" }
  },

  /* ---------- Environments (the selector at the top) ---------- */
  environments: [
    { id: "earth", kind: "earth", icon: "🌍", name: "Earth", gravity: "1 g", delay: "None",
      brief: "Space research shows what happens when the body stops moving: effects similar to accelerated aging and a sedentary lifestyle. On Earth, we fight the same enemies — inactivity and sun radiation.",
      focus: ["Sedentary lifestyle", "Sun (UV) radiation", "Sleep & stress"], src: "csaSci" },
    { id: "leo", kind: "space", icon: "🛰️", name: "Low Earth Orbit", gravity: "Microgravity", delay: "Near real-time",
      brief: "On the space station, muscles, bones, heart and eyes adapt to weightlessness. Exercise, nutrition and monitoring keep the crew healthy.",
      focus: ["Bone & muscle loss", "Fluid shifts & vision", "Neutron radiation (~30% of ISS dose)"], src: "risks" },
    { id: "moon", kind: "space", icon: "🌙", name: "Moon", gravity: "~1/6 g", delay: "~1.3 s one way",
      brief: "A short trip (about three days) but a new gravity level, spacewalks on the surface and no atmosphere to shield radiation.",
      focus: ["Gravity transitions", "Spacewalk (EVA) risks", "Solar particle events"], src: "hazards" },
    { id: "mars", kind: "space", icon: "🔴", name: "Mars", gravity: "3/8 g", delay: "~3–22 min one way",
      brief: "Roughly three years away from Earth on a journey of about 140 million miles. Crews live and work in three-eighths of Earth's gravity for up to two years and must be self-sufficient.",
      focus: ["Distance & communication delay", "Isolation & confinement", "Long-term radiation"], src: "hazards" },
    { id: "deep", kind: "space", icon: "🚀", name: "Deep Space", gravity: "Microgravity", delay: "Grows with distance",
      brief: "Beyond the protection of Earth's magnetic field: galactic cosmic rays, long isolation and less ability to rely on Earth for food, materials or emergency medical help.",
      focus: ["Galactic cosmic rays", "Isolation", "Medical self-reliance"], src: "csaSci" }
  ],

  /* ---------- Body regions (colors change as you train them) ---------- */
  regions: {
    mind:   { name: "Mind & Sleep", icon: "🧠",
      space: "Isolation, radiation, distance from Earth and chronic sleep loss can all take a toll on mental health. Irregular schedules disturb the body's internal clock.",
      earth: "Poor sleep, stress and loneliness hit performance and mood — the same stressors astronauts manage in orbit.",
      src: "risks" },
    heart:  { name: "Heart & Circulation", icon: "❤️",
      space: "Weightlessness alters blood circulation and how the heart and blood vessels function, and can change the eyes and brain (SANS).",
      earth: "A sedentary lifestyle weakens the cardiovascular system. Tracking heart rate and blood pressure catches problems early.",
      src: "risks" },
    gut:    { name: "Nutrition", icon: "🍎",
      space: "A healthy, balanced diet is essential for crew health and performance. Inadequate food and nutrition is a tracked spaceflight risk.",
      earth: "Balanced meals and hydration fuel recovery, sleep and immunity.",
      src: "risks" },
    muscle: { name: "Muscles & Bones", icon: "💪",
      space: "Without gravity, bones break down and become more brittle. Astronauts exercise to counteract losses in bone density and muscle strength.",
      earth: "Inactivity causes similar losses on Earth — about 3 in 10 adults worldwide do not move enough.",
      src: "risks" },
    shield: { name: "Skin & Radiation Shield", icon: "🛡️",
      space: "Space radiation is invisible and one of the most hazardous aspects of spaceflight. Crews exposed to it may be more likely to develop cancer.",
      earth: "UV radiation from the Sun is Earth's everyday radiation hazard. Daily protection builds a lifelong habit.",
      src: "radiation" }
  },

  /* ---------- Daily missions ----------
     id: unique • region: mind|heart|gut|muscle|shield • xp: reward • gain: body points (default 15)
     auto:'vitals' -> completes automatically when the player logs a vital sign              */
  tasks: {
    space: [
      { id: "sp-exercise", region: "muscle", icon: "🏋️", title: "Exercise 30 min (resistive + aerobic)", xp: 15,
        why: "All astronauts exercise during their mission to counteract losses in bone density, muscle strength, and heart and blood vessel performance.", src: "risks" },
      { id: "sp-meals", region: "gut", icon: "🍽️", title: "Eat every planned meal", xp: 10,
        why: "A balanced diet is essential for crew health. NASA studies how to make long-lasting meals that are also enjoyable.", src: "risks" },
      { id: "sp-sleep", region: "mind", icon: "😴", title: "Keep your sleep schedule (7+ h)", xp: 10,
        why: "Chronic sleep loss and irregular body clocks are tracked risks. Artemis II crews wore wrist actigraphy devices to record motion, sleep and light exposure.", src: "research" },
      { id: "sp-connect", region: "mind", icon: "💬", title: "Connect: call, message or share a meal with the crew", xp: 10,
        why: "Isolation and confinement change behavior. NASA even studied whether growing vegetables in space can ease the sense of isolation.", src: "research" },
      { id: "sp-fluids", region: "heart", icon: "👁️", title: "Vision & fluid-shift check", xp: 10,
        why: "Spaceflight shifts fluids and can change the structure of eyes and brain (SANS). Report blurred vision or a feeling of head fullness. NASA is testing thigh cuffs and B vitamins as countermeasures.", src: "risks" },
      { id: "sp-radcheck", region: "shield", icon: "☢️", title: "Check dosimeter & space-weather status", xp: 10,
        why: "Space radiation is invisible and considered one of the most hazardous aspects of spaceflight.", src: "hazards" },
      { id: "sp-vitals", region: "heart", icon: "📟", title: "Log a vital sign in the Health tab", xp: 10, auto: "vitals",
        why: "NASA's Standard Measures collect a consistent set of physiological and psychological data from every crew member.", src: "research" }
    ],
    earth: [
      { id: "ea-move", region: "muscle", icon: "🏃", title: "Move 30 min: walk, run, train", xp: 15,
        why: "Astronaut studies show weightlessness mimics a sedentary lifestyle. Move daily and you protect bones, muscles and heart.", src: "csaSci" },
      { id: "ea-breaks", region: "muscle", icon: "🧍", title: "Stand up & move 2 min every hour", xp: 10,
        why: "WHO: all age groups should limit the time spent sedentary, and any amount of activity is better than none.", src: "who" },
      { id: "ea-spf", region: "shield", icon: "🧴", title: "Apply SPF 30+ sunscreen", xp: 15,
        why: "UV from the Sun is Earth's everyday radiation hazard. Astronauts rely on shielding for the same reason — protection works best as a daily streak." },
      { id: "ea-meals", region: "gut", icon: "🥗", title: "Eat balanced meals & drink water", xp: 10,
        why: "Good nutrition is essential for health and performance on Earth and in space.", src: "risks" },
      { id: "ea-sleep", region: "mind", icon: "😴", title: "Sleep 7+ h, screens off before bed", xp: 10,
        why: "Chronic sleep loss and irregular schedules are major stressors for crews — and for everyone else.", src: "risks" },
      { id: "ea-connect", region: "mind", icon: "💬", title: "Talk to someone you care about", xp: 10,
        why: "Isolation affects behavior and mood. Staying connected is a countermeasure.", src: "hazards" },
      { id: "ea-vitals", region: "heart", icon: "📟", title: "Log a vital sign in the Health tab", xp: 10, auto: "vitals",
        why: "Regular self-monitoring catches changes early — the idea behind NASA's Standard Measures.", src: "research" }
    ]
  },
  // Extra missions that appear only in one environment
  envTasks: {
    moon: [
      { id: "mn-balance", region: "muscle", icon: "⚖️", title: "Balance & head-turn drill (5 min)", xp: 10,
        why: "Astronauts can get dizzy and lose hand-eye or gait coordination during gravity changes. NASA is simulating manual piloting for Moon landings.", src: "risks" },
      { id: "mn-eva", region: "heart", icon: "🧑‍🚀", title: "Pre-spacewalk check: pressure, O₂ and CO₂", xp: 15,
        why: "Spacewalks add risks such as decompression sickness, low oxygen and high carbon dioxide.", src: "risks" }
    ],
    mars: [
      { id: "mr-balance", region: "muscle", icon: "⚖️", title: "Balance & head-turn drill (5 min)", xp: 10,
        why: "Bodies must adjust to 3/8 of Earth's gravity for up to two years.", src: "hazards" },
      { id: "mr-comms", region: "mind", icon: "📡", title: "Plan tomorrow's messages (replies take minutes)", xp: 10,
        why: "Instructions, supplies and medical care get harder to receive as astronauts venture deeper into space — planning and self-sufficiency are key.", src: "hazards" }
    ],
    deep: [
      { id: "dp-shelter", region: "shield", icon: "🛡️", title: "Radiation-shelter drill (know your route)", xp: 15,
        why: "Beyond Earth's protection, solar particle events and galactic cosmic rays are major hazards.", src: "radiation" }
    ]
  },

  /* ---------- Quiz lessons ----------
     kind: 'space' | 'earth' | 'both' • q: question • a: answers • c: index of the correct answer • e: explanation */
  lessons: [
    { id: "L-hazards", kind: "space", icon: "🪐", title: "The 5 Hazards", region: "mind", src: "hazards", q: [
      { q: "Which is NOT one of NASA's five hazards of human spaceflight?", a: ["Space radiation", "Distance from Earth", "Light pollution", "Gravity fields"], c: 2,
        e: "The five are space radiation, isolation & confinement, distance from Earth, gravity fields, and hostile/closed environments." },
      { q: "On average, how far is Mars from Earth?", a: ["14 million miles", "140 million miles", "1.4 billion miles", "40 million miles"], c: 1,
        e: "About 140 million miles — a trip of roughly three years round trip versus about three days to the Moon." },
      { q: "How strong is gravity on Mars compared with Earth?", a: ["Three-eighths", "Half", "Same", "One-tenth"], c: 0,
        e: "Crews would live in three-eighths of Earth's gravity for up to two years." }
    ]},
    { id: "L-bones", kind: "space", icon: "🦴", title: "Bones & Muscles", region: "muscle", src: "risks", q: [
      { q: "What happens to bones without gravity?", a: ["They get denser", "They break down and become more brittle", "Nothing changes", "They grow longer"], c: 1,
        e: "Bones lose density and become more brittle, raising the chance of painful breaks." },
      { q: "Why do astronauts exercise every day?", a: ["For fun", "To counteract bone, muscle and heart losses", "To stay warm", "To burn cabin air"], c: 1,
        e: "Exercise counteracts losses in bone density, muscle strength, and heart and blood vessel performance." },
      { q: "NASA's Zero T2 study looks at…", a: ["Sleep without pillows", "Exercise in space without a treadmill", "Food without salt", "Zero-gravity haircuts"], c: 1,
        e: "Zero T2 examines how exercising without a treadmill affects health and performance before deep space missions." }
    ]},
    { id: "L-rad", kind: "space", icon: "☢️", title: "Radiation", region: "shield", src: "csaRad", q: [
      { q: "About how much of the total radiation dose on the ISS is neutron radiation?", a: ["3%", "10%", "30%", "90%"], c: 2,
        e: "Neutron radiation contributes about 30% of total radiation on the ISS and is especially harmful." },
      { q: "What does the Canadian Active Neutron Spectrometer (CANS) do?", a: ["Grows plants", "Measures neutron radiation continuously and autonomously", "Cleans air", "Sends emails"], c: 1,
        e: "CANS is a compact, autonomous instrument that measures neutron radiation exposure in space." },
      { q: "Radiation-detection data could also help on Earth with…", a: ["Cancer therapy and aircrew protection", "Cooking", "Weather apps", "Video games"], c: 0,
        e: "CSA lists cancer therapy, radiation protection for aircrews, nuclear threat detection and public safety." }
    ]},
    { id: "L-mind", kind: "space", icon: "🧠", title: "Mind & Sleep", region: "mind", src: "research", q: [
      { q: "What does the ARCHeR wrist device measure?", a: ["Motion, sleep patterns and light exposure", "Blood sugar", "Radiation only", "Air quality"], c: 0,
        e: "Select Artemis II astronauts wore it to monitor well-being, activity and sleep." },
      { q: "Why did NASA study space gardening?", a: ["To save money", "To see if it eases isolation and confinement", "To fix the engines", "To make oxygen"], c: 1,
        e: "Growing fresh vegetables may help crews cope with isolation." },
      { q: "Which is a recognised stressor on crews?", a: ["Too much gravity", "Chronic sleep loss and irregular body clocks", "Too many windows", "Sunburn"], c: 1,
        e: "Chronic sleep loss, constant work demands and circadian irregularities are tracked risks." }
    ]},
    { id: "L-eyes", kind: "space", icon: "👁️", title: "Eyes & Fluids", region: "heart", src: "research", q: [
      { q: "What is SANS?", a: ["A sleep disorder", "Spaceflight Associated Neuro-ocular Syndrome", "A food group", "A radiation shield"], c: 1,
        e: "The structure of the eyes and brain can change with spaceflight." },
      { q: "What are thigh cuffs meant to do?", a: ["Warm the legs", "Keep more fluid in the legs", "Measure heart rate", "Train muscles"], c: 1,
        e: "NASA tests whether tight thigh cuffs could avert the eye disorders that develop in space." },
      { q: "What does the B-Complex study test?", a: ["A daily B-vitamin supplement for brain and eye changes", "A new treadmill", "A sleeping bag", "A radiation vest"], c: 0,
        e: "It investigates whether B vitamins can prevent or mitigate brain and eye changes in space." }
    ]},
    { id: "L-far", kind: "space", icon: "📡", title: "Far from Earth", region: "mind", src: "csaSci", q: [
      { q: "Which is a risk of longer Moon and Mars missions?", a: ["Less ability to rely on Earth for food, materials and emergency medical help", "Faster internet", "Less isolation", "Cheaper meals"], c: 0,
        e: "Longer missions also mean more weightlessness, more radiation and bigger communication delays." },
      { q: "What is NASA's Tempus Pro experiment?", a: ["A food pouch", "A commercial telemedicine device collecting and integrating health data", "A spacesuit", "A treadmill"], c: 1,
        e: "It could enable remote, near real-time diagnoses." },
      { q: "A lunar trip takes about three days. A Mars mission takes about…", a: ["Three weeks", "Three months", "Three years", "Three decades"], c: 2,
        e: "Planning and self-sufficiency are key for multi-year missions." }
    ]},
    { id: "L-link", kind: "both", icon: "🔗", title: "Space ↔ Earth", region: "muscle", src: "csaSci", q: [
      { q: "Weightlessness effects on the body resemble…", a: ["Accelerated aging and a sedentary lifestyle", "Growing taller", "Better eyesight", "Nothing"], c: 0,
        e: "Studying astronauts helps us understand the impacts of reduced physical activity." },
      { q: "Six months in space gives data that would take…", a: ["Days on Earth", "Years to gather on Earth", "Seconds", "No time"], c: 1,
        e: "That is why space is a fast lab for health research." },
      { q: "Space health research has produced findings that help with…", a: ["Osteoporosis, balance problems, cardiovascular disorders and Type-2 diabetes", "Only rocket fuel", "Only sleep", "Nothing on Earth"], c: 0,
        e: "Canadian scientists study bones, heart, blood vessels and brain in space to help people on Earth." }
    ]},
    { id: "L-sit", kind: "earth", icon: "🪑", title: "The Sitting Problem", region: "muscle", src: "who", q: [
      { q: "About what share of adults worldwide do not meet recommended activity levels?", a: ["About 3%", "About 10%", "About 31%", "About 80%"], c: 2,
        e: "WHO: 31% of adults — roughly 1.8 billion people — in 2022." },
      { q: "WHO recommends adults get at least…", a: ["150 min moderate activity per week", "5 min per week", "10 hours per day", "Only weekends"], c: 0,
        e: "Or 75 minutes of vigorous activity, or an equivalent combination." },
      { q: "Which statement matches WHO guidance?", a: ["Only gym workouts count", "Any amount of activity is better than none", "Sitting is healthy", "Muscle training is only for athletes"], c: 1,
        e: "All activity counts, sedentary time should be limited, and muscle strengthening benefits everyone." }
    ]},
    { id: "L-sun", kind: "earth", icon: "☀️", title: "Sun Shield", region: "shield", q: [
      { q: "Sun radiation on Earth is mainly…", a: ["Ultraviolet (UV)", "Neutron", "Sound", "Magnetic"], c: 0,
        e: "UV is the radiation that burns skin and is the Earth version of the radiation hazard." },
      { q: "When is UV usually strongest?", a: ["Around midday", "At night", "Sunrise only", "Never"], c: 0,
        e: "Seek shade, wear a hat and apply sunscreen especially in the middle of the day." },
      { q: "Why keep a sunscreen streak?", a: ["Protection is a daily habit that adds up", "It is decoration", "Only for beaches", "It replaces sleep"], c: 0,
        e: "Consistent daily protection is the point — just like consistent shielding for crews." }
    ]}
  ],

  /* ---------- Vital signs (the challenge's example health indicators) ----------
     ok = typical adult range • watch = caution range • outside both = alert. Demo values only. */
  vitals: [
    { id: "hr",    name: "Heart rate",        icon: "❤️", unit: "bpm",  min: 30,  max: 220, ok: [50, 100], watch: [40, 120], region: "heart",
      why: "Weightlessness alters how the heart and blood vessels function.", src: "risks" },
    { id: "bp",    name: "Blood pressure (systolic)", icon: "🩸", unit: "mmHg", min: 60, max: 220, ok: [90, 129], watch: [80, 139], region: "heart",
      why: "Cardiovascular adaptations can raise the risk of cardiovascular events.", src: "risks" },
    { id: "glu",   name: "Blood sugar",       icon: "🍬", unit: "mg/dL", min: 30, max: 400, ok: [70, 125], watch: [60, 180], region: "gut",
      why: "Nutrition and metabolism matter on long missions; space research also informs Type-2 diabetes.", src: "csaSci" },
    { id: "temp",  name: "Body temperature",  icon: "🌡️", unit: "°C",   min: 33,  max: 42,  ok: [36.0, 37.5], watch: [35.0, 38.0], region: "heart",
      why: "Fever can signal infection; spaceflight stress can reactivate dormant viruses.", src: "risks" },
    { id: "sleep", name: "Sleep last night",  icon: "😴", unit: "h",    min: 0,   max: 16,  ok: [7, 10], watch: [6, 12], region: "mind",
      why: "Chronic sleep loss is a tracked spaceflight risk.", src: "risks" },
    { id: "mood",  name: "Mood (1 = low, 5 = great)", icon: "🙂", unit: "/5", min: 1, max: 5, ok: [3, 5], watch: [2, 5], region: "mind", scale: true,
      why: "Behavioral health is monitored throughout long missions.", src: "risks" }
  ],
  vitalMessages: {
    good: "Within the typical range. Keep it up!",
    watch: "Slightly outside the typical range. Re-check later and review sleep, food and hydration.",
    alert: "Outside the typical range. Re-measure, and if it persists open the SOS tab or contact your medical officer."
  },

  /* ---------- SOS: quick triage. Each scenario is a tiny decision tree ----------
     node: { q, o:[[label,nextNodeId],...] }  or  { r: {sev:'critical|caution|ok', t, steps:[...]} } */
  sosDisclaimer: "Educational prototype. Real crews follow flight-surgeon procedures — this does not replace medical training.",
  sos: {
    space: [
      { id: "unresp", icon: "🚨", title: "Crewmate unresponsive", start: "a", n: {
        a: { q: "Does the crewmate respond when you call their name and tap their shoulders?", o: [["Yes, responding", "ok"], ["No response", "b"]] },
        ok: { r: { sev: "caution", t: "Awake but unwell", steps: ["Stay with them and keep them still and secured.", "Ask what happened; check pulse, breathing and temperature and log them.", "Alert the crew medical officer and ground control.", "Re-check every few minutes."] } },
        b: { q: "Are they breathing normally?", o: [["Yes", "c"], ["No / only gasping", "d"]] },
        c: { r: { sev: "caution", t: "Unresponsive but breathing", steps: ["Call for help: alert the crew and ground now.", "Secure the patient and keep the airway open.", "Check the cabin air alarms (O₂ low / CO₂ high).", "Monitor breathing and pulse continuously until the medical officer takes over."] } },
        d: { r: { sev: "critical", t: "Not breathing — start CPR", steps: ["Call for help: alert the whole crew and ground immediately.", "Secure yourself and the patient — in microgravity you need restraint to push.", "Start chest compressions and rescue breaths; use the defibrillator if available.", "Continue until the medical officer takes over or instructed to stop."] } }
      }},
      { id: "air", icon: "🫁", title: "Chest pain / can't breathe / confused", start: "a", n: {
        a: { q: "Are cabin air alarms active, or are other crew feeling the same?", o: [["Yes", "x"], ["No, only one person", "y"]] },
        x: { r: { sev: "critical", t: "Possible hypoxia or high CO₂", steps: ["Alert everyone and follow the cabin air emergency procedure.", "Move to known-good air or don emergency breathing equipment.", "Check each crew member for confusion or blue lips.", "Report to ground and begin fault isolation."] } },
        y: { r: { sev: "critical", t: "Possible cardiac or respiratory problem", steps: ["Stop all activity and secure them comfortably.", "Give supplemental oxygen if available and log pulse, blood pressure and oxygen saturation.", "Alert the medical officer and ground now.", "Be ready to start CPR if they stop breathing."] } }
      }},
      { id: "dcs", icon: "🧑‍🚀", title: "Joint pain or tingling after a spacewalk", start: "a", n: {
        a: { q: "Did symptoms start within hours of a spacewalk or a pressure change?", o: [["Yes", "x"], ["No", "y"]] },
        x: { r: { sev: "critical", t: "Possible decompression sickness", steps: ["Return to the pressurized area and keep them at rest.", "Dissolved nitrogen may be bubbling in tissues — alert ground at once.", "Follow the decompression-sickness treatment procedure (oxygen and repressurization).", "Monitor for worsening pain, numbness or breathing trouble."] } },
        y: { r: { sev: "ok", t: "Likely strain or overuse", steps: ["Rest the area and note which joints hurt.", "Review exercise load and posture.", "Log it in the Health tab and tell the medical officer if it persists."] } }
      }},
      { id: "dizzy", icon: "💫", title: "Dizzy, nauseous or off-balance", start: "a", n: {
        a: { q: "Did it start after a gravity change (launch, landing, new surface)?", o: [["Yes", "x"], ["No", "y"]] },
        x: { r: { sev: "caution", t: "Likely sensorimotor adaptation", steps: ["Move slowly and keep handholds nearby.", "Avoid piloting, driving or spacewalks until it settles.", "Hydrate, rest and report it.", "Balance drills help the body adapt."] } },
        y: { r: { sev: "caution", t: "Unexplained dizziness", steps: ["Sit or secure yourself and check vitals.", "Ask about head impact, illness or air alarms.", "Contact the medical officer if it lasts or worsens."] } }
      }},
      { id: "mental", icon: "🫂", title: "Crewmate withdrawn or on edge", start: "a", n: {
        a: { q: "Are they talking about harming themselves or others?", o: [["Yes", "x"], ["No", "y"]] },
        x: { r: { sev: "critical", t: "Safety concern", steps: ["Stay with them; do not leave them alone.", "Remove hazards calmly.", "Alert the commander and ground behavioral health immediately."] } },
        y: { r: { sev: "caution", t: "Isolation stress", steps: ["Listen without judging.", "Encourage sleep, exercise and connection.", "Schedule a private call with ground behavioral health.", "Adjust workload where possible."] } }
      }},
      { id: "spe", icon: "☢️", title: "Radiation alarm / solar storm", start: "a", n: {
        a: { q: "Is a solar particle event alert active?", o: [["Yes", "x"], ["Not sure / no", "y"]] },
        x: { r: { sev: "critical", t: "Go to the radiation shelter", steps: ["Move everyone to the most shielded area.", "Bring back any crew on a spacewalk immediately.", "Stay sheltered until the all-clear and log the time.", "Report symptoms (nausea, fatigue) to the medical officer."] } },
        y: { r: { sev: "ok", t: "Verify the status", steps: ["Check dosimeters and space-weather feed.", "Limit spacewalks until confirmed.", "Open the Radiation tab to review shelter steps."] } }
      }}
    ],
    earth: [
      { id: "unresp", icon: "🚨", title: "Person unresponsive", start: "a", n: {
        a: { q: "Do they respond when you shout and tap their shoulders?", o: [["Yes", "ok"], ["No", "b"]] },
        ok: { r: { sev: "caution", t: "Awake but unwell", steps: ["Stay with them and ask what happened.", "Call your local emergency number if symptoms are serious.", "Keep them comfortable and monitor."] } },
        b: { q: "Are they breathing normally?", o: [["Yes", "c"], ["No / only gasping", "d"]] },
        c: { r: { sev: "caution", t: "Unresponsive but breathing", steps: ["Call your local emergency number (e.g., 112, 911, 192).", "Place them on their side and keep the airway open.", "Stay until help arrives."] } },
        d: { r: { sev: "critical", t: "Not breathing — start CPR", steps: ["Call your local emergency number now (e.g., 112, 911, 192).", "Push hard and fast in the center of the chest; use an AED if available.", "Continue until help arrives."] } }
      }},
      { id: "chest", icon: "🫀", title: "Chest pain / can't breathe", start: "a", n: {
        a: { r: { sev: "critical", t: "Treat as an emergency", steps: ["Call your local emergency number immediately (e.g., 112, 911, 192).", "Sit them down, loosen tight clothes and keep them calm.", "Be ready to start CPR if they stop breathing."] } }
      }},
      { id: "sun", icon: "🥵", title: "Sunburn or heat illness", start: "a", n: {
        a: { q: "Confused, vomiting, very hot skin or fainting?", o: [["Yes", "x"], ["No", "y"]] },
        x: { r: { sev: "critical", t: "Possible heat stroke", steps: ["Call your local emergency number.", "Move to shade and cool the body (wet cloths, fan).", "Do not leave them alone."] } },
        y: { r: { sev: "caution", t: "Sunburn or heat exhaustion", steps: ["Move to shade and drink water.", "Cool the skin with a damp cloth.", "Avoid more sun and start your sunscreen streak tomorrow."] } }
      }},
      { id: "dizzy", icon: "💫", title: "Dizzy or faint", start: "a", n: {
        a: { q: "Did they lose consciousness or have chest pain?", o: [["Yes", "x"], ["No", "y"]] },
        x: { r: { sev: "critical", t: "Seek emergency care", steps: ["Call your local emergency number.", "Lay them down and keep them still."] } },
        y: { r: { sev: "ok", t: "Likely mild", steps: ["Sit or lie down; drink water and eat something.", "Rise slowly.", "See a doctor if it keeps happening."] } }
      }},
      { id: "mental", icon: "🫂", title: "Someone feels very low or anxious", start: "a", n: {
        a: { q: "Are they talking about harming themselves?", o: [["Yes", "x"], ["No", "y"]] },
        x: { r: { sev: "critical", t: "Get help now", steps: ["Stay with them and remove hazards.", "Call your local emergency number or crisis line.", "Do not leave them alone."] } },
        y: { r: { sev: "caution", t: "Support them", steps: ["Listen without judging.", "Encourage sleep, movement and connection.", "Suggest talking to a health professional."] } }
      }}
    ]
  },

  /* ---------- Radiation tab ---------- */
  radiation: {
    space: {
      title: "Space radiation status",
      levels: [
        { name: "Quiet", color: "ok", advice: ["Normal operations.", "Keep wearing your dosimeter and log the daily check."] },
        { name: "Elevated", color: "watch", advice: ["Space weather is active: limit spacewalks.", "Stay within reach of the shielded area.", "Review shelter steps."] },
        { name: "Solar particle event", color: "alert", advice: ["Shelter now in the most shielded area.", "Recall any crew outside.", "Stay until the all-clear."] }
      ],
      facts: [
        { t: "Particle radiation", d: "Invisible, stealthy and one of the most hazardous aspects of spaceflight.", src: "hazards" },
        { t: "Solar particle events & galactic cosmic rays", d: "Two main sources of space radiation beyond Earth's protection.", src: "radiation" },
        { t: "Health effects", d: "Crews exposed to space radiation may be more likely to develop cancer; radiation can also damage DNA and the central nervous system.", src: "risks" },
        { t: "Neutrons ≈ 30% of the ISS dose", d: "Canada's CANS instrument is being developed to measure neutron exposure continuously and autonomously.", src: "csaRad" },
        { t: "Back on Earth", d: "This technology could help cancer therapy, aircrew radiation protection and public safety.", src: "csaRad" }
      ]
    },
    earth: {
      title: "UV index today",
      levels: [
        { name: "Low (0–2)", color: "ok", advice: ["Low risk, but sunglasses help.", "Keep the sunscreen habit going."] },
        { name: "Moderate (3–5)", color: "watch", advice: ["Apply SPF 30+.", "Seek shade at midday."] },
        { name: "High (6–7)", color: "watch", advice: ["Apply SPF 30+ and reapply every 2 hours.", "Wear a hat and sunglasses."] },
        { name: "Very high (8–10)", color: "alert", advice: ["Avoid midday sun.", "Cover up, shade, and reapply sunscreen."] },
        { name: "Extreme (11+)", color: "alert", advice: ["Stay in shade as much as possible.", "Full protection: sunscreen, hat, long sleeves."] }
      ],
      facts: [
        { t: "Earth's radiation hazard", d: "UV from the Sun is the radiation most people face every day. Space radiation research teaches us to respect shielding on Earth too." },
        { t: "Streaks win", d: "Consistent daily protection beats occasional protection. Keep your sunscreen streak alive." },
        { t: "From space to Earth", d: "Radiation-monitoring technology has applications in cancer therapy and protecting aircrews.", src: "csaRad" }
      ]
    }
  },

  /* ---------- Badges ---------- */
  badges: [
    { id: "first", icon: "🌱", name: "First Step", desc: "Complete your first mission" },
    { id: "streak3", icon: "🔥", name: "3-Day Streak", desc: "Train 3 days in a row" },
    { id: "streak7", icon: "🌋", name: "7-Day Streak", desc: "Train 7 days in a row" },
    { id: "greens", icon: "💚", name: "Fully Fit", desc: "Get every body region to green" },
    { id: "quiz", icon: "🎓", name: "Perfect Quiz", desc: "Answer every question right in a lesson" },
    { id: "traveler", icon: "🧭", name: "Space Traveler", desc: "Visit 3 different environments" }
  ],

  /* ---------- How OrbitFit maps to NASA research (shown in Science panel) ---------- */
  science: [
    { n: "ARCHeR (Artemis II)", d: "Wrist actigraphy monitored activity, sleep and light.", used: "Sleep & activity missions, Mind region.", src: "research" },
    { n: "Standard Measures", d: "A consistent set of physiological and psychological measurements.", used: "The Health tab (heart rate, BP, glucose, temperature, sleep, mood).", src: "research" },
    { n: "Tempus Pro", d: "Telemedicine device integrating health data for remote diagnosis.", used: "SOS triage and color-coded health status.", src: "research" },
    { n: "Space Gardening", d: "Fresh vegetables may ease isolation.", used: "Connection & mind missions.", src: "research" },
    { n: "Zero T2 / exercise research", d: "Which exercise best protects bone, muscle and heart.", used: "Muscle & Bone missions.", src: "research" },
    { n: "Thigh Cuff / B-Complex", d: "Countermeasures for eye and brain changes (SANS).", used: "Vision & fluid-shift check.", src: "research" },
    { n: "CANS neutron spectrometer", d: "Autonomous neutron radiation measurement.", used: "Radiation tab.", src: "csaRad" }
  ]
};
