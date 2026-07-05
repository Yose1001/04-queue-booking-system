# 📅 Queue Booking System — ระบบจองคิว

เว็บแอปพลิเคชันระบบจองคิวแบบ Full-stack สำหรับจองคิวใช้บริการล่วงหน้า
พร้อมระบบสมาชิก การเช็คคิวซ้อน และการแยกสิทธิ์ผู้ใช้/ผู้ดูแลระบบ

## 📑 สารบัญ

1. [เทคโนโลยีที่ใช้ (Tech Stack)](#1-เทคโนโลยีที่ใช้-tech-stack)
2. [ภาษาที่ใช้ในโปรเจค](#2-ภาษาที่ใช้ในโปรเจค)
3. [โครงสร้างโปรเจค](#3-โครงสร้างโปรเจค)
4. [API Endpoints](#4-api-endpoints)
5. [วิธีรันโปรเจค](#5-วิธีรันโปรเจค)
6. [ขั้นตอนการใช้งานระบบ](#6-ขั้นตอนการใช้งานระบบ)
7. [จุดเด่นของโปรเจค](#7-จุดเด่นของโปรเจค)

---

## 1. เทคโนโลยีที่ใช้ (Tech Stack)

| ส่วน | เทคโนโลยี |
|------|-----------|
| Frontend | React 18 + Vite (JavaScript, JSX, CSS) |
| Backend | Node.js + Express (REST API) |
| Database | MongoDB (ผ่าน Mongoose) |
| Authentication | JWT (JSON Web Token) + bcrypt |
| Deployment | Docker + Docker Compose |

---

## 2. ภาษาที่ใช้ในโปรเจค

### 2.1 ภาษาโปรแกรม

โปรเจคนี้ใช้ภาษาโปรแกรมเพียงภาษาเดียวคือ **JavaScript** (full-stack JavaScript)

**JavaScript ฝั่ง Frontend (React)**
- เขียน component ของทุกหน้า (Login, สมัครสมาชิก, จองคิว, แอดมิน)
- จัดการ state ของฟอร์มจองคิว
- เรียก API ด้วย `fetch`
- ใช้ `map` แสดงตารางคิว และ spread syntax อัปเดตฟอร์ม
- คำนวณเวลาเสร็จโดยประมาณให้ผู้ใช้เห็นก่อนกดจอง

**JavaScript ฝั่ง Backend (Node.js)**
- เขียน REST API ทั้งหมด
- ตรวจสอบ JWT token และ hash รหัสผ่านด้วย bcrypt
- Business logic: เช็คคิวซ้อน และกติกาเวลาเริ่มทุก 10 นาที
- ติดต่อ MongoDB ผ่าน Mongoose

> **ทำไมใช้ภาษาเดียว?** โค้ดสองฝั่งใช้แนวคิดร่วมกันได้ เช่น ค่าคงที่ระยะเวลาบริการ
> (`SERVICE_DURATIONS`) มีโครงสร้างเดียวกันทั้ง frontend และ backend
> และไม่ต้องสลับภาษาไปมาระหว่างพัฒนา

### 2.2 ภาษาประกอบอื่น ๆ (ไม่ใช่ภาษาโปรแกรม)

| ภาษา | ประเภท | ใช้ทำอะไรในโปรเจคนี้ |
|------|--------|----------------------|
| **JSX** | ส่วนขยายของ JavaScript | เขียน UI ในไฟล์ `.jsx` — หน้าตาเหมือน HTML แต่ฝังใน JavaScript เช่น `<button onClick={...}>จองคิว</button>` |
| **HTML** | ภาษา markup | โครงหน้าเว็บหลักใน `index.html` (React render ทุกอย่างลงใน `<div id="root">`) |
| **CSS** | ภาษา stylesheet | ตกแต่งหน้าเว็บทั้งหมดใน `src/index.css` — gradient, การ์ด, ปุ่ม, ตาราง, responsive |
| **YAML** | ภาษา config | `docker-compose.yml` กำหนด 3 containers (web/api/db) และการเชื่อมต่อ |
| **JSON** | รูปแบบข้อมูล | `package.json` ระบุ dependencies และเป็นรูปแบบที่ frontend–backend คุยกันผ่าน API |
| **Dockerfile / nginx config** | config เฉพาะเครื่องมือ | สูตร build image และตั้งค่า nginx เสิร์ฟ React + ส่งต่อ `/api` ไป backend |

---

## 3. โครงสร้างโปรเจค

```
04-queue-booking/
├── frontend/          ← เว็บฝั่งผู้ใช้ (React)
├── backend/           ← REST API ฝั่งเซิร์ฟเวอร์ (Express)
├── docker-compose.yml ← รวมทุกส่วนรันด้วยคำสั่งเดียว
├── .gitignore
└── README.md          ← ไฟล์นี้
```

### 3.1 โฟลเดอร์ `frontend/` — ส่วนแสดงผล (Client)

หน้าเว็บที่ผู้ใช้เห็นและโต้ตอบ ดึงข้อมูลจาก backend ผ่าน HTTP API

| โฟลเดอร์/ไฟล์ | หน้าที่ |
|---------------|---------|
| `src/main.jsx` | จุดเริ่มต้นของแอป React |
| `src/App.jsx` | Component หลัก: navbar + กำหนดเส้นทาง (routing) ของแต่ละหน้า |
| `src/api.js` | ตัวกลางเรียก API ทั้งหมด แนบ JWT token อัตโนมัติ |
| `src/pages/` | หน้าจอแต่ละหน้า: Login, Register, Bookings, Admin |
| `src/index.css` | สไตล์ทั้งหมดของเว็บ |
| `public/` | ไฟล์ static เช่น รูปภาพ ไอคอน |
| `index.html` | หน้า HTML หลักที่ React render ลงไป |
| `Dockerfile` | สูตร build: แปลง React เป็นไฟล์ static แล้วเสิร์ฟด้วย nginx |
| `nginx.conf` | ตั้งค่า nginx: เสิร์ฟ SPA + ส่งต่อ `/api` ไป backend |

### 3.2 โฟลเดอร์ `backend/` — ส่วนประมวลผล (Server / REST API)

เซิร์ฟเวอร์ Express รับคำขอจาก frontend ตรวจสอบสิทธิ์ ประมวลผล business logic
และอ่าน/เขียนข้อมูลกับ MongoDB

| โฟลเดอร์/ไฟล์ | หน้าที่ |
|---------------|---------|
| `src/server.js` | จุดเริ่มต้นเซิร์ฟเวอร์ ประกอบ middleware และ routes |
| `src/config/db.js` | เชื่อมต่อ MongoDB |
| `src/models/` | โครงสร้างข้อมูล: `User.js` ผู้ใช้, `Booking.js` การจอง |
| `src/routes/` | กำหนดเส้นทาง API เช่น `POST /api/auth/login` |
| `src/controllers/` | Logic จริงของแต่ละ API เช่น เช็คคิวซ้อนก่อนจอง |
| `src/middleware/` | ตรวจสอบก่อนถึง controller: เช็ค JWT token, เช็คสิทธิ์ admin |
| `.env.example` | ตัวอย่างตัวแปรลับ (คัดลอกเป็น `.env` แล้วใส่ค่าจริง) |
| `Dockerfile` | สูตร build image ของ backend |

---

## 4. API Endpoints

| Method | Endpoint | สิทธิ์ | หน้าที่ |
|--------|----------|--------|---------|
| POST | `/api/auth/register` | ทุกคน | สมัครสมาชิก |
| POST | `/api/auth/login` | ทุกคน | เข้าสู่ระบบ (รับ JWT token) |
| POST | `/api/bookings` | สมาชิก | จองคิวใหม่ — ส่งแค่บริการ + เวลาเริ่ม (ลงตัวทุก 10 นาที) ระบบคำนวณเวลาสิ้นสุดและเช็คคิวซ้อนอัตโนมัติ |
| GET | `/api/bookings/me` | สมาชิก | ดูการจองของตัวเอง |
| GET | `/api/bookings` | admin | ดูการจองทั้งหมด |
| PATCH | `/api/bookings/:id/cancel` | เจ้าของคิว/admin | ยกเลิกการจอง |

---

## 5. วิธีรันโปรเจค

### 5.1 แบบ Docker (แนะนำ — คำสั่งเดียวจบ)

> ต้องติดตั้ง [Docker Desktop](https://www.docker.com/products/docker-desktop/) ก่อน

**ขั้นตอนที่ 1** — เปิด Terminal แล้วเข้าโฟลเดอร์โปรเจค

```bash
cd 04-queue-booking
```

**ขั้นตอนที่ 2** — สั่ง build และรันทั้งระบบ

```bash
docker compose up -d --build
```

**ขั้นตอนที่ 3** — เปิดใช้งาน

| ส่วน | URL |
|------|-----|
| หน้าเว็บ | http://localhost:3000 |
| API | http://localhost:5001 |

**บัญชีสำหรับ Login ทดสอบ**

| บทบาท | อีเมล | รหัสผ่าน | ที่มา | ใช้ทำอะไรได้ |
|--------|-------|----------|-------|--------------|
| Admin | `admin@queue.com` | `admin123` | ระบบ seed ให้อัตโนมัติตอนรันครั้งแรก | เมนู "แอดมิน": ดูการจองของทุกคนพร้อมชื่อ-อีเมลผู้จอง |
| ผู้ใช้ (User) | `test@example.com` | `123456` | สมัครผ่านหน้าเว็บ (มีเฉพาะเครื่องที่ทดสอบไว้) | จองคิว, ดูคิวของตัวเอง, ยกเลิกคิว |

> ถ้ารันบนเครื่องใหม่ (DB ว่าง) จะมีเฉพาะบัญชี Admin — บัญชีผู้ใช้กด "สมัครสมาชิก"
> สร้างเองได้เลย ทุกบัญชีที่สมัครใหม่จะได้ role เป็น user โดยอัตโนมัติ

**คำสั่งอื่นที่ใช้บ่อย**

```bash
docker compose down            # ปิดทั้งระบบ (ข้อมูล DB ยังอยู่)
docker compose logs -f backend # ดู log ของ backend
docker compose up -d --build   # rebuild หลังแก้โค้ด
```

### 5.2 แบบ Manual (สำหรับพัฒนา — มี hot reload)

**ขั้นตอนที่ 1** — เตรียม Database

ใช้ MongoDB ใน Docker (`docker compose up -d mongo`)
หรือสมัคร [MongoDB Atlas](https://www.mongodb.com/atlas) ฟรี

**ขั้นตอนที่ 2** — รัน Backend

```bash
cd backend
cp .env.example .env   # แก้ค่า MONGO_URI และ JWT_SECRET ในไฟล์ .env
npm install
npm run dev            # เซิร์ฟเวอร์รันที่ http://localhost:5000
```

**ขั้นตอนที่ 3** — รัน Frontend (เปิด Terminal อีกหน้าต่าง)

```bash
cd frontend
npm install
npm run dev            # เว็บรันที่ http://localhost:5173
```

---

## 6. ขั้นตอนการใช้งานระบบ

**ขั้นตอนที่ 1 — สมัครสมาชิก**
เปิดหน้าเว็บ → กด "สมัครสมาชิก" → กรอกชื่อ อีเมล รหัสผ่าน (อย่างน้อย 6 ตัวอักษร)

**ขั้นตอนที่ 2 — เข้าสู่ระบบ**
กรอกอีเมลและรหัสผ่าน ระบบจะพาไปหน้าจองคิวอัตโนมัติ

**ขั้นตอนที่ 3 — จองคิว**
1. เลือกบริการ (แต่ละบริการมีระยะเวลากำกับ เช่น ตัดผม 30 นาที, ทำสีผม 90 นาที)
2. เลือกวันที่
3. เลือกเวลาเริ่ม — ชั่วโมง : นาที (นาทีเลือกได้เฉพาะ 00, 10, 20, 30, 40, 50)
4. ระบบแสดงเวลาเสร็จโดยประมาณให้เห็นทันที → กด "จองคิว"
5. ถ้าช่วงเวลาทับกับคิวคนอื่น ระบบจะแจ้ง "ช่วงเวลานี้ถูกจองแล้ว"

**ขั้นตอนที่ 4 — จัดการคิวของตัวเอง**
ดูรายการคิวทั้งหมดในตาราง "คิวของฉัน" พร้อมสถานะ และกดยกเลิกได้

**ขั้นตอนที่ 5 — สำหรับผู้ดูแลระบบ (admin)**
บัญชีที่มี role เป็น `admin` จะเห็นเมนู "แอดมิน" เพิ่มขึ้นมา
ใช้ดูการจองทั้งหมดของทุกคนพร้อมชื่อและอีเมลผู้จอง

---

## 7. จุดเด่นของโปรเจค

> เหมาะสำหรับใช้เล่าตอนสัมภาษณ์งาน

1. **เช็คคิวซ้อน (Overlap check)** — backend ตรวจสอบว่าช่วงเวลาที่จองไม่ทับกับคิวเดิม
   ด้วยเงื่อนไข `startTime < end AND endTime > start` ก่อนบันทึกเสมอ
2. **กติกาเวลาแบบ slot** — เลือกเวลาเริ่มได้เฉพาะทุก ๆ 10 นาที และเวลาสิ้นสุดคำนวณจาก
   ระยะเวลาของแต่ละบริการฝั่ง server (validate ซ้ำฝั่ง backend — ไม่เชื่อ input จาก client)
3. **Authentication ด้วย JWT** — รหัสผ่านถูก hash ด้วย bcrypt ไม่เก็บเป็น plain text
4. **Role-based access** — แยกสิทธิ์ user/admin ผ่าน middleware
5. **แยก frontend/backend ชัดเจน** — สื่อสารกันผ่าน REST API เหมือนระบบงานจริง
6. **Deploy ด้วย Docker** — frontend ใช้ multi-stage build (build ด้วย Node → เสิร์ฟด้วย nginx)
   ทำให้ image เล็ก และ nginx ทำหน้าที่ reverse proxy แก้ปัญหา CORS ไปในตัว
