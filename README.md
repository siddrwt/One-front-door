# 🚪 One Front Door (OFD) — Unified University AI Gateway & Portal

[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

> **One Front Door (OFD)** is a unified multi-domain academic & campus AI orchestration platform designed for higher education institutions. Powered by **LUNA Orchestrator**, OFD seamlessly routes natural language queries across departmental silos—**Fees & Finance**, **Examination & CoE**, **IT & Digital Services**, and **Campus Facilities**—into a single, intuitive interface.

---

## 🌟 Key Features

- 🧭 **Multi-Domain Intent Classifier:** Automatically routes inquiries to the correct department with semantic match scoring and confidence transparency metrics.
- 🔀 **Smart Disambiguation:** Resolves vague inquiries (e.g., *"When is the registration deadline?"*) by rendering interactive clarification cards (Fee Registration vs Exam Registration).
- 🧩 **Multi-Domain Decomposition:** Breaks down complex, multi-part student questions into parallel domain-specific retrievals.
- 🎟️ **Human Handoff & Auto-Ticketing:** Gracefully escalates out-of-scope or policy-restricted requests to student support desk with tracked ticket IDs (`OFD-94021`).
- 🎓 **Camu Student Portal Integration:** Full institutional dashboard interface for student profiles, class timetables, subject attendance metrics, and hostel gate pass requests.
- 🤖 **Persistent Draggable AI Bot:** Floating AI assistant widget (`DraggableBot`) accessible anywhere on the portal with draggable FAB controls and expanding mini-chat drawer.
- 📊 **AI Evaluation & Telemetry Dashboard:** Performance benchmark suite displaying routing accuracy, confusion matrices, grounded answer rates, and response latency breakdowns.

---

## 🏛️ Core Functional Domains

| Domain | Lead Department | Key Coverage |
| :--- | :--- | :--- |
| 💳 **Fees & Finance** | Office of the Comptroller | Tuition deadlines, installment declarations, late penalties, payment gateways |
| 📝 **Examination & Evaluation** | Controller of Examinations (CoE) | Timetables, admit cards, hall tickets, grade sheets, attendance rules |
| 📶 **IT & Digital Services** | Central Network Operations | eduroam Wi-Fi configs, VPN settings, LMS access, single-sign-on credentials |
| 🏛️ **Campus Facilities** | Campus Estate & Hostel Admin | Library discussion room bookings, hostel leave/gate pass QR generation |

---

## 📸 Page Highlights

1. **Student Dashboard (`/`):** View student profile (**Siddharth Rawat**, B.Tech CSE Cyber Security), daily class timetable, attendance stats, and digital gate pass generator.
2. **LUNA AI Chat Workspace (`/chat`):** Full multi-turn conversational AI workspace with domain badges, prompt chips, audio response preview, and query history drawer.
3. **Evaluation Dashboard (`/evaluation`):** Real-time performance evaluation dashboard showcasing a 5x5 confusion matrix, classification accuracy breakdown, and response latency histograms.

---

## 🚀 Quick Start Guide

### Prerequisites
- **Node.js** (v18.0.0 or higher recommended)
- **npm** or **yarn**

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/one-front-door.git
   cd one-front-door
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```
   The application will be live at `http://localhost:5175`.

---

## 🛠️ Tech Stack & Architecture

- **Frontend:** React 19, Vite 8, React Router v7
- **Styling:** Tailwind CSS v4, `@fontsource-variable/geist`, `tw-animate-css`
- **UI Components:** Radix UI Primitives, Lucide React Icons
- **Data Visualization:** Recharts
- **Linting:** Oxlint

---

## 📖 Complete Documentation & AI Reference

For an exhaustive technical reference manual (ideal for AI context prompts or deep developer onboarding), see:
👉 **[PROJECT_REFERENCE.md](./PROJECT_REFERENCE.md)**

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for details.
