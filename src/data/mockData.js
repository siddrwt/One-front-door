// src/data/mockData.js
// Centralized mock data layer for One Front Door

export const STUDENT_PROFILE = {
  name: "Siddharth Rawat",
  avatarUrl: "/student_photo.png",
  photoUrl: "/student_photo.png",
  headerAvatarUrl: "/student_avatar.png",
  studentStatus: "Active",
  admissionNo: "1006",
  admissionYear: "2024-2025",
  rollNo: "S24CSEU0542",
  degree: "Undergraduate",
  department: "School of Computer Science Engineering & Technology",
  semester: "Semester - 5",
  academicYear: "2026-2027",
  courseName: "Bachelor of Technology (Computer Science and Engineering)",
  college: "School of Engineering & Technology",
  curriculumPlan: "B.Tech-CSE-2024- Cyber Security",
  status: "Active",
  program: "Bachelor of Technology",
  specialization: "Cyber Security",
  batch: "2024-2028",
  campus: "University Main Campus",
  institution: "University Academic Portal",
  studentIdBadge: "S24CSEU0542",
  mentor: "Dr. A. Sharma (SCSET Faculty Advisor)"
};

export const DOMAINS = [
  {
    id: "fees",
    name: "Fees & Finance",
    tagline: "Tuition, installments, scholarships & dues",
    badgeBg: "bg-emerald-50 text-emerald-700 border-emerald-200",
    badgeBorder: "border-emerald-300",
    accentColor: "#059669",
    iconName: "CreditCard",
    leadOfficer: "Office of the Comptroller & Student Finance",
    sampleQuery: "When is the semester fee deadline?"
  },
  {
    id: "examination",
    name: "Examination & Evaluation",
    tagline: "Timetables, admit cards, hall tickets & re-eval",
    badgeBg: "bg-amber-50 text-amber-700 border-amber-200",
    badgeBorder: "border-amber-300",
    accentColor: "#d97706",
    iconName: "FileSpreadsheet",
    leadOfficer: "Controller of Examinations (CoE)",
    sampleQuery: "When are the mid-semester exams?"
  },
  {
    id: "it",
    name: "IT & Digital Services",
    tagline: "Campus Wi-Fi, eduroam, VPN & LMS access",
    badgeBg: "bg-indigo-50 text-indigo-700 border-indigo-200",
    badgeBorder: "border-indigo-300",
    accentColor: "#4f46e5",
    iconName: "Wifi",
    leadOfficer: "Central IT & Network Operations Center",
    sampleQuery: "How do I configure campus eduroam Wi-Fi?"
  },
  {
    id: "facilities",
    name: "Campus Facilities",
    tagline: "Study room bookings, labs, sports & cafeteria",
    badgeBg: "bg-violet-50 text-violet-700 border-violet-200",
    badgeBorder: "border-violet-300",
    accentColor: "#7c3aed",
    iconName: "Building2",
    leadOfficer: "Campus Estate & Facility Management",
    sampleQuery: "How can I book a discussion room in the Central Library?"
  }
];

export const SUGGESTED_QUERIES = [
  {
    label: "Fee Deadline",
    query: "When is the semester fee deadline?",
    type: "answer",
    domain: "fees"
  },
  {
    label: "Ambiguous Query",
    query: "When is the registration deadline?",
    type: "clarification",
    domain: "mixed"
  },
  {
    label: "Fees + Exams (Multi-Domain)",
    query: "When is the semester fee deadline and when are the mid-semester exams?",
    type: "multi_answer",
    domain: "multi"
  },
  {
    label: "Out of Scope (Handoff)",
    query: "Can I bring an exotic pet to stay in the campus hostel?",
    type: "handoff",
    domain: "unknown"
  },
  {
    label: "Wi-Fi Config (IT)",
    query: "How do I configure campus eduroam Wi-Fi on my laptop?",
    type: "answer",
    domain: "it"
  },
  {
    label: "Library Room (Facilities)",
    query: "How can I book a discussion room in the Central Library?",
    type: "answer",
    domain: "facilities"
  }
];

// Predefined structured responses for known queries
export const MOCK_RESPONSES = {
  fee_deadline: {
    type: "answer",
    domain: "fees",
    domainLabel: "Fees & Finance",
    confidence: 0.91,
    answer: "The semester tuition & academic fee deadline for Spring Semester 2026 is **February 15, 2026 at 11:59 PM IST**.\n\nPayments made after February 15 will incur a standard late penalty of ₹500 per calendar week until February 28. NetBanking, RTGS/NEFT, and authorized UPI payment gates are active on the student finance portal.",
    sources: [
      { title: "Fee Policy Handbook 2026", section: "Section 4.2: Regular Payment Schedules", linkText: "View Fee Handbook" },
      { title: "Student Finance Office Circular", section: "Ref: SFO/2026/01-SEM", linkText: "Official Notification PDF" }
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
  },

  exam_clarified: {
    type: "answer",
    domain: "examination",
    domainLabel: "Examination & Evaluation",
    confidence: 0.94,
    answer: "The deadline for **Examination Course Registration & Hall Ticket Enrollment** for Spring 2026 is **February 24, 2026**.\n\nStudents must verify course codes, internal evaluation components, and back-paper eligibility with their faculty mentors prior to final submission. Hall tickets will be issued digitally on March 10, 2026.",
    sources: [
      { title: "Controller of Examinations Calendar 2026", section: "Part B: Enrollment Windows", linkText: "CoE Circular 2026-03" },
      { title: "Academic Ordinances & Assessment Rules", section: "Clause 7.1: Hall Ticket Eligibility", linkText: "Ordinances Document" }
    ],
    routingInfo: {
      domain: "Examination",
      confidence: "94%",
      semanticMatch: 0.88,
      keywordSignal: "Yes (disambiguated: 'examination registration')",
      domainMargin: 0.42,
      latency: "115ms",
      routedBy: "OFD Disambiguation Resolver"
    }
  },

  fee_clarified: {
    type: "answer",
    domain: "fees",
    domainLabel: "Fees & Finance",
    confidence: 0.95,
    answer: "The deadline for **Fee Payment Registration & Installment Option Declaration** is **February 15, 2026**.\n\nFailure to complete fee registration will prevent automatic course enrollment in the examination management portal. Installment approval requests must be submitted to the Student Finance Helpdesk by February 10.",
    sources: [
      { title: "Fee Policy Handbook 2026", section: "Section 3.1: Installment Regulations", linkText: "Fee Handbook 2026" }
    ],
    routingInfo: {
      domain: "Fees",
      confidence: "95%",
      semanticMatch: 0.89,
      keywordSignal: "Yes (disambiguated: 'fee registration')",
      domainMargin: 0.45,
      latency: "120ms",
      routedBy: "OFD Disambiguation Resolver"
    }
  },

  registration_ambiguity: {
    type: "clarification",
    question: "I detected multiple academic registration processes. To provide the accurate deadline and department procedures, which registration do you mean?",
    options: [
      {
        id: "fee_reg",
        label: "Fee Payment Registration",
        description: "Tuition installment declaration, finance clearance & payment receipts",
        domain: "fees"
      },
      {
        id: "exam_reg",
        label: "Examination Registration",
        description: "Course enrollment, admit card clearance & elective confirmation",
        domain: "examination"
      }
    ],
    routingInfo: {
      topDomains: ["fees (0.48)", "examination (0.46)"],
      confidenceSpread: 0.02,
      disambiguationRequired: true
    }
  },

  multi_domain_query: {
    type: "multi_answer",
    summary: "Your question encompasses multiple university functional domains. One Front Door decomposed your query into 2 parallel domain-specific retrievals:",
    answers: [
      {
        domain: "fees",
        domainLabel: "Fees & Finance",
        confidence: 0.93,
        questionPart: "When is the semester fee deadline?",
        answer: "The deadline for the Spring 2026 semester tuition fee installment is **February 15, 2026 (11:59 PM IST)**. Late submissions beyond this date incur ₹500/week penalty.",
        sources: [
          { title: "Fee Policy Handbook 2026", section: "Section 4.2" }
        ],
        routingInfo: {
          confidence: "93%",
          semanticMatch: 0.81,
          keywordSignal: "Yes ('semester fee', 'deadline')"
        }
      },
      {
        domain: "examination",
        domainLabel: "Examination & Evaluation",
        confidence: 0.90,
        questionPart: "When are the mid-semester exams?",
        answer: "Mid-semester theory examinations for Semester VI commence on **Monday, March 23, 2026** and conclude on **Tuesday, March 31, 2026**. Practical lab assessments run during March 16–20.",
        sources: [
          { title: "Academic Calendar Spring 2026", section: "Assessment Block 2" },
          { title: "CoE Examination Notification", section: "Circular 2026/04" }
        ],
        routingInfo: {
          confidence: "90%",
          semanticMatch: 0.79,
          keywordSignal: "Yes ('mid-semester exams')"
        }
      }
    ]
  },

  it_wifi_query: {
    type: "answer",
    domain: "it",
    domainLabel: "IT & Digital Services",
    confidence: 0.96,
    answer: "To connect your laptop to the secure campus wireless network:\n\n1. Select SSID: **`Apex-Campus-Secure`** or **`eduroam`**.\n2. Security Type: **WPA3-Enterprise / PEAP (MSCHAPv2)**.\n3. Identity: Enter your student portal username (`aarav.s23@apex.edu.in`).\n4. CA Certificate: Select *'Do not validate'* or install the *Apex-CA-2026 root certificate*.\n5. Password: Your institutional single-sign-on (SSO) credentials.\n\nGuest devices can register on the self-service MAC portal at `wifi.apex.internal`.",
    sources: [
      { title: "IT Services Knowledge Base", section: "KB-014: Wireless Authentication Guide", linkText: "IT Support Portal" },
      { title: "Campus Acceptable Network Use Policy", section: "Section 2.1: BYOD Devices", linkText: "Network Policy" }
    ],
    routingInfo: {
      domain: "IT",
      confidence: "96%",
      semanticMatch: 0.85,
      keywordSignal: "Yes ('eduroam', 'wi-fi', 'configure')",
      domainMargin: 0.51,
      latency: "135ms",
      routedBy: "OFD Semantic Intent Classifier v2.4"
    }
  },

  facilities_room_query: {
    type: "answer",
    domain: "facilities",
    domainLabel: "Campus Facilities",
    confidence: 0.92,
    answer: "Discussion rooms on Floors 2 and 3 of the Central Library can be booked online through the Student Facilities Portal:\n\n- **Slot Duration:** 1 to 3 hours per session (maximum 2 active reservations per student group).\n- **Advance Booking Window:** Up to 48 hours prior to reservation.\n- **Access Procedure:** Present digital confirmation badge at the Library Circulation Counter to collect RFID smart access card.\n- **Facilities Included:** 4K interactive display panel, high-speed ethernet, whiteboard, and power docks.",
    sources: [
      { title: "Central Library Operating Guidelines", section: "Rule 5: Collaborative Study Space Allocation", linkText: "Library Services Guide" },
      { title: "Campus Resource Booking Portal", section: "Direct Link: facilities.campus.edu.in/library", linkText: "Book Discussion Room" }
    ],
    routingInfo: {
      domain: "Facilities",
      confidence: "92%",
      semanticMatch: 0.78,
      keywordSignal: "Yes ('book discussion room', 'central library')",
      domainMargin: 0.41,
      latency: "155ms",
      routedBy: "OFD Semantic Intent Classifier v2.4"
    }
  },

  attendance_query: {
    type: "answer",
    domain: "examination",
    domainLabel: "Attendance & Academic Records",
    confidence: 0.98,
    answer: "Hello Siddharth! Your current aggregate attendance for **Semester 5 (B.Tech Cyber Security)** is **88.4%** (Required minimum: 75%).\n\n- **Cyber Forensics & Incident Response (CYS301):** 91.2% (31/34 classes attended)\n- **Network Security & Cryptography (CYS302):** 88.0% (22/25 classes attended)\n- **Cloud Security Architecture (CYS303):** 85.7% (24/28 classes attended)\n- **Vulnerability Assessment Lab (CYS304):** 93.3% (14/15 lab sessions)\n\n✅ You are fully eligible for mid-term and end-term examinations across all enrolled courses.",
    sources: [
      { title: "Campus Attendance Portal", section: "Academic Year 2026-2027 • Sem 5", linkText: "View Detailed Attendance" },
      { title: "Academic Regulations SCSET", section: "Clause 4.1: Mandatory Attendance Policy", linkText: "Regulations PDF" }
    ],
    routingInfo: {
      domain: "Attendance",
      confidence: "98%",
      semanticMatch: 0.94,
      keywordSignal: "Yes ('attendance', 'siddharth rawat', 'sem 5')",
      domainMargin: 0.55,
      latency: "98ms",
      routedBy: "OFD Semantic Intent Classifier v2.4"
    }
  },

  gate_pass_query: {
    type: "answer",
    domain: "facilities",
    domainLabel: "Hostel & Gate Pass System",
    confidence: 0.97,
    answer: "Here is how to apply for a **Hostel Leave or Gate Pass** at the University:\n\n1. Open **Leave and Gate Pass** on your student portal.\n2. Choose **Day Pass** (Curfew return: 9:30 PM) or **Outstation Leave**.\n3. Fill in departure time, expected return time, and destination address.\n4. An automated SMS/WhatsApp verification OTP will be sent to your parent's registered mobile number.\n5. Once verified and approved by the Hostel Warden, an encrypted **entry/exit QR code** will appear on your phone screen to scan at Campus Main Gate 1.",
    sources: [
      { title: "Campus Hostel Bylaws & Curfew Guidelines", section: "Section 3.2: Automated Gate Pass Rules", linkText: "Hostel Bylaws" },
      { title: "Chief Warden Office Circular", section: "Ref: CW/2026/02", linkText: "Gate Pass Notice" }
    ],
    routingInfo: {
      domain: "Hostel & Security",
      confidence: "97%",
      semanticMatch: 0.92,
      keywordSignal: "Yes ('gate pass', 'leave', 'hostel')",
      domainMargin: 0.49,
      latency: "110ms",
      routedBy: "OFD Semantic Intent Classifier v2.4"
    }
  },

  timetable_query: {
    type: "answer",
    domain: "examination",
    domainLabel: "Timetable & Schedules",
    confidence: 0.96,
    answer: "Here is your class schedule for **Semester 5 (B.Tech Cyber Security)**:\n\n- **Monday:** 09:30 AM - Network Security (LH-204) | 02:00 PM - Cloud Security Lab (Lab 301)\n- **Tuesday:** 10:30 AM - Cyber Forensics (LH-102) | 03:00 PM - Cryptography Workshop\n- **Wednesday:** 09:30 AM - Secure Cloud Architecture | 11:30 AM - SCSET Seminar\n- **Thursday:** 10:30 AM - Vulnerability Assessment (Lab 302)\n- **Friday:** 09:30 AM - Incident Response Analysis | 02:00 PM - Minor Project Review\n\nAll lecture halls are in the SCSET Academic Block.",
    sources: [
      { title: "SCSET Semester 5 Master Timetable", section: "Cyber Security Batch 2024-2028", linkText: "Download Full Timetable PDF" }
    ],
    routingInfo: {
      domain: "Timetable",
      confidence: "96%",
      semanticMatch: 0.91,
      keywordSignal: "Yes ('timetable', 'class schedule', 'sem 5')",
      domainMargin: 0.48,
      latency: "105ms",
      routedBy: "OFD Semantic Intent Classifier v2.4"
    }
  },

  out_of_scope_handoff: {
    type: "handoff",
    domain: "unknown",
    answer: "I couldn't find reliable information about this specific request in the University's official student handbooks or residential policies.",
    reason: "Hostel and campus bylaws require formal review by the Chief Warden, Dean of SCSET, or University Student Welfare Council for unlisted permissions.",
    department: "University Student Welfare & Academic Administration",
    suggestedAction: "Your query can be formally handed off to the Student Helpdesk as a routed administrative inquiry.",
    ticketPrefix: "OFD-TKT",
    mockTicketId: "OFD-94021",
    sla: "Official resolution response within 24–48 business hours"
  }
};

// Natural query dispatcher matching user inputs to responses
export function routeUserQuery(userInput) {
  const query = (userInput || "").toLowerCase().trim();

  // Multi-domain detection (fees + exam, or conjunctions)
  if (
    (query.includes("fee") || query.includes("fees")) &&
    (query.includes("exam") || query.includes("mid-semester") || query.includes("mid semester"))
  ) {
    return MOCK_RESPONSES.multi_domain_query;
  }

  // Clarification ambiguity detection (registration without specific domain)
  if (
    query.includes("registration") &&
    !query.includes("fee") &&
    !query.includes("exam") &&
    !query.includes("hostel")
  ) {
    return MOCK_RESPONSES.registration_ambiguity;
  }

  // Clarified fee registration
  if (query.includes("fee") && query.includes("registration")) {
    return MOCK_RESPONSES.fee_clarified;
  }

  // Clarified exam registration
  if (query.includes("exam") && query.includes("registration")) {
    return MOCK_RESPONSES.exam_clarified;
  }

  // Pure fee inquiries
  if (
    query.includes("fee") ||
    query.includes("fees") ||
    query.includes("tuition") ||
    query.includes("dues") ||
    query.includes("installment")
  ) {
    return MOCK_RESPONSES.fee_deadline;
  }

  // Attendance inquiries
  if (
    query.includes("attendance") ||
    query.includes("present") ||
    query.includes("absent") ||
    query.includes("bunk") ||
    query.includes("percentage")
  ) {
    return MOCK_RESPONSES.attendance_query;
  }

  // Gate pass / Leave inquiries
  if (
    query.includes("gate pass") ||
    query.includes("gatepass") ||
    query.includes("leave") ||
    query.includes("day pass") ||
    query.includes("outstation") ||
    query.includes("curfew")
  ) {
    return MOCK_RESPONSES.gate_pass_query;
  }

  // Timetable inquiries
  if (
    query.includes("timetable") ||
    query.includes("time table") ||
    query.includes("schedule") ||
    query.includes("class time") ||
    query.includes("lecture")
  ) {
    return MOCK_RESPONSES.timetable_query;
  }

  // Pure exam inquiries
  if (
    query.includes("exam") ||
    query.includes("mid-sem") ||
    query.includes("midsem") ||
    query.includes("admit card")
  ) {
    return MOCK_RESPONSES.exam_clarified;
  }

  // Pure IT inquiries
  if (
    query.includes("wifi") ||
    query.includes("wi-fi") ||
    query.includes("eduroam") ||
    query.includes("internet") ||
    query.includes("vpn") ||
    query.includes("password") ||
    query.includes("network")
  ) {
    return MOCK_RESPONSES.it_wifi_query;
  }

  // Pure Facilities inquiries
  if (
    query.includes("room") ||
    query.includes("library") ||
    query.includes("facility") ||
    query.includes("facilities") ||
    query.includes("cafeteria") ||
    query.includes("sports") ||
    query.includes("gym") ||
    query.includes("lab")
  ) {
    return MOCK_RESPONSES.facilities_room_query;
  }

  // Fallback / Out of scope
  return {
    ...MOCK_RESPONSES.out_of_scope_handoff,
    customQuery: userInput,
    mockTicketId: `OFD-TKT-${Math.floor(10000 + Math.random() * 90000)}`
  };
}

// Student Query History for LUNA AI Assistant
export const DEFAULT_QUERY_HISTORY = [
  {
    id: "hist-1",
    query: "What is my current semester attendance?",
    timestamp: "Today, 11:20 AM",
    timeGroup: "Today",
    domain: "examination"
  },
  {
    id: "hist-2",
    query: "When are the Semester 5 mid-semester exams?",
    timestamp: "Today, 09:45 AM",
    timeGroup: "Today",
    domain: "examination"
  },
  {
    id: "hist-3",
    query: "How can I apply for a hostel gate pass?",
    timestamp: "Yesterday, 06:15 PM",
    timeGroup: "Yesterday",
    domain: "facilities"
  },
  {
    id: "hist-4",
    query: "When is the semester tuition fee deadline?",
    timestamp: "Yesterday, 02:30 PM",
    timeGroup: "Yesterday",
    domain: "fees"
  },
  {
    id: "hist-5",
    query: "How do I configure campus eduroam Wi-Fi?",
    timestamp: "24 Sep 2026",
    timeGroup: "Previous 7 Days",
    domain: "it"
  },
  {
    id: "hist-6",
    query: "How can I book a discussion room in the Central Library?",
    timestamp: "23 Sep 2026",
    timeGroup: "Previous 7 Days",
    domain: "facilities"
  }
];

export function getStoredQueryHistory() {
  try {
    const raw = localStorage.getItem("ofd_student_query_history");
    if (raw) return JSON.parse(raw);
  } catch {
    // fallback
  }
  return DEFAULT_QUERY_HISTORY;
}

export function saveQueryToHistory(newQuery, domain = "general") {
  try {
    const current = getStoredQueryHistory();
    const newItem = {
      id: `hist-${Date.now()}`,
      query: newQuery,
      timestamp: "Just now",
      timeGroup: "Today",
      domain
    };
    const filtered = current.filter(item => item.query.toLowerCase() !== newQuery.toLowerCase());
    const updated = [newItem, ...filtered];
    localStorage.setItem("ofd_student_query_history", JSON.stringify(updated));
    window.dispatchEvent(new Event("ofd_history_updated"));
    return updated;
  } catch {
    return DEFAULT_QUERY_HISTORY;
  }
}

export function clearStoredQueryHistory() {
  try {
    localStorage.removeItem("ofd_student_query_history");
    window.dispatchEvent(new Event("ofd_history_updated"));
  } catch {
    // ignore
  }
}

// Initial default chat conversation seeding
export const INITIAL_CHAT_MESSAGES = [
  {
    id: "msg-system-welcome",
    sender: "assistant",
    timestamp: "Just now",
    type: "answer",
    domain: "general",
    domainLabel: "LUNA Orchestrator",
    confidence: 1.0,
    answer: "Welcome to **One Front Door**! I am **LUNA**, your unified academic and campus AI assistant.\n\nYou can ask any question without worrying about which department handles it — I automatically route across **Fees**, **Examination**, **IT Services**, and **Campus Facilities**.\n\nTry clicking one of the suggested prompts below or type your inquiry directly.",
    sources: [
      { title: "One Front Door Architecture Overview", section: "Cross-Domain Orchestration System", linkText: "System Architecture" }
    ],
    routingInfo: {
      domain: "Multi-Domain Core",
      confidence: "100%",
      semanticMatch: 1.0,
      keywordSignal: "System Initialized",
      domainMargin: 1.0,
      latency: "12ms",
      routedBy: "OFD System Greeting Dispatcher"
    }
  }
];

// Evaluation Dashboard Mock Metrics
export const EVALUATION_METRICS = {
  summary: {
    routingAccuracy: {
      value: "93.4%",
      trend: "+2.1%",
      description: "Correctly classified queries across all 4 benchmark domains"
    },
    clarificationAccuracy: {
      value: "89.2%",
      trend: "+3.4%",
      description: "Successfully detected ambiguous intent requiring disambiguation"
    },
    groundedAnswerRate: {
      value: "96.1%",
      trend: "+0.8%",
      description: "Responses fully backed by university policy handbooks"
    },
    endToEndResolution: {
      value: "91.5%",
      trend: "+1.9%",
      description: "Inquiries answered without secondary escalation"
    },
    wrongConfidentRoute: {
      value: "1.8%",
      trend: "-0.5%",
      description: "High-confidence classifications routed to incorrect department",
      isWarning: true
    }
  },

  domainBenchmarks: [
    { domain: "Fees & Finance", totalQueries: 412, accuracy: 94.6, avgConfidence: 0.92, avgLatency: "135ms" },
    { domain: "Examination & Evaluation", totalQueries: 489, accuracy: 93.1, avgConfidence: 0.91, avgLatency: "142ms" },
    { domain: "IT & Digital Services", totalQueries: 326, accuracy: 95.8, avgConfidence: 0.95, avgLatency: "128ms" },
    { domain: "Campus Facilities", totalQueries: 284, accuracy: 91.2, avgConfidence: 0.89, avgLatency: "151ms" },
    { domain: "Out-of-Scope (Handoff)", totalQueries: 145, accuracy: 88.3, avgConfidence: 0.87, avgLatency: "162ms" }
  ],

  // 4x4 Confusion Matrix (Actual vs Predicted %)
  confusionMatrix: {
    labels: ["Fees", "Examination", "IT", "Facilities", "Handoff"],
    matrix: [
      [94, 2, 1, 1, 2], // Actual Fees
      [2, 93, 2, 1, 2], // Actual Examination
      [1, 1, 96, 1, 1], // Actual IT
      [2, 2, 1, 91, 4], // Actual Facilities
      [3, 3, 2, 4, 88]  // Actual Handoff
    ]
  },

  latencyDistribution: [
    { range: "< 100ms", percentage: 38 },
    { range: "100 - 150ms", percentage: 46 },
    { range: "150 - 200ms", percentage: 12 },
    { range: "> 200ms", percentage: 4 }
  ]
};
