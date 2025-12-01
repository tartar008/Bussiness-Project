# Traceability Frontend Structure

This project is the frontend system for the **Rubber Traceability Platform**, designed to manage:
- Farmers  
- Plots (GIS / Polygon)  
- Transport Routes  
- Buyers  
- Inspections & Quality  
- Daily rubber flow  

The structure is designed for scalability, readability, and easy migration from mock API → real API.

---

# 📁 Project Structure

```
src/
├── api/
│   ├── mock/
│   ├── services/
│   └── http.ts
│
├── components/
│   ├── farmers/
│   ├── plots/
│   ├── transport/
│   └── shared/
│
├── layouts/
│
├── pages/
│   ├── dashboard/
│   ├── farmers/
│   ├── plots/
│   ├── transport/
│   └── auth/
│
├── stores/
│
├── router/
│
├── utils/
│
├── styles/
│
├── hooks/
│
├── App.tsx
└── main.tsx
```

---

# 📌 Folder Explanations

## 1) `api/`
รวมทุกอย่างเกี่ยวกับการ **เชื่อมต่อข้อมูล**

### 🔹 `api/mock/`
Mock API สำหรับตอนที่ยังไม่มี backend  
หน้า UI ใช้งานจริงได้ โดยไม่ต้องรอ API จริง

### 🔹 `api/services/`
Service Layer  
ใช้สำหรับสื่อสารกับ API (จริงหรือ mock)

ตัวอย่าง:
- `farmer.service.ts`
- `plot.service.ts`
- `transport.service.ts`

### 🔹 `api/http.ts`
Axios wrapper สำหรับตั้งค่า:
- Base URL  
- Token  
- Interceptors  

---

## 2) `components/`
UI Components แบบ reusable  
แยกตามแต่ละโดเมนหลักของระบบ

- `farmers/` – ชุด component สำหรับเกษตรกร  
- `plots/` – component ที่ใช้กับแปลงยาง + แผนที่  
- `transport/` – component เกี่ยวกับการขนส่ง  
- `shared/` – ปุ่ม, Modal, Header, Table, Map viewer

---

## 3) `layouts/`
Layout หลัก เช่น:
- Default layout (sidebar + header)
- Auth layout (หน้า login โล่งๆ)

---

## 4) `pages/`
หน้าเว็บจริงของแต่ละ module

- `dashboard/` – หน้า KPI / Overview  
- `farmers/` – รายการเกษตรกร, รายละเอียด, เพิ่มใหม่  
- `plots/` – แผนที่, Polygon, รายละเอียดแปลง  
- `transport/` – เส้นทางขนส่ง, Tracking  
- `auth/` – Login / Register  

---

## 5) `stores/`
Global state management (Zustand / Redux)

ตัวอย่าง State:
- ผู้ใช้ที่ล็อกอิน
- รายการเกษตรกร
- ข้อมูล dashboard
- ข้อมูล map / polygon

---

## 6) `router/`
จัดการ routing ทั้งหมดของเว็บ  
เช่น `/dashboard`, `/farmers/:id`

---

## 7) `utils/`
Utility functions เช่น:
- Format วันที่
- Convert unit
- Validator
- Constant

---

## 8) `styles/`
เก็บ stylesheet:
- Global CSS
- Theme variables
- Tailwind config

---

## 9) `hooks/`
Custom React hooks  
เช่น:
- useFetch
- useDebounce
- usePagination

---

## 10) `App.tsx`
Root Component  
ใช้เชื่อม Layout + Router

## 11) `main.tsx`
Entry point ของ React

---

# 🎉 Summary

โครงสร้างนี้ถูกออกแบบให้:

✔ เหมาะกับโปรเจคขนาดใหญ่  
✔ แยก domain ชัดเจน (Farmers / Plots / Transport)  
✔ พัฒนา UI ได้ทันทีด้วย Mock API  
✔ สลับ API จริงได้ในอนาคตโดยไม่ต้องรื้อ UI  
✔ เหมาะกับระบบ Traceability ของคุณอย่างมาก  

พร้อมให้เริ่มพัฒนาต่อได้ทันที
