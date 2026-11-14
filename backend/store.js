import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const HISTORY_FILE = path.join(__dirname, 'data.json');
const CUSTOM_FILE = path.join(__dirname, 'custom-tasks.json');

// Fayldan ro'yxat o'qish (fayl yo'q yoki buzuq bo'lsa, bo'sh ro'yxat)
function readList(file) {
  if (!fs.existsSync(file)) return [];
  try {
    return JSON.parse(fs.readFileSync(file, 'utf-8'));
  } catch {
    return [];
  }
}

function writeList(file, list) {
  fs.writeFileSync(file, JSON.stringify(list, null, 2));
}

// Bajarilganlar tarixi
export const readHistory = () => readList(HISTORY_FILE);
export const writeHistory = (list) => writeList(HISTORY_FILE, list);

// Foydalanuvchi o'zi qo'shgan topshiriqlar
export const readCustomTasks = () => readList(CUSTOM_FILE);
export const writeCustomTasks = (list) => writeList(CUSTOM_FILE, list);