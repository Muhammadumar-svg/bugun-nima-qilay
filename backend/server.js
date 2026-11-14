import express from 'express';
import cors from 'cors';
import { tasks } from './tasks.js';
import {
  readHistory,
  writeHistory,
  readCustomTasks,
  writeCustomTasks,
} from './store.js';

const app = express();
const PORT = 3000;

const CATEGORIES = ['creative', 'study', 'health', 'fun'];

app.use(cors());
app.use(express.json());

// Tayyor topshiriqlar + foydalanuvchi qo'shganlari
function getAllTasks() {
  return [...tasks, ...readCustomTasks()];
}

// Server ishlayaptimi tekshirish uchun
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Backend ishlayapti' });
});

// Tasodifiy topshiriq berish (ixtiyoriy: ?category=health)
app.get('/api/task/random', (req, res) => {
  const { category } = req.query;
  const all = getAllTasks();

  const list =
    category && category !== 'all'
      ? all.filter((t) => t.category === category)
      : all;

  if (list.length === 0) {
    return res.status(404).json({ error: 'Bu kategoriyada topshiriq yo\'q' });
  }

  const index = Math.floor(Math.random() * list.length);
  res.json(list[index]);
});

// Yangi topshiriq qo'shish
app.post('/api/tasks', (req, res) => {
  const { text, emoji, points, category } = req.body;

  const cleanText = typeof text === 'string' ? text.trim() : '';
  if (cleanText.length < 3 || cleanText.length > 100) {
    return res
      .status(400)
      .json({ error: 'Topshiriq matni 3 dan 100 gacha belgi bo\'lishi kerak' });
  }

  if (!CATEGORIES.includes(category)) {
    return res.status(400).json({ error: 'Kategoriya noto\'g\'ri' });
  }

  // Ball 1 va 50 orasida bo'lsin
  const cleanPoints = Math.min(50, Math.max(1, Number(points) || 10));

  const newTask = {
    id: Date.now(), // tayyor topshiriqlardan (1-16) farq qilishi uchun katta son
    emoji: (typeof emoji === 'string' && emoji.trim()) || '⭐',
    text: cleanText,
    points: cleanPoints,
    category,
  };

  const custom = readCustomTasks();
  custom.push(newTask);
  writeCustomTasks(custom);

  res.status(201).json(newTask);
});

// Topshiriqni bajarilgan deb saqlash
app.post('/api/done', (req, res) => {
  const { taskId } = req.body;
  const task = getAllTasks().find((t) => t.id === taskId);

  if (!task) {
    return res.status(404).json({ error: 'Bunday topshiriq topilmadi' });
  }

  const history = readHistory();
  const entry = {
    id: Date.now(),
    taskId: task.id,
    emoji: task.emoji,
    text: task.text,
    points: task.points,
    doneAt: new Date().toISOString(),
  };
  history.push(entry);
  writeHistory(history);

  res.status(201).json(entry);
});

// Bajarilganlar tarixi (yangisi birinchi)
app.get('/api/history', (req, res) => {
  const history = readHistory().reverse();
  res.json(history);
});

// Ball va daraja
app.get('/api/stats', (req, res) => {
  const history = readHistory();
  const today = new Date().toDateString();

  const todayItems = history.filter(
    (h) => new Date(h.doneAt).toDateString() === today
  );

  const totalPoints = history.reduce((sum, h) => sum + h.points, 0);
  const todayPoints = todayItems.reduce((sum, h) => sum + h.points, 0);

  res.json({
    todayPoints,
    totalPoints,
    doneToday: todayItems.length,
    doneTotal: history.length,
    level: Math.floor(totalPoints / 50) + 1, // har 50 ball = yangi daraja
  });
});

// Tarixni to'liq tozalash
app.delete('/api/history', (req, res) => {
  writeHistory([]);
  res.json({ ok: true });
});

app.listen(PORT, () => {
  console.log(`Server http://localhost:${PORT} da ishga tushdi`);
});