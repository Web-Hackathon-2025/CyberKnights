
---

# 🩺 Tabeeb AI — Intelligent Healthcare Platform

### AI-powered digital health ecosystem for patients and doctors

> “From symptoms to diagnosis — powered by AI, connected to real doctors.”

---

## 🌍 Overview

**Tabeeb AI** is an intelligent healthcare platform that bridges AI diagnostics with real-world medical care.
It allows users to **chat with an AI health assistant**, receive preliminary guidance or possible diagnoses, and then **connect directly with verified doctors** for consultation — online or in-person.

After each consultation, the platform automatically **extracts clinical notes**, updates the user’s **electronic health record (EHR)**, and keeps a **personal health history** accessible across web and mobile.

Tabeeb AI is built to go beyond traditional booking apps like *Oladoc* and *Marham* — evolving into a **complete digital health companion** with personalized, AI-driven care.

---

## 🎯 Core Concept

| Phase                               | Description                                                                                                                                              |
| ----------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **1. AI Chat (Triage)**             | User interacts with an AI assistant, describing symptoms. The AI asks counter-questions, infers possible diagnoses, and recommends suitable specialists. |
| **2. Doctor Recommendation**        | Based on AI results, the system suggests verified doctors by specialty, experience, and availability.                                                    |
| **3. Consultation Booking**         | The user can book an online or in-person consultation seamlessly through the platform.                                                                   |
| **4. Post-Consultation Summary**    | After each meeting, AI automatically generates structured **clinical notes** (SOAP style) from the conversation or uploaded reports.                     |
| **5. EHR & Personal Health Record** | Each user has a secure EHR that stores past visits, prescriptions, lab reports, and AI summaries — used as **context** for future interactions.          |

---

## ⚙️ Key Features

### 🧠 AI Health Assistant

* Conversational chatbot for symptom assessment
* Dynamic counter-questions and health guidance
* AI-generated disclaimer & recommended next steps
* Uses LangChain or similar agent framework for contextual reasoning

### 👨‍⚕️ Doctor Discovery & Booking

* Search by specialty, location, availability, reviews
* AI-recommended doctors based on user’s symptoms
* Instant or scheduled appointments (online / physical)
* Automated reminders and confirmations

### 📹 Online Consultation

* Secure video calls between doctor and patient
* In-session notes panel for doctors
* End-to-end encryption with third-party APIs (e.g., Twilio/Agora)

### 🩺 Clinical Note Generation

* NLP-based meeting transcript summarization
* Generates structured SOAP notes and suggested follow-ups
* Auto-updates user’s EHR

### 📚 Electronic Health Record (EHR)

* Longitudinal record of each user’s medical history
* Includes AI chat logs, consultations, prescriptions, lab uploads
* Contextual data reused in next AI chat for better accuracy

### 🔔 Notifications & Reminders

* Email + in-app + push notifications for appointments and follow-ups

### 👩‍⚕️ Doctor Portal

* Manage appointments and patient lists
* View AI triage summary before the consultation
* Create, edit, and view clinical notes
* Analytics dashboard (patients, performance, reviews)

### 🛡️ Admin Panel

* Manage users, doctors, and appointments
* Moderate AI content, handle escalations
* Access reports and analytics

---

## 💻 Platform Distribution

| Platform                      | Purpose                                                  | Login Requirement         |
| ----------------------------- | -------------------------------------------------------- | ------------------------- |
| **Web App**                   | Marketing, discovery, full dashboards                    | Optional (before booking) |
| **Mobile App (React Native)** | Primary user experience: AI chat, booking, consultations | Required                  |
| **Doctor Web Portal**         | Full practice management                                 | Required                  |
| **Admin Web Portal**          | Management, analytics, configuration                     | Internal                  |

---

## 🧩 System Architecture (High Level)

```
Frontend (Web + Mobile)
│
├── API Gateway / Backend Services
│   ├── Auth Service (JWT / OTP)
│   ├── User Service (Profiles, Roles)
│   ├── Doctor Service (Schedules, Reviews)
│   ├── Booking Service (Appointments, Payments)
│   ├── Chat Service (AI triage, LangChain agent)
│   ├── Notes Service (NLP summarization)
│   ├── EHR Service (Records, Files, Context)
│   └── Notification Service
│
└── Integrations
    ├── Video API (Agora/Twilio)
    ├── Payment Gateway
    ├── Email/SMS Notifications
    └── Cloud Storage (e.g., AWS S3)
```

---

## 🧰 Tech Stack

| Layer                     | Technology                                |
| ------------------------- | ----------------------------------------- |
| **Frontend (Web)**        | React + TailwindCSS + ShadCN UI           |
| **Frontend (Mobile)**     | React Native                              |
| **Backend**               | Node.js / Express                         |
| **Database**              | PostgreSQL / MongoDB (modular EHR design) |
| **AI Layer**              | LangChain + OpenAI / Local LLM agent      |
| **Auth**                  | JWT + Google OAuth + Phone OTP            |
| **Video / Communication** | Agora / Twilio SDK                        |
| **Storage**               | AWS S3 / Firebase Storage                 |
| **Hosting / Infra**       | Docker + Nginx + AWS EC2                  |
| **Dev Tools**             | GitHub, Postman, Jira, Figma, Notion      |

---

## 🚀 Development Roadmap

| Phase                           | Focus                                     | Deliverables                                                                     |
| ------------------------------- | ----------------------------------------- | -------------------------------------------------------------------------------- |
| **Phase 1 — MVP**               | Core Auth + AI Chat + Booking             | Backend auth (shared), AI chat API, basic booking system, minimal UI (web + app) |
| **Phase 2 — Consultations**     | Video consult + Doctor portal             | Video SDK integration, doctor management, appointments dashboard                 |
| **Phase 3 — Notes & EHR**       | Clinical note generation + record storage | NLP summarization, record module, patient dashboard                              |
| **Phase 4 — Personalization**   | AI context + smart follow-ups             | EHR-driven AI queries, smart alerts, insights                                    |
| **Phase 5 — Scale & Analytics** | Admin panel + reporting                   | Multi-role dashboards, performance analytics                                     |

---

## 🧭 Positioning vs Competitors

| Feature                   | Oladoc              | Marham              | **Tabeeb AI**              |
| ------------------------- | ------------------- | ------------------- | -------------------------- |
| AI Symptom Chat           | ❌                   | ❌                   | ✅                          |
| AI-recommended Doctors    | ❌                   | ❌                   | ✅                          |
| Automatic Clinical Notes  | ❌                   | ❌                   | ✅                          |
| EHR & User Health History | ⚠️ Partial          | ⚠️ Partial          | ✅ Full                     |
| Doctor Portal             | ✅                   | ✅                   | ✅ (AI-enhanced)            |
| Data-driven Insights      | ❌                   | ❌                   | ✅                          |
| Focus                     | Booking marketplace | Booking marketplace | **AI + Smart Care System** |

---

## 🧠 Vision

> “Tabeeb AI aims to transform healthcare in emerging markets —
> from reactive doctor visits to proactive, AI-driven digital care.”

We’re building a system that **learns from each consultation**, gets **smarter with every user**,
and makes healthcare **accessible, contextual, and continuous** — not just an appointment, but a lifelong health companion.

---

## 👥 Team Guidelines

* Use **GitHub Projects** for issue tracking.
* Branch naming: `feature/`, `fix/`, `hotfix/`, `release/`.
* Keep backend and frontend modular with shared `.env` for API base URLs.
* Always commit meaningful messages.
* Protect `main` and `staging` branches with PR reviews.

---

## 🧾 License

Proprietary © 2025 — **Tabeeb AI Team**
All rights reserved. Redistribution or commercial use not permitted without written consent.

---
