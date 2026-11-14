import { useEffect, useState } from 'react';
import './App.css';

// Backend manzili
const API = 'http://localhost:3000/api';

// Kategoriyalar (key backenddagi category bilan bir xil bo'lishi kerak)
const CATEGORIES = [
  { key: 'all', label: '🎯 Hammasi' },
  { key: 'creative', label: '🎨 Ijodiy' },
  { key: 'study', label: '📚 O\'qish' },
  { key: 'health', label: '💪 Sog\'liq' },
  { key: 'fun', label: '🎉 Qiziqarli' },
];

// Forma boshlang'ich holati
const EMPTY_FORM = { emoji: '', text: '', points: 10, category: 'fun' };

function App() {
  const [task, setTask] = useState(null);       // hozirgi topshiriq
  const [stats, setStats] = useState(null);     // ball va daraja
  const [history, setHistory] = useState([]);   // bajarilganlar tarixi
  const [category, setCategory] = useState('all'); // tanlangan kategoriya
  const [message, setMessage] = useState('');   // "+20 ball" xabari
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false); // forma ochiqmi
  const [form, setForm] = useState(EMPTY_FORM);    // forma ma'lumotlari

  // Backenddan ball va tarixni olish
  async function loadData() {
    try {
      const [statsRes, historyRes] = await Promise.all([
        fetch(`${API}/stats`),
        fetch(`${API}/history`),
      ]);
      setStats(await statsRes.json());
      setHistory(await historyRes.json());
      setError('');
    } catch {
      setError('Backendga ulanib bo\'lmadi. Server ishlab turganini tekshiring.');
    }
  }

  // Sahifa ochilganda bir marta ma'lumotlarni yuklash
  useEffect(() => {
    loadData();
  }, []);

  // "Menga topshiriq ber" tugmasi
  async function getTask() {
    setLoading(true);
    setMessage('');
    try {
      const res = await fetch(`${API}/task/random?category=${category}`);
      if (!res.ok) {
        setError('Bu kategoriyada topshiriq topilmadi.');
        setLoading(false);
        return;
      }
      setTask(await res.json());
      setError('');
    } catch {
      setError('Topshiriqni olib bo\'lmadi. Backend ishlayaptimi?');
    }
    setLoading(false);
  }

  // "Bajardim" tugmasi
  async function doneTask() {
    try {
      const res = await fetch(`${API}/done`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ taskId: task.id }),
      });
      const entry = await res.json();
      setMessage(`Barakalla! +${entry.points} ball 🎉`);
      setTask(null);
      await loadData();
      setTimeout(() => setMessage(''), 3000);
    } catch {
      setError('Saqlab bo\'lmadi. Backend ishlayaptimi?');
    }
  }

  // Yangi topshiriq qo'shish
  async function addTask(e) {
    e.preventDefault(); // sahifa qayta yuklanib ketmasligi uchun
    try {
      const res = await fetch(`${API}/tasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, points: Number(form.points) }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Topshiriq qo\'shib bo\'lmadi.');
        return;
      }
      setError('');
      setForm(EMPTY_FORM);
      setShowForm(false);
      setMessage('Yangi topshiriq qo\'shildi! ✅');
      setTimeout(() => setMessage(''), 3000);
    } catch {
      setError('Topshiriq qo\'shib bo\'lmadi. Backend ishlayaptimi?');
    }
  }

  // Tarixni tozalash
  async function clearHistory() {
    if (!window.confirm('Butun tarix o\'chirilsinmi?')) return;
    try {
      await fetch(`${API}/history`, { method: 'DELETE' });
      await loadData();
    } catch {
      setError('Tarixni tozalab bo\'lmadi. Backend ishlayaptimi?');
    }
  }

  // Daraja uchun progress (har 50 ball = yangi daraja)
  const progress = stats ? ((stats.totalPoints % 50) / 50) * 100 : 0;

  return (
    <div className="app">
      <h1 className="title">🎲 Bugun nima qilay?</h1>
      <p className="subtitle">Zerikdingmi? Tugmani bos, topshiriq ol!</p>

      {stats && (
        <>
          <div className="stats">
            <div className="stat">
              <b>{stats.todayPoints}</b>
              <span>Bugungi ball</span>
            </div>
            <div className="stat">
              <b>{stats.totalPoints}</b>
              <span>Jami ball</span>
            </div>
            <div className="stat">
              <b>{stats.level}</b>
              <span>Daraja</span>
            </div>
          </div>
          <div className="progress">
            <div className="progress-bar" style={{ width: `${progress}%` }} />
          </div>
        </>
      )}

      {error && <div className="error">{error}</div>}
      {message && <div className="message">{message}</div>}

      <div className="chips">
        {CATEGORIES.map((c) => (
          <button
            key={c.key}
            className={`chip ${category === c.key ? 'active' : ''}`}
            onClick={() => setCategory(c.key)}
          >
            {c.label}
          </button>
        ))}
      </div>

      <button className="btn btn-main" onClick={getTask} disabled={loading}>
        {loading ? 'Yuklanmoqda...' : '✨ Menga topshiriq ber'}
      </button>

      <div style={{ height: 16 }} />

      {task ? (
        // key o'zgarganda animatsiya qayta ishlaydi
        <div className="card pop" key={task.id + '-' + Math.random()}>
          <div className="emoji">{task.emoji}</div>
          <div className="task-text">{task.text}</div>
          <div className="task-points">+{task.points} ball</div>
          <button className="btn btn-done" onClick={doneTask}>
            ✅ Bajardim
          </button>
        </div>
      ) : (
        <div className="card">
          <p className="empty">Hozircha topshiriq yo'q. Yuqoridagi tugmani bosing 👆</p>
        </div>
      )}

      <div className="add-box">
        <button
          className="btn-toggle"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? '✖ Yopish' : '➕ Yangi topshiriq qo\'shish'}
        </button>

        {showForm && (
          <form className="add-form" onSubmit={addTask}>
            <div className="row">
              <input
                className="input input-emoji"
                placeholder="😀"
                maxLength={4}
                value={form.emoji}
                onChange={(e) => setForm({ ...form, emoji: e.target.value })}
              />
              <input
                className="input"
                placeholder="Topshiriq matni..."
                maxLength={100}
                value={form.text}
                onChange={(e) => setForm({ ...form, text: e.target.value })}
                required
              />
            </div>
            <div className="row">
              <select
                className="input"
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
              >
                {CATEGORIES.filter((c) => c.key !== 'all').map((c) => (
                  <option key={c.key} value={c.key}>
                    {c.label}
                  </option>
                ))}
              </select>
              <select
                className="input"
                value={form.points}
                onChange={(e) => setForm({ ...form, points: e.target.value })}
              >
                <option value={5}>5 ball</option>
                <option value={10}>10 ball</option>
                <option value={15}>15 ball</option>
                <option value={20}>20 ball</option>
              </select>
            </div>
            <button className="btn btn-done" type="submit">
              💾 Saqlash
            </button>
          </form>
        )}
      </div>

      <div className="history">
        <div className="history-head">
          <h2>📜 Bajarilganlar tarixi</h2>
          {history.length > 0 && (
            <button className="btn-clear" onClick={clearHistory}>
              🗑 Tozalash
            </button>
          )}
        </div>
        {history.length === 0 ? (
          <p className="empty">Hali hech narsa bajarilmagan.</p>
        ) : (
          <ul>
            {history.slice(0, 10).map((h) => (
              <li key={h.id}>
                <span className="h-emoji">{h.emoji}</span>
                <span className="h-text">{h.text}</span>
                <span className="h-points">+{h.points}</span>
                <span className="h-time">
                  {new Date(h.doneAt).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default App;