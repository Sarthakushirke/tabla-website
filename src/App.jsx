import { useEffect, useMemo, useRef, useState } from "react";
import { initializeApp } from "firebase/app";
import {
  createUserWithEmailAndPassword,
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const taals = [
  {
    id: 1,
    title: "Teentaal · 16 Beat Cycle",
    shortTitle: "Teentaal",
    category: "Taal Theory + Practice",
    duration: "Interactive",
    matras: 16,
    vibhags: 4,
    beatsPerVibhag: 4,
    tali: [1, 5, 13],
    khali: [9],
    bols: ["Dha", "Dhin", "Dhin", "Dha", "Dha", "Dhin", "Dhin", "Dha", "Dha", "Tin", "Tin", "Ta", "Ta", "Dhin", "Dhin", "Dha"],
    text:
      "Teentaal is one of the most widely used taals in Hindustani classical music. It has 16 beats divided into 4 equal vibhags of 4 beats each. Tali comes on beats 1, 5 and 13, while Khali comes on beat 9.",
  },
  {
    id: 2,
    title: "Dadra · 6 Beat Cycle",
    shortTitle: "Dadra",
    category: "Coming Soon",
    duration: "Practice",
    matras: 6,
    text: "Dadra interactive lesson will be added here next.",
  },
  {
    id: 3,
    title: "Keherva · 8 Beat Cycle",
    shortTitle: "Keherva",
    category: "Coming Soon",
    duration: "Practice",
    matras: 8,
    text: "Keherva interactive lesson will be added here next.",
  },
  {
    id: 4,
    title: "Roopak · 7 Beat Cycle",
    shortTitle: "Roopak",
    category: "Coming Soon",
    duration: "Theory",
    matras: 7,
    text: "Roopak interactive lesson will be added here next.",
  },
  {
    id: 5,
    title: "Jhaptaal · 10 Beat Cycle",
    shortTitle: "Jhaptaal",
    category: "Coming Soon",
    duration: "Theory",
    matras: 10,
    text: "Jhaptaal interactive lesson will be added here next.",
  },
  {
    id: 6,
    title: "Ektaal · 12 Beat Cycle",
    shortTitle: "Ektaal",
    category: "Coming Soon",
    duration: "Theory",
    matras: 12,
    text: "Ektaal interactive lesson will be added here next.",
  },
  {
    id: 7,
    title: "Advanced Taal Practice",
    shortTitle: "Advanced",
    category: "Coming Soon",
    duration: "Practice",
    matras: 16,
    text: "Advanced taal practice and comparison lessons will be added here next.",
  },
];

const speedOptions = {
  vilambit: { label: "Vilambit", bpm: 60, description: "slow" },
  madhya: { label: "Madhya", bpm: 120, description: "medium" },
  drut: { label: "Drut", bpm: 200, description: "fast" },
};

function AppStyles() {
  return (
    <style>{`
      * { box-sizing: border-box; }
      body { margin: 0; font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; background: linear-gradient(180deg, #fffaf5 0%, #fff 45%, #f7f7f8 100%); color: #111827; }
      .app-shell { min-height: 100vh; }
      .topbar { position: sticky; top: 0; z-index: 10; display: flex; align-items: center; justify-content: space-between; padding: 18px 28px; backdrop-filter: blur(10px); background: rgba(255,255,255,0.78); border-bottom: 1px solid rgba(0,0,0,0.06); }
      .brand { display: flex; align-items: center; gap: 12px; font-weight: 800; font-size: 22px; }
      .brand-mark { width: 42px; height: 42px; border-radius: 14px; display: grid; place-items: center; color: #fff; background: linear-gradient(135deg, #111827, #f97316); box-shadow: 0 10px 30px rgba(249,115,22,0.25); }
      .nav, .btn-row { display: flex; gap: 10px; flex-wrap: wrap; align-items: center; }
      .container { max-width: 1220px; margin: 0 auto; padding: 32px 20px 56px; }
      .hero { display: grid; grid-template-columns: 1.3fr 0.9fr; gap: 24px; margin-top: 18px; }
      .hero-card, .card, .level-card, .taal-card { background: rgba(255,255,255,0.9); border: 1px solid rgba(0,0,0,0.06); border-radius: 28px; box-shadow: 0 20px 60px rgba(17,24,39,0.08); }
      .hero-main { padding: 34px; background: linear-gradient(135deg, #111827 0%, #1f2937 48%, #ea580c 100%); color: #fff; }
      .hero-main h1 { margin: 10px 0 14px; font-size: 52px; line-height: 1.05; }
      .hero-main p { font-size: 17px; line-height: 1.8; color: rgba(255,255,255,0.88); max-width: 740px; }
      .pill { display: inline-flex; align-items: center; gap: 8px; background: rgba(255,255,255,0.14); color: #fff; border: 1px solid rgba(255,255,255,0.2); padding: 8px 14px; border-radius: 999px; font-size: 14px; }
      .hero-side, .card, .taal-card { padding: 24px; }
      .mini-list { display: grid; gap: 14px; margin-top: 18px; }
      .mini-item { padding: 16px; border-radius: 18px; background: #fafaf9; border: 1px solid rgba(0,0,0,0.05); }
      .mini-item strong { display: block; margin-bottom: 6px; }
      .btn { border: 0; border-radius: 14px; padding: 12px 18px; font-size: 15px; font-weight: 800; cursor: pointer; transition: transform 0.15s ease, opacity 0.15s ease, box-shadow 0.15s ease; }
      .btn:hover { transform: translateY(-1px); }
      .btn-primary { background: linear-gradient(135deg, #f97316, #ea580c); color: #fff; box-shadow: 0 12px 24px rgba(249,115,22,0.28); }
      .btn-dark { background: #111827; color: #fff; }
      .btn-light { background: #fff; color: #111827; border: 1px solid rgba(0,0,0,0.08); }
      .btn-green { background: #16a34a; color: #fff; box-shadow: 0 12px 24px rgba(22,163,74,0.22); }
      .btn-active { outline: 3px solid rgba(249,115,22,0.18); border: 1px solid #f97316; }
      .stats, .grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 18px; margin-top: 24px; }
      .stat-number { font-size: 34px; font-weight: 900; color: #111827; }
      .section-head { display: flex; align-items: end; justify-content: space-between; gap: 16px; margin: 18px 0 18px; }
      .section-head h2 { margin: 0 0 8px; font-size: 34px; }
      .section-head p, .muted { color: #6b7280; }
      .input { width: 100%; padding: 13px 16px; border-radius: 14px; border: 1px solid rgba(0,0,0,0.08); outline: none; font-size: 15px; background: #fff; }
      .level-card { padding: 22px; }
      .badge { display: inline-block; padding: 7px 12px; border-radius: 999px; background: #fff7ed; color: #c2410c; border: 1px solid #fed7aa; font-size: 12px; font-weight: 800; }
      .meta-row { display: flex; justify-content: space-between; align-items: center; gap: 12px; }
      .login-wrap { min-height: 100vh; display: grid; place-items: center; padding: 24px; }
      .login-card { width: 100%; max-width: 460px; padding: 30px; border-radius: 30px; background: rgba(255,255,255,0.92); border: 1px solid rgba(0,0,0,0.06); box-shadow: 0 30px 80px rgba(17,24,39,0.12); }
      .login-card h1 { margin: 16px 0 8px; font-size: 40px; }
      .field { margin-top: 14px; }
      .label { display: block; margin-bottom: 8px; font-weight: 800; font-size: 14px; }
      .error { margin-top: 14px; padding: 12px 14px; border-radius: 14px; background: #fef2f2; color: #b91c1c; border: 1px solid #fecaca; }
      .footer-note { margin-top: 14px; font-size: 13px; color: #6b7280; line-height: 1.6; }
      .taal-layout { display: grid; grid-template-columns: 260px 1fr 260px; gap: 20px; align-items: start; }
      .cycle-stage { min-height: 680px; position: relative; display: flex; align-items: center; justify-content: center; }
      .cycle-ring { position: relative; width: min(620px, 86vw); height: min(620px, 86vw); border-radius: 50%; background: radial-gradient(circle, #fff 0%, #fff 52%, #fff7ed 53%, #fff 55%, #fef3c7 100%); border: 2px solid #fed7aa; }
      .beat-node { position: absolute; left: 50%; top: 50%; width: 58px; height: 58px; margin-left: -29px; margin-top: -29px; border-radius: 50%; display: grid; place-items: center; font-size: 20px; font-weight: 900; color: #fff; background: #64748b; box-shadow: 0 10px 25px rgba(17,24,39,0.18); transform: rotate(var(--angle)) translateY(-270px) rotate(calc(-1 * var(--angle))); transition: 0.18s ease; }
      .beat-node.active { width: 74px; height: 74px; margin-left: -37px; margin-top: -37px; background: #ef4444; box-shadow: 0 0 0 12px rgba(239,68,68,0.14), 0 20px 35px rgba(239,68,68,0.25); }
      .beat-node.sam { background: #dc2626; }
      .beat-node.tali { background: #f97316; }
      .beat-node.khali { background: #2563eb; }
      .beat-label { position: absolute; left: 50%; top: 50%; width: 86px; margin-left: -43px; text-align: center; font-weight: 800; transform: rotate(var(--angle)) translateY(-207px) rotate(calc(-1 * var(--angle))); }
      .beat-label small { display: block; color: #6b7280; font-weight: 700; margin-top: 4px; }
      .center-info { position: absolute; left: 50%; top: 50%; transform: translate(-50%, -50%); width: 280px; text-align: center; }
      .center-info h2 { margin: 0; font-size: 34px; }
      .sine-mini { margin: 18px auto 8px; width: 210px; height: 90px; }
      .sine-panel svg { width: 100%; height: 140px; overflow: visible; }
      .info-row { display: flex; justify-content: space-between; gap: 10px; padding: 12px 0; border-bottom: 1px solid rgba(0,0,0,0.07); }
      .chip-row { display: flex; gap: 8px; flex-wrap: wrap; align-items: center; }
      .chip { border-radius: 999px; padding: 5px 10px; background: #f3f4f6; font-weight: 800; }
      .chip.red { background: #fee2e2; color: #dc2626; }
      .chip.orange { background: #ffedd5; color: #ea580c; }
      .chip.blue { background: #dbeafe; color: #2563eb; }
      .theka-grid { display: grid; grid-template-columns: repeat(8, 1fr); gap: 12px; }
      .theka-cell { padding: 14px 8px; border-radius: 18px; text-align: center; background: #fafaf9; border: 1px solid rgba(0,0,0,0.05); }
      .theka-cell.active { background: #fff7ed; border-color: #f97316; box-shadow: 0 0 0 4px rgba(249,115,22,0.12); }
      .theka-cell strong { display: block; margin-top: 6px; font-size: 19px; }
      .math-layout { display: grid; grid-template-columns: 1fr 1fr; gap: 18px; margin-top: 22px; }
      @media (max-width: 1050px) { .hero, .taal-layout, .grid, .stats, .math-layout { grid-template-columns: 1fr; } .cycle-stage { min-height: auto; } .cycle-ring { width: 88vw; height: 88vw; max-width: 620px; max-height: 620px; } .beat-node { transform: rotate(var(--angle)) translateY(calc(-44vw + 34px)) rotate(calc(-1 * var(--angle))); } .beat-label { display: none; } .hero-main h1 { font-size: 40px; } }
    `}</style>
  );
}

function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRegister, setIsRegister] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const submit = async () => {
    setLoading(true);
    setError("");
    try {
      if (isRegister) await createUserWithEmailAndPassword(auth, email, password);
      else await signInWithEmailAndPassword(auth, email, password);
    } catch (err) {
      setError(err?.message || "Authentication failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-wrap">
      <AppStyles />
      <div className="login-card">
        <div className="brand"><div className="brand-mark">T</div><span>Tabla</span></div>
        <h1>{isRegister ? "Create account" : "Welcome back"}</h1>
        <p className="muted">{isRegister ? "Create your account to access Tabla theory and practice." : "Login to continue your Tabla learning journey."}</p>
        <div className="field"><label className="label">Email</label><input className="input" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} /></div>
        <div className="field"><label className="label">Password</label><input className="input" type="password" placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)} /></div>
        {error ? <div className="error">{error}</div> : null}
        <div className="btn-row">
          <button className="btn btn-primary" onClick={submit} disabled={loading}>{loading ? "Please wait..." : isRegister ? "Create account" : "Login"}</button>
          <button className="btn btn-light" onClick={() => setIsRegister(!isRegister)}>{isRegister ? "Have an account? Sign in" : "Need an account? Register"}</button>
        </div>
      </div>
    </div>
  );
}

function Header({ page, setPage, onLogout }) {
  return (
    <div className="topbar">
      <div className="brand"><div className="brand-mark">T</div><span>Tabla</span></div>
      <div className="nav">
        <button className={`btn ${page === "home" ? "btn-primary" : "btn-light"}`} onClick={() => setPage("home")}>Home</button>
        <button className={`btn ${page === "levels" ? "btn-primary" : "btn-light"}`} onClick={() => setPage("levels")}>Taals & Practice</button>
        <button className="btn btn-dark" onClick={onLogout}>Logout</button>
      </div>
    </div>
  );
}

function HomePage({ setPage }) {
  return (
    <div className="container">
      <section className="hero">
        <div className="hero-card hero-main">
          <span className="pill">Maths + Tabla + Practice</span>
          <h1>Learn Tabla through interactive taal cycles, rhythm, and mathematical patterns.</h1>
          <p>
            Each level is a particular taal. Students can see the beat cycle, play it like a metronome, change speed, understand Tali and Khali, and compare the repeating cycle with maths concepts like circular motion and sine waves.
          </p>
          <div className="btn-row"><button className="btn btn-primary" onClick={() => setPage("levels")}>Start learning</button></div>
        </div>
        <div className="hero-card hero-side">
          <h3>What students can do</h3>
          <div className="mini-list">
            <div className="mini-item"><strong>Play the taal</strong> Start the 16-beat cycle and follow the highlighted beat.</div>
            <div className="mini-item"><strong>Change speed</strong> Practice in Vilambit, Madhya, and Drut laya.</div>
            <div className="mini-item"><strong>Understand maths</strong> See how a taal repeats like a periodic wave.</div>
          </div>
        </div>
      </section>
      <section className="stats">
        <div className="card"><div className="stat-number">16</div><h3>Teentaal Beats</h3><p className="muted">A full 16-matra repeating cycle.</p></div>
        <div className="card"><div className="stat-number">4</div><h3>Vibhags</h3><p className="muted">Four groups of four beats.</p></div>
        <div className="card"><div className="stat-number">3</div><h3>Lay Options</h3><p className="muted">Vilambit, Madhya, and Drut speed.</p></div>
      </section>
    </div>
  );
}

function LevelsPage({ query, setQuery, setSelectedLevel }) {
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return taals.filter((taal) => !q || taal.title.toLowerCase().includes(q) || taal.text.toLowerCase().includes(q));
  }, [query]);

  return (
    <div className="container">
      <div className="section-head">
        <div><h2>Taals & Practice</h2><p>Each level opens a particular taal page. Start with Teentaal.</p></div>
        <div style={{ width: "320px", maxWidth: "100%" }}><input className="input" placeholder="Search taal" value={query} onChange={(e) => setQuery(e.target.value)} /></div>
      </div>
      <div className="grid">
        {filtered.map((taal) => (
          <div className="level-card" key={taal.id}>
            <div className="meta-row"><span className="badge">{taal.category}</span><span className="muted">{taal.duration}</span></div>
            <h3>{taal.title}</h3>
            <p className="muted" style={{ lineHeight: 1.7 }}>{taal.text}</p>
            <div className="btn-row"><button className="btn btn-primary" onClick={() => setSelectedLevel(taal)}>Open Taal</button></div>
          </div>
        ))}
      </div>
    </div>
  );
}

function playBeatSound(isSam, soundType = "click") {
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  if (!AudioContext) return;

  const ctx = new AudioContext();

  if (soundType === "harmonium") {
    // A soft harmonium-like drone/chord using layered oscillators.
    const masterGain = ctx.createGain();
    masterGain.connect(ctx.destination);
    masterGain.gain.setValueAtTime(0.001, ctx.currentTime);
    masterGain.gain.exponentialRampToValueAtTime(isSam ? 0.16 : 0.1, ctx.currentTime + 0.03);
    masterGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.42);

    const baseFreq = isSam ? 261.63 : 196.0; // Sa-like low pitch, higher on Sam
    const chord = [baseFreq, baseFreq * 1.5, baseFreq * 2.0];

    chord.forEach((freq, index) => {
      const oscillator = ctx.createOscillator();
      const filter = ctx.createBiquadFilter();
      oscillator.type = index === 0 ? "sawtooth" : "triangle";
      oscillator.frequency.value = freq;
      filter.type = "lowpass";
      filter.frequency.value = 900;
      oscillator.connect(filter);
      filter.connect(masterGain);
      oscillator.start(ctx.currentTime);
      oscillator.stop(ctx.currentTime + 0.45);
    });

    return;
  }

  // Default metronome click sound.
  const oscillator = ctx.createOscillator();
  const gain = ctx.createGain();
  oscillator.connect(gain);
  gain.connect(ctx.destination);
  oscillator.frequency.value = isSam ? 880 : 520;
  gain.gain.setValueAtTime(0.14, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
  oscillator.start(ctx.currentTime);
  oscillator.stop(ctx.currentTime + 0.09);
}

function SineWave({ activeBeat }) {
  const points = Array.from({ length: 160 }, (_, i) => {
    const x = (i / 159) * 300;
    const y = 70 - Math.sin((i / 159) * Math.PI * 4) * 38;
    return `${x},${y}`;
  }).join(" ");
  const markerX = ((activeBeat - 1) / 15) * 300;
  const markerY = 70 - Math.sin(((activeBeat - 1) / 15) * Math.PI * 4) * 38;

  return (
    <svg viewBox="0 0 300 140">
      <line x1="0" y1="70" x2="300" y2="70" stroke="#e5e7eb" />
      <polyline points={points} fill="none" stroke="#7c3aed" strokeWidth="4" strokeLinecap="round" />
      <circle cx={markerX} cy={markerY} r="8" fill="#ef4444" />
      <text x="5" y="132" fontSize="12" fill="#6b7280">Time → repeating cycle</text>
    </svg>
  );
}

function TeentaalPage({ taal, onBack }) {
  const [speedKey, setSpeedKey] = useState("vilambit");
  const [activeBeat, setActiveBeat] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [soundOn, setSoundOn] = useState(true);
  const [soundType, setSoundType] = useState("click");
  const intervalRef = useRef(null);
  const speed = speedOptions[speedKey];

  useEffect(() => {
    if (!isPlaying) return;
    const beatMs = 60000 / speed.bpm;
    intervalRef.current = setInterval(() => {
      setActiveBeat((prev) => {
        const next = prev === taal.matras ? 1 : prev + 1;
        if (soundOn) playBeatSound(next === 1, soundType);
        return next;
      });
    }, beatMs);
    return () => clearInterval(intervalRef.current);
  }, [isPlaying, speed.bpm, soundOn, soundType, taal.matras]);

  const togglePlay = () => {
    if (!isPlaying && soundOn) playBeatSound(activeBeat === 1, soundType);
    setIsPlaying((prev) => !prev);
  };

  return (
    <div className="container">
      <div className="section-head">
        <div><h2>Teentaal</h2><p>16-beat taal cycle · translated from Marathi: Matra = 16, Vibhag = 4. Tali on beats 1, 5, 13 and Khali on beat 9.</p></div>
        <button className="btn btn-light" onClick={onBack}>Back to Taals</button>
      </div>

      <div className="taal-layout">
        <div className="taal-card">
          <span className="badge">About Teentaal</span>
          <p className="muted" style={{ lineHeight: 1.7 }}>{taal.text}</p>
          <div className="info-row"><strong>Total Beats</strong><span>{taal.matras}</span></div>
          <div className="info-row"><strong>Vibhags</strong><span>{taal.vibhags}</span></div>
          <div className="info-row"><strong>Beats per Vibhag</strong><span>{taal.beatsPerVibhag}</span></div>
          <div className="info-row"><strong>Tali / Clap</strong><span className="chip-row">{taal.tali.map((b) => <span className="chip orange" key={b}>{b}</span>)}</span></div>
          <div className="info-row"><strong>Khali / Wave</strong><span className="chip blue">9</span></div>
          <div style={{ marginTop: 16 }}><strong>Theka</strong><p className="muted" style={{ lineHeight: 1.7 }}>Dha Dhin Dhin Dha<br />Dha Dhin Dhin Dha<br />Dha Tin Tin Ta<br />Ta Dhin Dhin Dha</p></div>
        </div>

        <div className="taal-card cycle-stage">
          <div className="cycle-ring">
            {taal.bols.map((bol, index) => {
              const beat = index + 1;
              const angle = `${(360 / taal.matras) * index}deg`;
              const type = beat === 1 ? "sam" : taal.tali.includes(beat) ? "tali" : taal.khali.includes(beat) ? "khali" : "";
              return (
                <div key={beat}>
                  <button className={`beat-node ${type} ${activeBeat === beat ? "active" : ""}`} style={{ "--angle": angle }} onClick={() => setActiveBeat(beat)}>{beat}</button>
                  <div className="beat-label" style={{ "--angle": angle }}>{bol}<small>{beat === 1 ? "Sam" : taal.khali.includes(beat) ? "Khali" : taal.tali.includes(beat) ? "Tali" : ""}</small></div>
                </div>
              );
            })}
            <div className="center-info">
              <h2>Teentaal</h2>
              <p className="muted">Beat {activeBeat} / 16 · <strong>{taal.bols[activeBeat - 1]}</strong></p>
              <div className="sine-mini"><SineWave activeBeat={activeBeat} /></div>
              <p className="muted">Circular rhythm ↔ repeating sine wave</p>
            </div>
          </div>
        </div>

        <div className="taal-card">
          <span className="badge">Controls</span>
          <h3>Speed / Laya</h3>
          <div className="mini-list">
            {Object.entries(speedOptions).map(([key, item]) => (
              <button key={key} className={`btn btn-light ${speedKey === key ? "btn-active" : ""}`} onClick={() => setSpeedKey(key)}>{item.label} · {item.bpm} BPM</button>
            ))}
          </div>
          <div className="btn-row" style={{ marginTop: 20 }}>
            <button className={`btn ${isPlaying ? "btn-dark" : "btn-green"}`} onClick={togglePlay}>{isPlaying ? "Pause Cycle" : "Start Cycle"}</button>
            <button className="btn btn-light" onClick={() => setActiveBeat(1)}>Reset</button>
            <button className="btn btn-light" onClick={() => setSoundOn((v) => !v)}>Sound: {soundOn ? "On" : "Off"}</button>
          </div>
          <div style={{ marginTop: 20 }}>
            <h3>Sound Type</h3>
            <div className="mini-list">
              <button className={`btn btn-light ${soundType === "click" ? "btn-active" : ""}`} onClick={() => setSoundType("click")}>Metronome Click</button>
              <button className={`btn btn-light ${soundType === "harmonium" ? "btn-active" : ""}`} onClick={() => setSoundType("harmonium")}>Harmonium Tone</button>
            </div>
          </div>
          <div style={{ marginTop: 20 }}>
            <h3>Vibhag Structure</h3>
            <p className="muted">1–4 Tali · 5–8 Tali · 9–12 Khali · 13–16 Tali</p>
          </div>
        </div>
      </div>

      <div className="math-layout">
        <div className="taal-card sine-panel">
          <span className="badge">Maths connection</span>
          <h3>Why it is like a sine wave</h3>
          <p className="muted" style={{ lineHeight: 1.8 }}>A taal is periodic. After beat 16, it returns to beat 1 again. In mathematics, a sine wave also repeats after one full cycle. So Teentaal can be understood as a repeating rhythm cycle, just like a periodic function.</p>
          <SineWave activeBeat={activeBeat} />
        </div>
        <div className="taal-card">
          <span className="badge">Theka · Basic Bol</span>
          <div className="theka-grid">
            {taal.bols.map((bol, index) => {
              const beat = index + 1;
              return <div className={`theka-cell ${activeBeat === beat ? "active" : ""}`} key={beat}><span className="muted">{beat}</span><strong>{bol}</strong></div>;
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

function PlaceholderTaalPage({ taal, onBack }) {
  return (
    <div className="container">
      <div className="section-head"><div><h2>{taal.title}</h2><p>{taal.text}</p></div><button className="btn btn-light" onClick={onBack}>Back to Taals</button></div>
      <div className="card"><h3>Coming soon</h3><p className="muted">This taal will get the same interactive circular cycle, speed controls, theka, and maths comparison.</p></div>
    </div>
  );
}

function TaalPage({ taal, onBack }) {
  if (taal.id === 1) return <TeentaalPage taal={taal} onBack={onBack} />;
  return <PlaceholderTaalPage taal={taal} onBack={onBack} />;
}

export default function App() {
  const [ready, setReady] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [page, setPage] = useState("home");
  const [query, setQuery] = useState("");
  const [selectedLevel, setSelectedLevel] = useState(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      setUserEmail(user?.email || "");
      setReady(true);
    });
    return () => unsub();
  }, []);

  if (!ready) return <div style={{ minHeight: "100vh", display: "grid", placeItems: "center", fontFamily: "Inter, sans-serif" }}><AppStyles />Loading Tabla...</div>;
  if (!userEmail) return <LoginScreen />;

  return (
    <div className="app-shell">
      <AppStyles />
      <Header page={page} setPage={(next) => { setSelectedLevel(null); setPage(next); }} onLogout={async () => { await signOut(auth); setSelectedLevel(null); setPage("home"); }} />
      {selectedLevel ? <TaalPage taal={selectedLevel} onBack={() => setSelectedLevel(null)} /> : page === "levels" ? <LevelsPage query={query} setQuery={setQuery} setSelectedLevel={setSelectedLevel} /> : <HomePage setPage={setPage} />}
    </div>
  );
}
