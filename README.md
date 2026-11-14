# 🎲 Bugun nima qilay?

Zerikkan odamga tasodifiy qiziqarli topshiriq beradigan sayt. Topshiriqni bajarsangiz, ball olasiz, daraja oshadi va tarixda saqlanadi.

## Imkoniyatlar

- Tugma bosilganda tasodifiy topshiriq berish
- Kategoriyalar: Ijodiy, O'qish, Sog'liq, Qiziqarli
- Bajarilgan topshiriqlar tarixi
- Kunlik va jami ball, daraja (har 50 ball = yangi daraja)
- O'zingiz yangi topshiriq qo'shish
- Tarixni tozalash

## Texnologiyalar

- **Frontend:** React + Vite
- **Backend:** Node.js + Express
- **Ma'lumotlar:** JSON fayllar (data.json, custom-tasks.json)

## Ishga tushirish

Kompyuterda Node.js o'rnatilgan bo'lishi kerak (https://nodejs.org).

### 1. Backend

Terminalda quyidagilarni yozing:

    cd backend
    npm install
    node server.js

Server http://localhost:3000 da ishga tushadi.

### 2. Frontend (yangi terminalda)

Yangi terminal ochib, quyidagilarni yozing:

    cd frontend
    npm install
    npm run dev

Sayt http://localhost:5173 da ochiladi.

## API manzillari

| Metod | Manzil | Vazifasi |
|-------|--------|----------|
| GET | /api/health | Server ishlayaptimi tekshirish |
| GET | /api/task/random?category=health | Tasodifiy topshiriq |
| POST | /api/tasks | Yangi topshiriq qo'shish |
| POST | /api/done | Topshiriqni bajarilgan deb saqlash |
| GET | /api/history | Bajarilganlar tarixi |
| GET | /api/stats | Ball va daraja |
| DELETE | /api/history | Tarixni tozalash |

## Loyiha tuzilishi

    bugun-nima-qilay/
    ├── backend/
    │   ├── server.js      (API manzillari)
    │   ├── tasks.js       (tayyor topshiriqlar)
    │   └── store.js       (fayllarga o'qish va yozish)
    └── frontend/
        └── src/
            ├── App.jsx    (asosiy sahifa)
            └── App.css    (dizayn)