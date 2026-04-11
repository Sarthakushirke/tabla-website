import { useEffect, useMemo, useState } from "react";
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

console.log("firebaseConfig", firebaseConfig);

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const levels = [
  {
    id: 1,
    title: "Level 1 · Foundations",
    category: "Theory",
    duration: "12 min",
    video: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    text: "Learn correct posture, hand placement, and the first Tabla bols. This level builds comfort with the instrument and introduces rhythm awareness.",
  },
  {
    id: 2,
    title: "Level 2 · Basic Bols",
    category: "Practice",
    duration: "15 min",
    video: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    text: "Practice simple bols and understand how each sound is produced. The focus here is consistency and clean technique.",
  },
  {
    id: 3,
    title: "Level 3 · Simple Patterns",
    category: "Theory",
    duration: "18 min",
    video: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    text: "Explore basic rhythmic patterns and how they fit inside taal. Students begin connecting theory with practical playing.",
  },
  {
    id: 4,
    title: "Level 4 · Speed & Control",
    category: "Practice",
    duration: "20 min",
    video: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    text: "Develop control, clarity, and confidence while gradually increasing speed. The goal is precision without tension.",
  },
  {
    id: 5,
    title: "Level 5 · Intermediate Compositions",
    category: "Theory",
    duration: "22 min",
    video: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    text: "Study intermediate compositions and their structure. This level introduces phrasing, form, and stronger musical understanding.",
  },
  {
    id: 6,
    title: "Level 6 · Performance Practice",
    category: "Practice",
    duration: "25 min",
    video: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    text: "Apply your learning in longer practice sessions that simulate performance. Students refine stamina and smooth transitions.",
  },
  {
    id: 7,
    title: "Level 7 · Advanced Expression",
    category: "Theory + Practice",
    duration: "30 min",
    video: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    text: "Bring together technique, rhythm, and musical expression. This final level is designed as a capstone to the learning journey.",
  },
];

function AppStyles() {
  return (
    <style>{`
      * { box-sizing: border-box; }
      body {
        margin: 0;
        font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        background: linear-gradient(180deg, #fffaf5 0%, #fff 45%, #f7f7f8 100%);
        color: #1f2937;
      }
      a { color: inherit; text-decoration: none; }
      .app-shell {
        min-height: 100vh;
      }
      .topbar {
        position: sticky;
        top: 0;
        z-index: 10;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 18px 28px;
        backdrop-filter: blur(10px);
        background: rgba(255,255,255,0.78);
        border-bottom: 1px solid rgba(0,0,0,0.06);
      }
      .brand {
        display: flex;
        align-items: center;
        gap: 12px;
        font-weight: 800;
        font-size: 22px;
      }
      .brand-mark {
        width: 42px;
        height: 42px;
        border-radius: 14px;
        display: grid;
        place-items: center;
        color: #fff;
        background: linear-gradient(135deg, #111827, #f97316);
        box-shadow: 0 10px 30px rgba(249,115,22,0.25);
      }
      .nav {
        display: flex;
        gap: 10px;
        flex-wrap: wrap;
      }
      .container {
        max-width: 1180px;
        margin: 0 auto;
        padding: 32px 20px 56px;
      }
      .hero {
        display: grid;
        grid-template-columns: 1.3fr 0.9fr;
        gap: 24px;
        margin-top: 18px;
      }
      .hero-card, .card {
        background: rgba(255,255,255,0.88);
        border: 1px solid rgba(0,0,0,0.06);
        border-radius: 28px;
        box-shadow: 0 20px 60px rgba(17,24,39,0.08);
      }
      .hero-main {
        padding: 34px;
        background: linear-gradient(135deg, #111827 0%, #1f2937 48%, #ea580c 100%);
        color: #fff;
      }
      .hero-main h1 {
        margin: 10px 0 14px;
        font-size: 52px;
        line-height: 1.05;
      }
      .hero-main p {
        font-size: 17px;
        line-height: 1.8;
        color: rgba(255,255,255,0.88);
        max-width: 700px;
      }
      .pill {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        background: rgba(255,255,255,0.14);
        color: #fff;
        border: 1px solid rgba(255,255,255,0.2);
        padding: 8px 14px;
        border-radius: 999px;
        font-size: 14px;
      }
      .hero-side {
        padding: 26px;
      }
      .hero-side h3, .card h3 {
        margin-top: 0;
        margin-bottom: 10px;
        font-size: 24px;
      }
      .mini-list {
        display: grid;
        gap: 14px;
        margin-top: 18px;
      }
      .mini-item {
        padding: 16px;
        border-radius: 18px;
        background: #fafaf9;
        border: 1px solid rgba(0,0,0,0.05);
      }
      .mini-item strong {
        display: block;
        margin-bottom: 6px;
      }
      .btn {
        border: 0;
        border-radius: 14px;
        padding: 12px 18px;
        font-size: 15px;
        font-weight: 700;
        cursor: pointer;
        transition: transform 0.15s ease, opacity 0.15s ease, box-shadow 0.15s ease;
      }
      .btn:hover { transform: translateY(-1px); }
      .btn-primary {
        background: linear-gradient(135deg, #f97316, #ea580c);
        color: #fff;
        box-shadow: 0 12px 24px rgba(249,115,22,0.28);
      }
      .btn-dark {
        background: #111827;
        color: #fff;
      }
      .btn-light {
        background: #fff;
        color: #111827;
        border: 1px solid rgba(0,0,0,0.08);
      }
      .btn-row {
        display: flex;
        gap: 12px;
        flex-wrap: wrap;
        margin-top: 22px;
      }
      .stats {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 18px;
        margin-top: 24px;
      }
      .card { padding: 24px; }
      .stat-number {
        font-size: 34px;
        font-weight: 800;
        color: #111827;
      }
      .section-head {
        display: flex;
        align-items: end;
        justify-content: space-between;
        gap: 16px;
        margin: 18px 0 18px;
      }
      .section-head h2 {
        margin: 0 0 8px;
        font-size: 34px;
      }
      .section-head p {
        margin: 0;
        color: #6b7280;
      }
      .input {
        width: 100%;
        padding: 13px 16px;
        border-radius: 14px;
        border: 1px solid rgba(0,0,0,0.08);
        outline: none;
        font-size: 15px;
        background: #fff;
      }
      .input:focus {
        border-color: #f97316;
        box-shadow: 0 0 0 4px rgba(249,115,22,0.12);
      }
      .grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 18px;
      }
      .level-card {
        padding: 22px;
        border-radius: 24px;
        background: rgba(255,255,255,0.9);
        border: 1px solid rgba(0,0,0,0.06);
        box-shadow: 0 16px 40px rgba(17,24,39,0.06);
      }
      .badge {
        display: inline-block;
        padding: 7px 12px;
        border-radius: 999px;
        background: #fff7ed;
        color: #c2410c;
        border: 1px solid #fed7aa;
        font-size: 12px;
        font-weight: 700;
      }
      .muted { color: #6b7280; }
      .level-card h3 {
        margin: 14px 0 10px;
        font-size: 22px;
      }
      .meta-row {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 12px;
      }
      .lesson-layout {
        display: grid;
        grid-template-columns: 1.45fr 0.85fr;
        gap: 22px;
      }
      .video-wrap {
        position: relative;
        width: 100%;
        padding-top: 56.25%;
        border-radius: 26px;
        overflow: hidden;
        background: #111827;
        box-shadow: 0 20px 60px rgba(17,24,39,0.12);
      }
      .video-wrap iframe {
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
        border: 0;
      }
      .login-wrap {
        min-height: 100vh;
        display: grid;
        place-items: center;
        padding: 24px;
      }
      .login-card {
        width: 100%;
        max-width: 460px;
        padding: 30px;
        border-radius: 30px;
        background: rgba(255,255,255,0.92);
        border: 1px solid rgba(0,0,0,0.06);
        box-shadow: 0 30px 80px rgba(17,24,39,0.12);
      }
      .login-card h1 {
        margin: 16px 0 8px;
        font-size: 40px;
      }
      .field {
        margin-top: 14px;
      }
      .label {
        display: block;
        margin-bottom: 8px;
        font-weight: 700;
        font-size: 14px;
      }
      .error {
        margin-top: 14px;
        padding: 12px 14px;
        border-radius: 14px;
        background: #fef2f2;
        color: #b91c1c;
        border: 1px solid #fecaca;
      }
      .helper {
        margin-top: 12px;
        color: #6b7280;
        font-size: 14px;
      }
      .footer-note {
        margin-top: 14px;
        font-size: 13px;
        color: #6b7280;
        line-height: 1.6;
      }
      @media (max-width: 960px) {
        .hero, .lesson-layout, .grid, .stats {
          grid-template-columns: 1fr;
        }
        .hero-main h1 {
          font-size: 40px;
        }
        .topbar {
          padding: 16px 18px;
        }
        .container {
          padding: 24px 16px 48px;
        }
      }
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
      if (isRegister) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
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
        <div className="brand">
          <div className="brand-mark">T</div>
          <span>Tabla</span>
        </div>
        <h1>{isRegister ? "Create account" : "Welcome back"}</h1>
        <p className="muted">
          {isRegister
            ? "Create your account to access Tabla theory and practice."
            : "Login to continue your Tabla learning journey."}
        </p>

        <div className="field">
          <label className="label">Email</label>
          <input
            className="input"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="field">
          <label className="label">Password</label>
          <input
            className="input"
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {error ? <div className="error">{error}</div> : null}

        <div className="btn-row">
          <button className="btn btn-primary" onClick={submit} disabled={loading}>
            {loading ? "Please wait..." : isRegister ? "Create account" : "Login"}
          </button>
          <button className="btn btn-light" onClick={() => setIsRegister(!isRegister)}>
            {isRegister ? "Have an account? Sign in" : "Need an account? Register"}
          </button>
        </div>

        <p className="footer-note">
          This app uses Firebase email/password login. Add your Vite environment variables in a <strong>.env</strong> file before running it.
        </p>
      </div>
    </div>
  );
}

function Header({ page, setPage, userEmail, onLogout }) {
  return (
    <div className="topbar">
      <div className="brand">
        <div className="brand-mark">T</div>
        <span>Tabla</span>
      </div>
      <div className="nav">
        <button className={`btn ${page === "home" ? "btn-primary" : "btn-light"}`} onClick={() => setPage("home")}>Home</button>
        <button className={`btn ${page === "levels" ? "btn-primary" : "btn-light"}`} onClick={() => setPage("levels")}>Theory & Practice</button>
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
          <span className="pill">Structured music learning</span>
          <h1>Learn Tabla through clear theory, guided practice, and seven progressive levels.</h1>
          <p>
            This website is designed for Tabla students who want a simple, beautiful learning experience. Start from the foundations, move through practice and theory, and open a dedicated lesson page for each level with a video and short notes.
          </p>
          <div className="btn-row">
            <button className="btn btn-primary" onClick={() => setPage("levels")}>Start learning</button>
            <button className="btn btn-light" onClick={() => setPage("levels")}>Browse all levels</button>
          </div>
        </div>

        <div className="hero-card hero-side">
          <h3>What you get</h3>
          <p className="muted">A simple path to build confidence, technique, and musical understanding.</p>
          <div className="mini-list">
            <div className="mini-item">
              <strong>Introduction page</strong>
              Clear homepage that explains the Tabla learning journey.
            </div>
            <div className="mini-item">
              <strong>Theory & practice hub</strong>
              One page to view all seven levels in a clean layout.
            </div>
            <div className="mini-item">
              <strong>Video lessons</strong>
              Each level has its own video and a short supporting write-up.
            </div>
          </div>
        </div>
      </section>

      <section className="stats">
        <div className="card">
          <div className="stat-number">7</div>
          <h3>Progressive levels</h3>
          <p className="muted">From foundations to advanced expression.</p>
        </div>
        <div className="card">
          <div className="stat-number">1</div>
          <h3>Focused platform</h3>
          <p className="muted">One place for all your Tabla lessons.</p>
        </div>
        <div className="card">
          <div className="stat-number">100%</div>
          <h3>Login protected</h3>
          <p className="muted">Only signed-in users can access the lessons.</p>
        </div>
      </section>
    </div>
  );
}

function LevelsPage({ query, setQuery, setSelectedLevel }) {
  const filtered = useMemo(() => {
    return levels.filter((level) => {
      const q = query.trim().toLowerCase();
      if (!q) return true;
      return (
        level.title.toLowerCase().includes(q) ||
        level.category.toLowerCase().includes(q) ||
        level.text.toLowerCase().includes(q)
      );
    });
  }, [query]);

  return (
    <div className="container">
      <div className="section-head">
        <div>
          <h2>Theory & Practice</h2>
          <p>Choose a level to open its lesson page with video and notes.</p>
        </div>
        <div style={{ width: "320px", maxWidth: "100%" }}>
          <input
            className="input"
            placeholder="Search levels"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="grid">
        {filtered.map((level) => (
          <div className="level-card" key={level.id}>
            <div className="meta-row">
              <span className="badge">{level.category}</span>
              <span className="muted">{level.duration}</span>
            </div>
            <h3>{level.title}</h3>
            <p className="muted" style={{ lineHeight: 1.7 }}>{level.text}</p>
            <div className="btn-row">
              <button className="btn btn-primary" onClick={() => setSelectedLevel(level)}>Open level</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function LevelPage({ level, onBack }) {
  return (
    <div className="container">
      <div className="section-head">
        <div>
          <h2>{level.title}</h2>
          <p>{level.category} · {level.duration}</p>
        </div>
        <button className="btn btn-light" onClick={onBack}>Back to levels</button>
      </div>

      <div className="lesson-layout">
        <div className="video-wrap">
          <iframe
            src={level.video}
            title={level.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>

        <div className="card">
          <span className="badge">Lesson notes</span>
          <h3 style={{ marginTop: 16 }}>{level.title}</h3>
          <p className="muted" style={{ lineHeight: 1.8 }}>{level.text}</p>
          <div className="mini-list" style={{ marginTop: 20 }}>
            <div className="mini-item">
              <strong>How to practice</strong>
              Watch the full video once, then repeat slowly before increasing speed.
            </div>
            <div className="mini-item">
              <strong>What to focus on</strong>
              Sound clarity, timing, and relaxed hand movement.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
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

  if (!ready) {
    return (
      <div style={{ minHeight: "100vh", display: "grid", placeItems: "center", fontFamily: "Inter, sans-serif" }}>
        <AppStyles />
        <div>Loading Tabla...</div>
      </div>
    );
  }

  if (!userEmail) {
    return <LoginScreen />;
  }

  return (
    <div className="app-shell">
      <AppStyles />
      <Header
        page={page}
        setPage={(next) => {
          setSelectedLevel(null);
          setPage(next);
        }}
        userEmail={userEmail}
        onLogout={async () => {
          await signOut(auth);
          setSelectedLevel(null);
          setPage("home");
        }}
      />

      {selectedLevel ? (
        <LevelPage level={selectedLevel} onBack={() => setSelectedLevel(null)} />
      ) : page === "levels" ? (
        <LevelsPage query={query} setQuery={setQuery} setSelectedLevel={setSelectedLevel} />
      ) : (
        <HomePage setPage={setPage} />
      )}
    </div>
  );
}
