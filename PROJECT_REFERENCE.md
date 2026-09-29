# One Front Door (OFD) — Full Project Architecture & Reference Manual

> **Purpose of this Document:**  
> This file is a complete, self-contained reference manual for the **One Front Door (OFD)** project. It details the system architecture, domain routing model, component taxonomy, state management, page layouts, UI/UX design language, and technical specifications so that any AI model or developer can instantly understand, extend, or reconstruct the entire application.

---

## 1. Project Overview & Problem Statement

### 1.1 The Problem
In modern higher education institutions, administrative and academic management systems are fragmented across isolated departmental silos:
- **Fees & Finance Office:** Handles tuition deadlines, installment approvals, scholarship adjustments, and finance clearances.
- **Controller of Examinations (CoE):** Handles exam schedules, hall tickets, re-evaluation, admit cards, and grade sheets.
- **IT & Network Operations Center:** Handles campus Wi-Fi (eduroam), VPN configs, single sign-on (SSO), and LMS credentials.
- **Campus Facilities & Hostel Management:** Handles library room bookings, hostel gate passes, cafeteria services, and sports facilities.

When students have inquiries, they often don't know which department owns a specific process, resulting in misrouted helpdesk tickets, long response times, and administrative friction.

### 1.2 The Solution: One Front Door (OFD)
**One Front Door** acts as a unified multi-domain AI orchestration gateway (**LUNA Orchestrator**) embedded directly into the university's student portal (styled after modern Camu student portals). 

Instead of forcing students to navigate multiple portals or guess administrative divisions, **OFD** accepts natural language queries, classifies semantic intent, dynamically disambiguates vague inquiries, breaks down multi-domain questions into parallel retrievals, and gracefully escalates out-of-scope requests to human support staff with auto-generated tracking tickets.

---

## 2. Technology Stack & Dependencies

- **Core Framework:** React 19 (`react`, `react-dom`)
- **Build Tooling & Bundler:** Vite 8 (`vite`, `@vitejs/plugin-react`)
- **Routing:** React Router v7 (`react-router-dom`)
- **Styling & Design System:**
  - Tailwind CSS v4 (`tailwindcss`, `@tailwindcss/vite`, `postcss`, `autoprefixer`)
  - Typography: Geist Variable Font (`@fontsource-variable/geist`)
  - Utility helpers: `clsx`, `tailwind-merge`, `class-variance-authority`, `cn`
  - Animations: `tw-animate-css`
- **Component Libraries & UI Primitives:**
  - Radix UI (`radix-ui`, `@radix-ui/react-slot`, `shadcn` UI patterns)
- **Icons & Visual Assets:** Lucide React (`lucide-react`)
- **Data Visualization & Analytics:** Recharts (`recharts`)
- **Linting & Code Quality:** Oxlint (`oxlint`)

---

## 3. Directory Structure

```
one-front-door/
├── index.html                  # Main HTML entry point with Geist font setup & app container
├── vite.config.js              # Vite configuration with React & Tailwind plugins
├── package.json                # Project dependencies and script declarations
├── jsconfig.json               # Path aliases and JS language configuration
├── components.json             # Shadcn UI configuration file
├── src/
│   ├── main.jsx                # Application root mounting file
│   ├── App.jsx                 # Main application router and layout wrapper
│   ├── App.css                 # Base custom styling rules
│   ├── index.css               # Design system tokens, CSS variables, utility layers
│   ├── assets/                 # Static imagery and graphical assets
│   ├── lib/                    # Shared utility functions (`utils.js` / `cn`)
│   ├── data/
│   │   └── mockData.js         # Student profile, domain taxonomy, routing engine, metrics
│   ├── components/
│   │   ├── DraggableBot.jsx    # Persistent floating AI bot widget with interactive drawer
│   │   ├── layout/
│   │   │   └── CamuLayout.jsx  # Main institutional portal wrapper with sidebar & header
│   │   ├── responses/
│   │   │   ├── AnswerCard.jsx          # Single-domain grounded response renderer
│   │   │   ├── ClarificationCard.jsx    # Disambiguation prompt card for ambiguous queries
│   │   │   ├── MultiDomainCard.jsx     # Multi-domain decomposed response card
│   │   │   └── HandoffCard.jsx         # Out-of-scope ticket creation & escalation card
│   │   └── ui/                         # Reusable UI primitives (Button, Card, Badge, Avatar, Sheet, Tooltip, etc.)
│   └── pages/
│       ├── Dashboard.jsx       # Student institutional dashboard (Profile, Timetable, Attendance, Fees, etc.)
│       ├── Chat.jsx            # Full-screen LUNA AI chat workspace with routing transparency
│       └── Evaluation.jsx      # AI system evaluation & benchmark dashboard (Confusion matrix, Accuracy, Latency)
```

---

## 4. Architectural Concepts & System Capabilities

### 4.1 Four Core Functional Domains
1. **Fees & Finance (`fees`):**
   - Accent Color: Emerald (`#059669`)
   - Lead Authority: Office of the Comptroller & Student Finance
   - Topics: Tuition deadlines, installment plans, late fee penalties, payment gateways.
2. **Examination & Evaluation (`examination`):**
   - Accent Color: Amber (`#d97706`)
   - Lead Authority: Controller of Examinations (CoE)
   - Topics: Exam timetables, admit cards, course registration, attendance requirements, back-paper rules.
3. **IT & Digital Services (`it`):**
   - Accent Color: Indigo (`#4f46e5`)
   - Lead Authority: Central IT & Network Operations Center
   - Topics: Campus Wi-Fi configuration (eduroam), VPN, SSO credentials, MAC registration.
4. **Campus Facilities (`facilities`):**
   - Accent Color: Violet (`#7c3aed`)
   - Lead Authority: Campus Estate & Facility Management
   - Topics: Discussion room bookings in Central Library, hostel leave/gate pass generation, cafeteria schedules.

---

### 4.2 Intelligent Intent Routing & Response Taxonomy

The OFD routing engine (`src/data/mockData.js` -> `routeUserQuery()`) processes queries into four response types:

#### 1. Standard Single-Domain Answer (`type: "answer"`)
- Returned when a query maps cleanly to one domain with high confidence ($\ge 90\%$).
- Contains: Direct answer text (Markdown formatted), official citations/sources, and technical routing metadata.
- Example: *"When is the semester fee deadline?"* $\rightarrow$ Domain: **Fees** (Confidence: 91%).

#### 2. Disambiguation Clarification (`type: "clarification"`)
- Triggered when user intent is ambiguous across multiple domain endpoints (e.g. asking for "registration" without specifying fee vs exam registration).
- Displays interactive selection options allowing the user to select their precise intent.
- Example: *"When is the registration deadline?"* $\rightarrow$ Prompts user to choose between **Fee Payment Registration** vs **Examination Registration**.

#### 3. Multi-Domain Decomposition (`type: "multi_answer"`)
- Activated when a query spans two or more distinct domains.
- Decomposes the user input into parallel sub-queries, executes domain-level retrievals, and presents a split-card response.
- Example: *"When is the semester fee deadline and when are mid-semester exams?"* $\rightarrow$ Returns separate answers for **Fees** and **Examination**.

#### 4. Human Handoff & Administrative Escalation (`type: "handoff"`)
- Engaged when a query is out-of-scope or policy guidelines require human approval (e.g., special hostel permissions).
- Formally logs an administrative ticket (`OFD-94021`) with SLA indicators and hands off the inquiry to Student Helpdesk.

---

### 4.3 Technical Routing Metadata (Transparency Layer)
Every answer rendered by LUNA exposes system routing diagnostics to build user trust:
- **Domain:** Primary domain assigned by classifier.
- **Confidence:** Statistical confidence score (e.g., `94%`).
- **Semantic Match:** Cosine similarity metric score (e.g., `0.88`).
- **Keyword Signal:** Active keyword match flags.
- **Latency:** Routing inference execution time in milliseconds (e.g., `115ms`).
- **Routed By:** Specific classifier component name (e.g., `OFD Semantic Intent Classifier v2.4`).

---

## 5. Application Pages & Key Features

### 5.1 Student Dashboard (`src/pages/Dashboard.jsx`)
- **Institution Header:** Shows student profile banner (**Siddharth Rawat**, B.Tech CSE - Cyber Security, Roll No: `S24CSEU0542`, Semester 5).
- **Navigation Tabs:**
  - **Profile (`tab=profile`):** Comprehensive academic details, department info, faculty advisor/mentor (`Dr. A. Sharma`), and course progress.
  - **Timetable (`tab=timetable`):** Interactive day-by-day class scheduler (Monday–Saturday) showing lecture rooms, course codes, timings, faculty, and real-time attendance status.
  - **Attendance (`tab=attendance`):** Subject-wise attendance percentages, aggregated score (`88.4%`), and exam eligibility status.
  - **Exam Schedules (`tab=exams`):** Examination calendars, admit card download triggers, and hall assignments.
  - **Leave & Gate Pass (`tab=gatepass`):** Hostel leave request manager with parent OTP verification status and automated digital QR gate pass generator.
  - **Messages / Reports / Progress:** Secondary portal tools.

---

### 5.2 LUNA AI Chat Interface (`src/pages/Chat.jsx`)
- **Domain Filter Badges:** Quick visual filter buttons for **All Domains**, **Fees**, **Examination**, **IT Services**, and **Facilities**.
- **Suggested Prompts Bar:** Chip selectors for common queries (*Fee Deadline*, *Ambiguous Query*, *Fees + Exams*, *Out of Scope*, *Wi-Fi Config*, *Library Room*).
- **Message Stream:** Multi-turn message list rendering `AnswerCard`, `ClarificationCard`, `MultiDomainCard`, or `HandoffCard`.
- **Query History Drawer:** Displays past student query history categorized by timeframe (*Today*, *Yesterday*, *Previous 7 Days*).
- **Interactive Audio Preview:** Built-in text-to-speech sound preview toggles on responses.

---

### 5.3 System Evaluation Dashboard (`src/pages/Evaluation.jsx`)
Provides real-time telemetry and benchmarking metrics for AI model performance:
- **Top Summary Metrics:**
  - **Routing Accuracy:** `93.4%` ($\uparrow 2.1\%$)
  - **Grounded Answer Rate:** `96.1%` ($\uparrow 0.8\%$)
  - **Clarification Accuracy:** `89.2%` ($\uparrow 3.4\%$)
  - **End-to-End Resolution:** `91.5%` ($\uparrow 1.9\%$)
  - **Wrong Confident Route (Warning Metric):** `1.8%` ($\downarrow 0.5\%$)
- **Domain Performance Breakdown:** Table detailing total query counts, classification accuracy, average confidence, and average latency per domain.
- **5x5 Confusion Matrix:** Visual grid showing actual vs. predicted classification percentages across Fees, Examination, IT, Facilities, and Handoff.
- **Latency Distribution Histogram:** Response latency buckets ($<100\text{ms}$, $100\text{-}150\text{ms}$, $150\text{-}200\text{ms}$, $>200\text{ms}$).

---

### 5.4 Persistent Draggable AI Bot (`src/components/DraggableBot.jsx`)
- **Floating Button:** Draggable floating action button (FAB) that lives on top of all portal views.
- **Mini Chat Overlay:** Expanding popover widget allowing instant query entry without leaving the current dashboard view.
- **Quick Switch:** Includes a direct shortcut button to expand into the dedicated `/chat` page.

---

## 6. Key Data Schemas & Models

### 6.1 Student Profile Object
```js
export const STUDENT_PROFILE = {
  name: "Siddharth Rawat",
  admissionNo: "1006",
  rollNo: "S24CSEU0542",
  degree: "Undergraduate",
  department: "School of Computer Science Engineering & Technology",
  semester: "Semester - 5",
  academicYear: "2026-2027",
  courseName: "Bachelor of Technology (Computer Science and Engineering)",
  specialization: "Cyber Security",
  batch: "2024-2028",
  status: "Active",
  mentor: "Dr. A. Sharma (SCSET Faculty Advisor)"
};
```

---

### 6.2 Query Response Schema
```js
// Answer Card Format
{
  type: "answer",
  domain: "fees",
  domainLabel: "Fees & Finance",
  confidence: 0.91,
  answer: "Markdown text response...",
  sources: [
    { title: "Fee Policy Handbook 2026", section: "Section 4.2", linkText: "View Fee Handbook" }
  ],
  routingInfo: {
    domain: "Fees",
    confidence: "91%",
    semanticMatch: 0.76,
    keywordSignal: "Yes (matched: 'semester fee', 'deadline')",
    domainMargin: 0.34,
    latency: "148ms",
    routedBy: "OFD Semantic Intent Classifier v2.4"
  }
}

// Clarification Format
{
  type: "clarification",
  question: "I detected multiple academic registration processes...",
  options: [
    { id: "fee_reg", label: "Fee Payment Registration", domain: "fees" },
    { id: "exam_reg", label: "Examination Registration", domain: "examination" }
  ]
}

// Handoff Format
{
  type: "handoff",
  domain: "unknown",
  answer: "I couldn't find reliable information...",
  reason: "Policy requires manual Warden review...",
  suggestedAction: "Forward to Student Helpdesk...",
  mockTicketId: "OFD-94021",
  sla: "Official resolution response within 24–48 business hours"
}
```

---

## 7. How to Run & Build

### 7.1 Development Server
```bash
npm run dev
```
Runs Vite dev server hosted on `0.0.0.0:5175`.

### 7.2 Production Build
```bash
npm run build
```
Generates optimized static bundle in `/dist`.

### 7.3 Code Quality & Linting
```bash
npm run lint
```
Executes Oxlint fast lint checks.

---

## 8. Guidance for AI Models & Developers

When adding new features or modifying this codebase:
1. **Maintain Routing Transparency:** Always populate `routingInfo` when adding new intent matchers in `mockData.js`.
2. **Follow Response Type Contracts:** Ensure responses conform strictly to one of the four types (`answer`, `clarification`, `multi_answer`, `handoff`).
3. **Preserve Camu Layout Integration:** Keep all portal pages wrapped within `CamuLayout` to retain top navigation bar, sidebar, and floating bot functionality.
4. **Use Color Accents Consistently:**
   - Fees: Emerald (`bg-emerald-50`, `text-emerald-700`)
   - Examination: Amber (`bg-amber-50`, `text-amber-700`)
   - IT Services: Indigo (`bg-indigo-50`, `text-indigo-700`)
   - Facilities: Violet (`bg-violet-50`, `text-violet-700`)
