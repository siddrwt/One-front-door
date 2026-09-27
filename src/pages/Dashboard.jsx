// src/pages/Dashboard.jsx
import React, { useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import {
  CalendarCheck,
  Clock,
  DoorOpen,
  CheckCircle2,
  FileSpreadsheet,
  MessageSquare,
  Utensils,
  ChevronLeft,
  ChevronRight,
  Calendar,
  AlertCircle,
  TrendingUp,
  Sparkles,
  Download,
  BookOpen,
  Award,
  FileText
} from 'lucide-react';
import { STUDENT_PROFILE } from '../data/mockData';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '../components/ui/avatar';



export default function Dashboard() {
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const activeTab = searchParams.get('tab') || 'profile';

  // --- Timetable State ---
  const [currentDayIndex, setCurrentDayIndex] = useState(0); // 0: Monday
  const WEEK_DAYS = [
    { day: 'Monday', date: '22 Sep 2026' },
    { day: 'Tuesday', date: '23 Sep 2026' },
    { day: 'Wednesday', date: '24 Sep 2026' },
    { day: 'Thursday', date: '25 Sep 2026' },
    { day: 'Friday', date: '26 Sep 2026' },
    { day: 'Saturday', date: '27 Sep 2026' },
  ];

  // Distinct timetable classes matching format in Photo 1
  const TIMETABLE_DATA = {
    Monday: [
      {
        courseTitle: 'Network Defense & Countermeasures',
        courseCode: 'CYS301',
        room: '104-N-LH',
        timeRange: '09:30 AM - 10:30 AM (60 min)',
        faculty: 'Dr. Saurabh Verma',
        type: 'Lecture',
        attendanceRecorded: true
      },
      {
        courseTitle: 'Automata Theory and Computability',
        courseCode: 'CSET302',
        room: '102-N-LH',
        timeRange: '10:30 AM - 11:30 AM (60 min)',
        faculty: 'Dinesh Prasad Sahu',
        type: 'Lecture',
        attendanceRecorded: true
      },
      {
        courseTitle: 'Competitive Programming',
        courseCode: 'SCSE3045',
        room: 'P-CB-205',
        timeRange: '11:35 AM - 12:35 PM (60 min)',
        faculty: 'Shaharyar Alam Ansari',
        type: 'Lecture',
        attendanceRecorded: false
      },
      {
        courseTitle: 'Prompt Engineering',
        courseCode: 'SCSE4041',
        room: '101-N-LH',
        timeRange: '12:40 PM - 01:40 PM (60 min)',
        faculty: 'Saurabh R Srivastava',
        type: 'Lecture',
        attendanceRecorded: true
      },
      {
        courseTitle: 'MLOps',
        courseCode: 'SCSE3040',
        room: 'B-LA-301',
        timeRange: '02:50 PM - 03:50 PM (60 min)',
        faculty: 'Richa Sharma',
        type: 'Practical',
        attendanceRecorded: true
      },
      {
        courseTitle: 'MLOps',
        courseCode: 'SCSE3040',
        room: 'B-LA-301',
        timeRange: '03:55 PM - 04:55 PM (60 min)',
        faculty: 'Richa Sharma',
        type: 'Practical',
        attendanceRecorded: false
      }
    ],
    Tuesday: [
      {
        courseTitle: 'Cyber Forensics & Incident Analysis',
        courseCode: 'CYS304',
        room: '102-N-LH',
        timeRange: '09:30 AM - 10:30 AM (60 min)',
        faculty: 'Dr. Meenakshi Sundaram',
        type: 'Lecture',
        attendanceRecorded: true
      },
      {
        courseTitle: 'Applied Cryptography & PKI',
        courseCode: 'CYS302',
        room: 'P-CB-202',
        timeRange: '10:35 AM - 11:35 AM (60 min)',
        faculty: 'Prof. Alok Ranjan',
        type: 'Lecture',
        attendanceRecorded: true
      },
      {
        courseTitle: 'Cloud Security Architecture',
        courseCode: 'CSET318',
        room: '104-N-LH',
        timeRange: '11:45 AM - 12:45 PM (60 min)',
        faculty: 'Dr. Rajiv Gupta',
        type: 'Lecture',
        attendanceRecorded: false
      },
      {
        courseTitle: 'Network Security Laboratory',
        courseCode: 'CYS302',
        room: 'B-LA-304',
        timeRange: '02:00 PM - 04:00 PM (120 min)',
        faculty: 'Dr. Saurabh Verma',
        type: 'Practical',
        attendanceRecorded: true
      }
    ],
    Wednesday: [
      {
        courseTitle: 'Automata Theory and Computability',
        courseCode: 'CSET302',
        room: '102-N-LH',
        timeRange: '09:30 AM - 10:30 AM (60 min)',
        faculty: 'Dinesh Prasad Sahu',
        type: 'Lecture',
        attendanceRecorded: true
      },
      {
        courseTitle: 'Competitive Programming',
        courseCode: 'SCSE3045',
        room: 'P-CB-205',
        timeRange: '10:35 AM - 11:35 AM (60 min)',
        faculty: 'Shaharyar Alam Ansari',
        type: 'Lecture',
        attendanceRecorded: true
      },
      {
        courseTitle: 'Vulnerability Assessment & Penetration Testing',
        courseCode: 'CSET357',
        room: '101-N-LH',
        timeRange: '11:45 AM - 12:45 PM (60 min)',
        faculty: 'Dr. K. Radhakrishnan',
        type: 'Lecture',
        attendanceRecorded: false
      },
      {
        courseTitle: 'Cyber Security Research Seminar',
        courseCode: 'CSET312',
        room: 'SCSET-Auditorium',
        timeRange: '02:30 PM - 04:30 PM (120 min)',
        faculty: 'Dean SCSET & Faculty Mentors',
        type: 'Lecture',
        attendanceRecorded: true
      }
    ],
    Thursday: [
      {
        courseTitle: 'Prompt Engineering',
        courseCode: 'SCSE4041',
        room: '101-N-LH',
        timeRange: '09:30 AM - 10:30 AM (60 min)',
        faculty: 'Saurabh R Srivastava',
        type: 'Lecture',
        attendanceRecorded: true
      },
      {
        courseTitle: 'Cloud Security Architecture',
        courseCode: 'CSET318',
        room: '104-N-LH',
        timeRange: '10:35 AM - 11:35 AM (60 min)',
        faculty: 'Dr. Rajiv Gupta',
        type: 'Lecture',
        attendanceRecorded: true
      },
      {
        courseTitle: 'Vulnerability Assessment Lab',
        courseCode: 'CSET357',
        room: 'B-LA-302',
        timeRange: '02:00 PM - 04:00 PM (120 min)',
        faculty: 'Dr. K. Radhakrishnan',
        type: 'Practical',
        attendanceRecorded: true
      }
    ],
    Friday: [
      {
        courseTitle: 'Network Defense & Countermeasures',
        courseCode: 'CYS301',
        room: '104-N-LH',
        timeRange: '09:30 AM - 10:30 AM (60 min)',
        faculty: 'Dr. Saurabh Verma',
        type: 'Lecture',
        attendanceRecorded: true
      },
      {
        courseTitle: 'Applied Cryptography & PKI',
        courseCode: 'CYS302',
        room: 'P-CB-202',
        timeRange: '10:35 AM - 11:35 AM (60 min)',
        faculty: 'Prof. Alok Ranjan',
        type: 'Lecture',
        attendanceRecorded: true
      },
      {
        courseTitle: 'Capstone Project Mentoring Session',
        courseCode: 'SCSE3040',
        room: 'Faculty Cabin C-12',
        timeRange: '02:00 PM - 03:30 PM (90 min)',
        faculty: 'Dr. A. Sharma',
        type: 'Practical',
        attendanceRecorded: false
      }
    ],
    Saturday: [
      {
        courseTitle: 'Competitive Programming Contest Prep',
        courseCode: 'SCSE3045',
        room: 'B-LA-301',
        timeRange: '10:00 AM - 01:00 PM (180 min)',
        faculty: 'Coding Club & Faculty Leads',
        type: 'Practical',
        attendanceRecorded: true
      }
    ]
  };

  const currentDay = WEEK_DAYS[currentDayIndex];
  const currentClasses = TIMETABLE_DATA[currentDay.day] || [];

  const handlePrevDay = () => {
    setCurrentDayIndex((prev) => (prev === 0 ? WEEK_DAYS.length - 1 : prev - 1));
  };

  const handleNextDay = () => {
    setCurrentDayIndex((prev) => (prev === WEEK_DAYS.length - 1 ? 0 : prev + 1));
  };

  // --- Attendance State (Photo 3 & 4) ---
  const [attendanceSubTab, setAttendanceSubTab] = useState('subject'); // 'subject' | 'log' | 'summary'
  const [hoveredSubject, setHoveredSubject] = useState(null);

  // Subject-wise attendance items matching Photo 3
  const SUBJECT_ATTENDANCE = [
    { code: 'CSET302', name: 'Automata Theory and Computability', percentage: 82, attended: 28, total: 34 },
    { code: 'CSET312', name: 'Cyber Security Research Seminar', percentage: 83, attended: 25, total: 30 },
    { code: 'CSET318', name: 'Cloud Security Architecture', percentage: 100, attended: 32, total: 32 },
    { code: 'CSET357', name: 'Vulnerability Assessment & PenTesting', percentage: 81, attended: 26, total: 32 },
    { code: 'SCSE3040', name: 'MLOps', percentage: 100, attended: 24, total: 24 },
    { code: 'SCSE3045', name: 'Competitive Programming', percentage: 100, attended: 22, total: 22 },
    { code: 'SCSE4041', name: 'Prompt Engineering', percentage: 90, attended: 27, total: 30 },
  ];

  // --- Cafeteria State (Photo 2) ---
  const [cafeteriaDay, setCafeteriaDay] = useState('Today');

  // Distinct Indian mess dishes matching format in Photo 2
  const CAFETERIA_MEALS = [
    {
      time: 'Breakfast 07:30 AM - 09:30 AM',
      highlight: 'Breakfast(Today)-Stuffed Paneer Kulcha with Fresh Curd & Mango Pickle - (235 Kcal)',
      items: [
        'Fresh Papaya & Pineapple Cuts ( 95 Kcal )',
        'Corn Flakes with Warm/Cold Milk ( 310 Kcal )',
        'Brown Bread (260 Kcal) & White Bread (280 Kcal) with Mixed Fruit Jam',
        'Tea ( 35 Kcal ) / Filter Coffee ( 40 Kcal ) / Warm Haldi Milk ( 65 Kcal )'
      ]
    },
    {
      time: 'Lunch 12:00 PM - 03:00 PM',
      highlight: 'Lunch(Today)-Paneer Butter Masala Gravy ( 170 Kcal )',
      items: [
        'Dhaba Style Chana Masala ( 135 Kcal )',
        'Dal Tadka with Kashmiri Mirch Tempering ( 120 Kcal )',
        'Jeera Peas Basmati Rice ( 140 Kcal )',
        'Freshly Baked Tandoori Roti ( 240 Kcal )',
        'Cucumber, Beetroot & Carrot Salad ( 70 Kcal )',
        'Fresh Mint Jeera Chaas ( 85 Kcal )',
        'South Indian Vegetable Sambar ( 110 Kcal )'
      ]
    },
    {
      time: 'Snack 5:00 PM - 06:00 PM',
      highlight: 'Snack(Today)-Crispy Mix Vegetable Cutlet with Mint Dip - (175 Kcal)',
      items: [
        'Sweet Tamarind & Spicy Green Chutney ( 95 Kcal )',
        'Hot Ginger Cardamom Tea ( 35 Kcal )',
        'Chilled Aam Panna Cooler ( 60 Kcal )'
      ]
    },
    {
      time: 'Dinner 08:00 PM - 10:00 PM',
      highlight: 'Dinner(Today)-Kadhai Chaap Masala ( 165 Kcal )',
      items: [
        'Lauki Chana Dal Gravy ( 125 Kcal )',
        'Slow-Simmered Dal Makhani ( 210 Kcal )',
        'Steamed Jeera Pulao ( 180 Kcal )',
        'Butter Phulkas ( 240 Kcal )',
        'Hot Gulab Jamun Dessert ( 140 Kcal )'
      ]
    }
  ];

  return (
    <div className="space-y-6 max-w-6xl mx-auto">

      {/* 1. STUDENT PROFILE CARD (Only visible when activeTab is 'profile' / My Institution) */}
      {activeTab === 'profile' && (
        <>
          <Card className="bg-[#fff4ed] rounded-2xl sm:rounded-3xl border border-[#f3d5c2] p-6 sm:p-8 shadow-xs transition-all">
            {/* Top: Photo on the left, Name on the right (Ask AI button removed) */}
            <div className="flex items-center gap-5 sm:gap-6 pb-6 border-b border-[#efd4c4]">
              <div className="w-20 h-24 sm:w-24 sm:h-28 rounded-xl overflow-hidden border border-slate-300 shadow-2xs bg-white flex-shrink-0">
                <img
                  src={STUDENT_PROFILE.photoUrl || STUDENT_PROFILE.avatarUrl}
                  alt={STUDENT_PROFILE.name}
                  className="w-full h-full object-cover object-center"
                />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 tracking-tight">
                  {STUDENT_PROFILE.name}
                </h1>
              </div>
            </div>

            {/* Below photo: Formatted list with perfectly aligned colons */}
            <div className="pt-6 space-y-3.5 text-xs sm:text-[14px] text-slate-800">
              {/* Student Status */}
              <div className="grid grid-cols-12 items-center leading-normal">
                <span className="col-span-5 sm:col-span-3 text-slate-700 font-medium">Student Status</span>
                <span className="col-span-1 text-slate-700">:</span>
                <span className="col-span-6 sm:col-span-8">
                  <Badge variant="outline" className="bg-[#daf4e2] text-[#137333] border-emerald-300/60 px-3.5 py-0.5 rounded-full text-xs font-semibold">
                    {STUDENT_PROFILE.studentStatus}
                  </Badge>
                </span>
              </div>

              {/* Admission No. */}
              <div className="grid grid-cols-12 items-center leading-normal">
                <span className="col-span-5 sm:col-span-3 text-slate-700 font-medium">Admission No.</span>
                <span className="col-span-1 text-slate-700">:</span>
                <span className="col-span-6 sm:col-span-8 text-slate-900 font-semibold">
                  {STUDENT_PROFILE.admissionNo}
                </span>
              </div>

              {/* Admission Year */}
              <div className="grid grid-cols-12 items-center leading-normal">
                <span className="col-span-5 sm:col-span-3 text-slate-700 font-medium">Admission Year</span>
                <span className="col-span-1 text-slate-700">:</span>
                <span className="col-span-6 sm:col-span-8 text-slate-900 font-semibold">
                  {STUDENT_PROFILE.admissionYear}
                </span>
              </div>

              {/* Roll No. */}
              <div className="grid grid-cols-12 items-center leading-normal">
                <span className="col-span-5 sm:col-span-3 text-slate-700 font-medium">Roll No.</span>
                <span className="col-span-1 text-slate-700">:</span>
                <span className="col-span-6 sm:col-span-8 text-slate-900 font-bold text-blue-800">
                  {STUDENT_PROFILE.rollNo}
                </span>
              </div>

              {/* Degree */}
              <div className="grid grid-cols-12 items-center leading-normal">
                <span className="col-span-5 sm:col-span-3 text-slate-700 font-medium">Degree</span>
                <span className="col-span-1 text-slate-700">:</span>
                <span className="col-span-6 sm:col-span-8 text-slate-900 font-semibold">
                  {STUDENT_PROFILE.degree}
                </span>
              </div>

              {/* Department */}
              <div className="grid grid-cols-12 items-start leading-normal">
                <span className="col-span-5 sm:col-span-3 text-slate-700 font-medium pt-0.5">Department</span>
                <span className="col-span-1 text-slate-700 pt-0.5">:</span>
                <span className="col-span-6 sm:col-span-8 text-slate-900 font-semibold leading-relaxed">
                  {STUDENT_PROFILE.department}
                </span>
              </div>

              {/* Semester */}
              <div className="grid grid-cols-12 items-center leading-normal">
                <span className="col-span-5 sm:col-span-3 text-slate-700 font-medium">Semester</span>
                <span className="col-span-1 text-slate-700">:</span>
                <span className="col-span-6 sm:col-span-8 text-slate-900 font-semibold">
                  {STUDENT_PROFILE.semester}
                </span>
              </div>

              {/* Course Name */}
              <div className="grid grid-cols-12 items-start leading-normal">
                <span className="col-span-5 sm:col-span-3 text-slate-700 font-medium pt-0.5">Course Name</span>
                <span className="col-span-1 text-slate-700 pt-0.5">:</span>
                <span className="col-span-6 sm:col-span-8 text-slate-900 font-semibold leading-relaxed">
                  {STUDENT_PROFILE.courseName}
                </span>
              </div>

              {/* College */}
              <div className="grid grid-cols-12 items-start leading-normal">
                <span className="col-span-5 sm:col-span-3 text-slate-700 font-medium pt-0.5">College</span>
                <span className="col-span-1 text-slate-700 pt-0.5">:</span>
                <span className="col-span-6 sm:col-span-8 text-slate-900 font-semibold leading-relaxed">
                  {STUDENT_PROFILE.college}
                </span>
              </div>
            </div>
          </Card>

          {/* COMPACT HORIZONTAL QUICK ACTION CHIPS STRIP */}
          <div className="mt-3.5 p-3.5 sm:p-4 rounded-2xl bg-[#fff0e5] border border-[#f3d0b8] shadow-2xs space-y-3">
            {/* Row 1: Action Chips */}
            <div className="flex flex-wrap items-center gap-2">
              {[
                { icon: '📊', label: 'My Attendance', query: 'What is my current semester attendance?' },
                { icon: '🗓', label: 'Timetable', query: 'What is my timetable for Semester 5?' },
                { icon: '💳', label: 'Fee Status', query: 'What is my fee payment status?' },
                { icon: '📄', label: 'Gate Pass', query: 'Show my hostel gate pass status' },
                { icon: '📚', label: 'Exam Schedule', query: 'What is my mid-term exam schedule?' },
              ].map((chip, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => navigate('/chat', { state: { initialPrompt: chip.query } })}
                  className="flex items-center gap-1.5 px-3 py-1.5 sm:py-2 rounded-xl bg-white hover:bg-blue-50 text-slate-800 hover:text-blue-900 border border-slate-200/90 hover:border-blue-300 font-semibold text-xs transition-all shadow-2xs cursor-pointer active:scale-95"
                >
                  <span className="text-sm">{chip.icon}</span>
                  <span>{chip.label}</span>
                </button>
              ))}
            </div>

            {/* Row 2: Open LUNA Assistant Button below */}
            <div className="pt-2 border-t border-[#edc8af]/80 flex items-center justify-end">
              <button
                type="button"
                onClick={() => navigate('/chat')}
                className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm transition-all shadow-2xs cursor-pointer active:scale-95 w-full sm:w-auto"
              >
                <Sparkles className="w-4 h-4 text-white" />
                <span>Open LUNA </span>
              </button>
            </div>
          </div>
        </>
      )}

      {/* 2. TIMETABLE VIEW (Matches User's Photo 1 + Day Arrows Navigation) */}
      {activeTab === 'timetable' && (
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden animate-in fade-in duration-200">

          {/* Day Navigator Bar with Arrows (< and >) */}
          <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <div className="flex items-center gap-2 sm:gap-3">
              <button
                type="button"
                onClick={handlePrevDay}
                className="w-8 h-8 rounded-full border border-slate-300 bg-white hover:bg-slate-100 flex items-center justify-center text-slate-700 transition-colors shadow-2xs cursor-pointer"
                title="Previous Day"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-2">
                <span className="text-base sm:text-lg font-bold text-slate-900">
                  {currentDay.day}
                </span>
                <span className="text-xs text-slate-400 font-normal">
                  ({currentDay.date})
                </span>
              </div>

              <button
                type="button"
                onClick={handleNextDay}
                className="w-8 h-8 rounded-full border border-slate-300 bg-white hover:bg-slate-100 flex items-center justify-center text-slate-700 transition-colors shadow-2xs cursor-pointer"
                title="Next Day"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Quick Day Selector Pills */}
            <div className="hidden sm:flex items-center gap-1">
              {WEEK_DAYS.map((d, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setCurrentDayIndex(idx)}
                  className={`px-2.5 py-1 text-xs rounded-md font-medium transition-colors ${currentDayIndex === idx
                    ? 'bg-blue-600 text-white font-semibold shadow-2xs'
                    : 'text-slate-600 hover:bg-slate-200'
                    }`}
                >
                  {d.day.slice(0, 3)}
                </button>
              ))}
            </div>
          </div>

          {/* Class List formatted identically to Photo 1 */}
          <div className="p-4 sm:p-6 divide-y divide-slate-100">
            {currentClasses.length > 0 ? (
              currentClasses.map((cls, idx) => (
                <div key={idx} className="py-4 first:pt-1 last:pb-1 space-y-1">
                  {/* Line 1: Course Title ( Code ) ( Room ) */}
                  <div className="font-semibold text-slate-900 text-[14.5px] leading-snug">
                    {cls.courseTitle} ( {cls.courseCode} ) ( {cls.room} )
                  </div>

                  {/* Line 2: Time Range ( Duration ) Faculty */}
                  <div className="text-slate-600 text-xs sm:text-[13px]">
                    {cls.timeRange} {cls.faculty}
                  </div>

                  {/* Line 3: Room identifier */}
                  <div className="text-slate-500 text-xs sm:text-[13px]">
                    {cls.room}
                  </div>

                  {/* Optional: Attendance recorded badge */}
                  {cls.attendanceRecorded && (
                    <div className="pt-0.5">
                      <span className="inline-block bg-[#def3e4] text-[#137333] text-[11px] font-medium px-2.5 py-0.5 rounded-full">
                        Attendance recorded
                      </span>
                    </div>
                  )}

                  {/* Line 4: Session Type (Lecture / Practical) */}
                  <div className="text-slate-600 text-xs sm:text-[13px] pt-0.5">
                    {cls.type}
                  </div>
                </div>
              ))
            ) : (
              <div className="py-8 text-center text-slate-400 text-xs">
                No classes scheduled for {currentDay.day}.
              </div>
            )}
          </div>
        </div>
      )}

      {/* 3. ATTENDANCE VIEW (Matches User's Photo 3 & 4) */}
      {activeTab === 'attendance' && (
        <div className="pt-6 sm:pt-10 lg:pt-14 pb-8 flex flex-col justify-center animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden max-w-4xl w-full mx-auto">

            {/* Sub-nav Tabs: Subject-wise | Log | Summary (Matches Photo 3 & 4 Header) */}
            <div className="px-6 pt-5 border-b border-slate-200 flex items-center gap-7 bg-white">
              <button
                type="button"
                onClick={() => setAttendanceSubTab('subject')}
                className={`pb-3 text-sm font-semibold transition-all relative cursor-pointer ${attendanceSubTab === 'subject'
                  ? 'text-slate-900 font-bold border-b-2 border-blue-600'
                  : 'text-slate-500 hover:text-slate-800'
                  }`}
              >
                Subject-wise
              </button>

              <button
                type="button"
                onClick={() => setAttendanceSubTab('log')}
                className={`pb-3 text-sm font-medium transition-all relative cursor-pointer ${attendanceSubTab === 'log'
                  ? 'text-slate-900 font-bold border-b-2 border-blue-600'
                  : 'text-slate-500 hover:text-slate-800'
                  }`}
              >
                Log
              </button>

              <button
                type="button"
                onClick={() => setAttendanceSubTab('summary')}
                className={`pb-3 text-sm font-medium transition-all relative cursor-pointer ${attendanceSubTab === 'summary'
                  ? 'text-slate-900 font-bold border-b-2 border-blue-600'
                  : 'text-slate-500 hover:text-slate-800'
                  }`}
              >
                Summary
              </button>
            </div>

            {/* Sub-View A: Subject-wise Horizontal Bar Chart (Matches Photo 3 + Interactive Hover Tooltips) */}
            {attendanceSubTab === 'subject' && (
              <div className="p-6 sm:p-9">
                <div className="space-y-4">
                  {SUBJECT_ATTENDANCE.map((sub, idx) => {
                    const isHovered = hoveredSubject === sub.code;

                    return (
                      <div
                        key={idx}
                        className="group relative flex items-center gap-3 sm:gap-4 text-xs cursor-pointer py-1"
                        onMouseEnter={() => setHoveredSubject(sub.code)}
                        onMouseLeave={() => setHoveredSubject(null)}
                      >
                        {/* Course Code on Y-axis */}
                        <span className={`w-20 sm:w-24 text-right font-medium transition-colors flex-shrink-0 ${isHovered ? 'text-blue-700 font-bold' : 'text-slate-600'
                          }`}>
                          {sub.code}
                        </span>

                        {/* Horizontal Bar Container */}
                        <div className="flex-1 bg-slate-100 rounded-sm h-6 sm:h-7 relative overflow-visible flex items-center">
                          <div
                            style={{ width: `${sub.percentage}%` }}
                            className={`h-full rounded-r-xs transition-all duration-300 relative flex items-center justify-end pr-2.5 ${isHovered ? 'bg-[#16a34a] shadow-sm brightness-105' : 'bg-[#22c55e]'
                              }`}
                          >
                            {/* Always visible or hover illuminated percentage label inside/at tip of bar */}
                            <span className="text-[11px] font-bold text-white tracking-tight">
                              {sub.percentage}%
                            </span>
                          </div>

                          {/* Floating Interactive Hover Tooltip */}
                          {isHovered && (
                            <div className="absolute left-1/2 -top-11 -translate-x-1/2 bg-slate-900 text-white text-[12px] px-3.5 py-1.5 rounded-lg shadow-xl z-30 flex items-center gap-2 whitespace-nowrap animate-in fade-in zoom-in-95 pointer-events-none border border-slate-700">
                              <span className="font-bold text-emerald-400">{sub.percentage}% Attendance</span>
                              <span className="text-slate-400">•</span>
                              <span className="text-slate-200">{sub.attended}/{sub.total} Classes Attended</span>
                              <span className="text-slate-400">({sub.name})</span>
                              <div className="absolute top-full left-1/2 -translate-x-1/2 w-2 h-2 bg-slate-900 rotate-45 border-r border-b border-slate-700"></div>
                            </div>
                          )}
                        </div>

                        {/* Right-Side Hover Percentage Badge */}
                        <span className={`w-14 text-left font-bold text-xs transition-all flex-shrink-0 ${isHovered
                          ? 'text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-full scale-105'
                          : 'text-slate-400 opacity-80'
                          }`}>
                          {sub.percentage}%
                        </span>
                      </div>
                    );
                  })}

                  {/* X-axis tick scale: 0 to 100 */}
                  <div className="flex items-center gap-3 sm:gap-4 pt-3 border-t border-slate-200 text-[11px] text-slate-500">
                    <span className="w-20 sm:w-24 flex-shrink-0"></span>
                    <div className="flex-1 flex justify-between px-0.5 font-medium text-slate-400">
                      <span>0</span>
                      <span>10</span>
                      <span>20</span>
                      <span>30</span>
                      <span>40</span>
                      <span>50</span>
                      <span>60</span>
                      <span>70</span>
                      <span>80</span>
                      <span>90</span>
                      <span>100</span>
                    </div>
                    <span className="w-14 flex-shrink-0"></span>
                  </div>
                </div>
              </div>
            )}

            {/* Sub-View B: Summary Donut Charts (Matches Photo 4) */}
            {attendanceSubTab === 'summary' && (
              <div className="p-6 sm:p-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-12 items-center">

                  {/* Left Donut Gauge: Current Semester Month */}
                  <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
                    <div className="relative w-36 h-36 mb-4">
                      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                        {/* Background circle */}
                        <circle
                          cx="50"
                          cy="50"
                          r="38"
                          stroke="#eadfd8"
                          strokeWidth="12"
                          fill="transparent"
                        />
                        {/* Active Arc (94%) */}
                        <circle
                          cx="50"
                          cy="50"
                          r="38"
                          stroke="#ed8749"
                          strokeWidth="12"
                          strokeDasharray={`${2 * Math.PI * 38 * 0.94} ${2 * Math.PI * 38 * (1 - 0.94)}`}
                          strokeLinecap="round"
                          fill="transparent"
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-xl sm:text-2xl font-bold text-sky-500">94%</span>
                      </div>
                    </div>

                    <div className="space-y-1 text-xs sm:text-[13px] text-slate-700">
                      <div>Current semester attendance: <strong className="text-slate-900">94%</strong></div>
                      <div>No. of periods present: <strong className="text-slate-900">64/68</strong></div>
                      <div>Current month : <strong className="text-slate-900">Sep-2026</strong></div>
                    </div>
                  </div>

                  {/* Right Donut Gauge: Overall Percentage */}
                  <div className="flex flex-col sm:flex-row items-center sm:items-center gap-6">
                    <div className="relative w-36 h-36 flex-shrink-0">
                      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                        {/* Background circle */}
                        <circle
                          cx="50"
                          cy="50"
                          r="38"
                          stroke="#d8c9c0"
                          strokeWidth="12"
                          fill="transparent"
                        />
                        {/* Active Arc (88%) */}
                        <circle
                          cx="50"
                          cy="50"
                          r="38"
                          stroke="#ed8749"
                          strokeWidth="12"
                          strokeDasharray={`${2 * Math.PI * 38 * 0.88} ${2 * Math.PI * 38 * (1 - 0.88)}`}
                          strokeLinecap="round"
                          fill="transparent"
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-xl sm:text-2xl font-bold text-sky-500">88%</span>
                      </div>
                    </div>

                    <div className="space-y-1.5 text-xs sm:text-[13px] text-slate-700">
                      <div>Overall percentage: <strong className="text-slate-900">88%</strong></div>
                      <div>No. of periods present : <strong className="text-slate-900">97/110</strong></div>
                      <div className="text-[11px] text-emerald-600 font-semibold pt-1">
                        ✅ Minimum 75% attendance criteria satisfied
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            )}

            {/* Sub-View C: Detailed Attendance Log */}
            {attendanceSubTab === 'log' && (
              <div className="p-6 overflow-x-auto">
                <table className="w-full text-xs text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-100 text-slate-700">
                      <th className="p-2.5 border border-slate-200">Date</th>
                      <th className="p-2.5 border border-slate-200">Course Code</th>
                      <th className="p-2.5 border border-slate-200">Session</th>
                      <th className="p-2.5 border border-slate-200">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="p-2.5 border border-slate-200">22 Sep 2026</td>
                      <td className="p-2.5 border border-slate-200">CSET302</td>
                      <td className="p-2.5 border border-slate-200">10:30 AM - 11:30 AM</td>
                      <td className="p-2.5 border border-slate-200 text-emerald-600 font-semibold">Present</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 border border-slate-200">22 Sep 2026</td>
                      <td className="p-2.5 border border-slate-200">SCSE4041</td>
                      <td className="p-2.5 border border-slate-200">12:40 PM - 01:40 PM</td>
                      <td className="p-2.5 border border-slate-200 text-emerald-600 font-semibold">Present</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 border border-slate-200">21 Sep 2026</td>
                      <td className="p-2.5 border border-slate-200">CYS301</td>
                      <td className="p-2.5 border border-slate-200">09:30 AM - 10:30 AM</td>
                      <td className="p-2.5 border border-slate-200 text-emerald-600 font-semibold">Present</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}

          </div>
        </div>
      )}

      {/* 4. CAFETERIA VIEW (Redesigned Dining & Mess Menu UI) */}
      {activeTab === 'cafeteria' && (
        <div className="space-y-6 animate-in fade-in duration-200">

          {/* Header Card */}
          <Card className="bg-gradient-to-r from-[#46291e] via-slate-900 to-indigo-950 text-white border-slate-800 shadow-sm overflow-hidden">
            <CardContent className="p-6 sm:p-7 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2.5 mb-2">
                  <Badge variant="outline" className="bg-rose-500/20 text-rose-300 border-rose-400/30 gap-1.5 px-2.5 py-1 text-xs font-semibold">
                    <Utensils className="w-3.5 h-3.5" />
                    <span>Central Dining & Mess Hall</span>
                  </Badge>
                  <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/40 text-[11px]">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-1.5 animate-pulse inline-block"></span>
                    Mess Open
                  </Badge>
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
                  Campus Dining & Mess Menu
                </h1>
                <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
                  Daily nutritional menu curated by executive chefs • 100% Pure Vegetarian & Hygiene Certified
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="secondary" className="bg-white/10 text-white border-white/20 px-3 py-1.5 text-xs font-semibold">
                  Prepaid Card: <span className="text-emerald-400 font-bold ml-1">₹1,850</span>
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Meals Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {CAFETERIA_MEALS.map((meal, idx) => {
              const mealThemes = [
                { name: 'Breakfast', iconColor: 'text-amber-600 bg-amber-50 border-amber-200', border: 'border-amber-200/80', badge: 'bg-amber-100 text-amber-800' },
                { name: 'Lunch', iconColor: 'text-emerald-600 bg-emerald-50 border-emerald-200', border: 'border-emerald-200/80', badge: 'bg-emerald-100 text-emerald-800' },
                { name: 'Snack', iconColor: 'text-rose-600 bg-rose-50 border-rose-200', border: 'border-rose-200/80', badge: 'bg-rose-100 text-rose-800' },
                { name: 'Dinner', iconColor: 'text-indigo-600 bg-indigo-50 border-indigo-200', border: 'border-indigo-200/80', badge: 'bg-indigo-100 text-indigo-800' }
              ];
              const theme = mealThemes[idx % mealThemes.length];

              // Extract title and calorie from highlight dish
              const highlightText = meal.highlight.replace(/Breakfast\(Today\)-|Lunch\(Today\)-|Snack\(Today\)-|Dinner\(Today\)-/g, '');
              const kcalMatch = highlightText.match(/\(([^)]+)\)/);
              const highlightKcal = kcalMatch ? kcalMatch[1] : '';
              const highlightDishName = highlightText.replace(/\([^)]+\)/, '').replace(/-/g, '').trim();

              return (
                <Card key={idx} className={`border ${theme.border} shadow-2xs hover:shadow-xs transition-all overflow-hidden flex flex-col justify-between`}>
                  <div>
                    {/* Meal Header */}
                    <CardHeader className="pb-3 border-b border-slate-100 bg-slate-50/60 flex flex-row items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-xl border ${theme.iconColor}`}>
                          <Utensils className="w-4 h-4" />
                        </div>
                        <div>
                          <CardTitle className="text-base font-bold text-slate-900">
                            {meal.time.split(' ')[0]}
                          </CardTitle>
                          <CardDescription className="text-xs text-slate-500 font-mono">
                            {meal.time.replace(/^[A-Za-z]+\s*/, '')}
                          </CardDescription>
                        </div>
                      </div>
                      <Badge className={`${theme.badge} text-[11px] font-bold`}>
                        {idx === 0 ? '07:30 - 09:30 AM' : idx === 1 ? '12:00 - 03:00 PM' : idx === 2 ? '05:00 - 06:00 PM' : '08:00 - 10:00 PM'}
                      </Badge>
                    </CardHeader>

                    <CardContent className="pt-4 space-y-4">
                      {/* Chef Special Highlight Box */}
                      <div className="bg-gradient-to-r from-amber-500/10 via-rose-500/10 to-transparent p-3.5 rounded-xl border border-amber-200/70 space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-800 bg-amber-100 px-2 py-0.5 rounded-md flex items-center gap-1">
                            ⭐ Chef's Special
                          </span>
                          {highlightKcal && (
                            <Badge variant="outline" className="bg-white border-amber-300 text-amber-900 font-mono font-bold text-[11px]">
                              {highlightKcal}
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs sm:text-sm font-bold text-slate-900 leading-snug">
                          {highlightDishName}
                        </p>
                      </div>

                      {/* Itemized Menu List */}
                      <div className="space-y-2 text-xs">
                        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                          Menu Selection
                        </span>
                        <div className="space-y-1.5">
                          {meal.items.map((itemStr, iIdx) => {
                            // Extract Kcal if present
                            const itemKcalMatch = itemStr.match(/\(([^)]+)\)/);
                            const itemKcal = itemKcalMatch ? itemKcalMatch[1] : '';
                            const itemName = itemStr.replace(/\([^)]+\)/, '').trim();

                            return (
                              <div key={iIdx} className="flex items-center justify-between p-2 rounded-lg bg-slate-50/80 hover:bg-slate-100/80 transition-colors">
                                <div className="flex items-center gap-2">
                                  <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
                                  <span className="font-medium text-slate-800">{itemName}</span>
                                </div>
                                {itemKcal && (
                                  <Badge variant="secondary" className="text-[10px] font-mono text-slate-600 bg-white border border-slate-200 px-1.5 py-0">
                                    {itemKcal}
                                  </Badge>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </CardContent>
                  </div>

                  <div className="p-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                    <span className="flex items-center gap-1 text-emerald-700 font-semibold">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Veg Certified
                    </span>
                    <span>Fresh Hot Servings</span>
                  </div>
                </Card>
              );
            })}
          </div>

        </div>
      )}

      {/* 5. EXAM SCHEDULES VIEW */}
      {activeTab === 'exams' && (
        <div className="bg-white rounded-2xl border border-blue-200 p-6 sm:p-8 shadow-xs animate-in fade-in duration-200">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
            <div>
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <FileSpreadsheet className="w-5 h-5 text-blue-600" />
                Mid-Semester Examination Schedules (Spring 2026)
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">Office of Controller of Examinations (CoE)</p>
            </div>
            <span className="bg-emerald-100 text-emerald-800 text-xs font-semibold px-3 py-1 rounded-full">
              Hall Ticket Issued
            </span>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex justify-between items-center">
              <div>
                <span className="font-bold text-slate-800 text-sm">CYS301: Cyber Forensics & Incident Response</span>
                <span className="text-slate-500 block mt-0.5">Exam Hall: SCSET Auditorium • Duration: 2 Hours (10:00 AM - 12:00 PM)</span>
              </div>
              <span className="bg-blue-100 text-blue-800 font-semibold px-3 py-1.5 rounded-lg text-xs">March 23, 2026</span>
            </div>
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex justify-between items-center">
              <div>
                <span className="font-bold text-slate-800 text-sm">CYS302: Network Security & Cryptography</span>
                <span className="text-slate-500 block mt-0.5">Exam Hall: LH-204 • Duration: 2 Hours (10:00 AM - 12:00 PM)</span>
              </div>
              <span className="bg-blue-100 text-blue-800 font-semibold px-3 py-1.5 rounded-lg text-xs">March 25, 2026</span>
            </div>
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex justify-between items-center">
              <div>
                <span className="font-bold text-slate-800 text-sm">CYS303: Cloud Security Architecture</span>
                <span className="text-slate-500 block mt-0.5">Exam Hall: LH-101 • Duration: 2 Hours (10:00 AM - 12:00 PM)</span>
              </div>
              <span className="bg-blue-100 text-blue-800 font-semibold px-3 py-1.5 rounded-lg text-xs">March 27, 2026</span>
            </div>
          </div>
        </div>
      )}

      {/* 6. LEAVE AND GATE PASS VIEW */}
      {activeTab === 'gatepass' && (
        <div className="bg-white rounded-2xl border border-blue-200 p-6 sm:p-8 shadow-xs animate-in fade-in duration-200">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
            <div>
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <DoorOpen className="w-5 h-5 text-blue-600" />
                Leave and Gate Pass Portal
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">Hostel Gate Pass & Outstation Approvals</p>
            </div>
            <button
              type="button"
              className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-4 py-2 rounded-xl transition-all shadow-xs"
            >
              + Apply New Gate Pass
            </button>
          </div>

          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-center justify-between mb-4">
            <div>
              <div className="text-xs font-bold text-emerald-900 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Active Day Pass Approved
              </div>
              <p className="text-xs text-emerald-800 mt-0.5">
                Valid for Campus Main Gate 1 exit today until 09:30 PM curfew. Parent OTP verified.
              </p>
            </div>
            <span className="font-mono text-xs bg-white text-slate-800 px-3 py-1 rounded-lg border border-emerald-200 font-bold">
              GP-2026-09412
            </span>
          </div>
        </div>
      )}

      {/* 7. MESSAGES VIEW */}
      {activeTab === 'messages' && (
        <div className="bg-white rounded-2xl border border-blue-200 p-6 sm:p-8 shadow-xs animate-in fade-in duration-200">
          <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-blue-600" />
            University Messages & Notifications
          </h2>
          <div className="space-y-3 text-xs">
            <div className="p-4 bg-blue-50/60 rounded-xl border border-blue-200">
              <div className="flex justify-between font-bold text-slate-900 mb-1">
                <span>Dean's Office (SCSET) - Minor Project Title Submission</span>
                <span className="text-slate-400 font-normal">Today, 09:15 AM</span>
              </div>
              <p className="text-slate-600 leading-relaxed">
                All 5th semester Cyber Security students must submit their capstone project proposals to their assigned faculty mentor by this Friday.
              </p>
            </div>
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
              <div className="flex justify-between font-bold text-slate-900 mb-1">
                <span>Finance Office - Semester 5 Fee Clearance Receipt</span>
                <span className="text-slate-400 font-normal">Yesterday</span>
              </div>
              <p className="text-slate-600 leading-relaxed">
                Your tuition and hostel fee payment has been verified. No pending dues remain on your student account.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 8. REPORTS VIEW */}
      {activeTab === 'reports' && (
        <div className="bg-white rounded-2xl border border-blue-200 p-6 sm:p-8 shadow-xs animate-in fade-in duration-200">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
            <div>
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                Academic Grade Reports & Transcripts
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">B.Tech Computer Science (Cyber Security)</p>
            </div>
            <div className="text-right">
              <span className="text-3xl font-extrabold text-blue-700">8.72</span>
              <span className="text-xs text-slate-400 block font-medium">Cumulative CGPA</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs mb-6">
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
              <span className="text-slate-400 block">Total Credits Earned</span>
              <span className="text-lg font-bold text-slate-800">104 / 160</span>
            </div>
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
              <span className="text-slate-400 block">Latest SGPA (Sem 4)</span>
              <span className="text-lg font-bold text-emerald-600">8.85</span>
            </div>
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
              <span className="text-slate-400 block">Backlogs / Arrears</span>
              <span className="text-lg font-bold text-emerald-600">0 (Nil)</span>
            </div>
          </div>
        </div>
      )}

      {/* 9. PROGRESS REPORT VIEW */}
      {activeTab === 'progress' && (
        <div className="bg-white rounded-2xl border border-blue-200 p-6 sm:p-8 shadow-xs animate-in fade-in duration-200">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
            <div>
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                Semester-by-Semester Progression
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">Performance tracking across semesters • SCSET</p>
            </div>
            <span className="bg-emerald-100 text-emerald-800 text-xs font-semibold px-3 py-1 rounded-full">
              On Track for Graduation (2028)
            </span>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex justify-between items-center">
              <div>
                <span className="font-bold text-slate-800 text-sm">Semester 1 (Fall 2024)</span>
                <span className="text-slate-500 block">26 Credits Completed • Core Foundation</span>
              </div>
              <span className="font-bold text-slate-800 text-sm bg-white px-3 py-1 rounded-lg border border-slate-200">SGPA: 8.40</span>
            </div>
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex justify-between items-center">
              <div>
                <span className="font-bold text-slate-800 text-sm">Semester 2 (Spring 2025)</span>
                <span className="text-slate-500 block">26 Credits Completed • Data Structures & OOP</span>
              </div>
              <span className="font-bold text-slate-800 text-sm bg-white px-3 py-1 rounded-lg border border-slate-200">SGPA: 8.65</span>
            </div>
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex justify-between items-center">
              <div>
                <span className="font-bold text-slate-800 text-sm">Semester 3 (Fall 2025)</span>
                <span className="text-slate-500 block">26 Credits Completed • OS, DBMS & Computer Networks</span>
              </div>
              <span className="font-bold text-slate-800 text-sm bg-white px-3 py-1 rounded-lg border border-slate-200">SGPA: 8.90</span>
            </div>
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex justify-between items-center">
              <div>
                <span className="font-bold text-slate-800 text-sm">Semester 4 (Spring 2026)</span>
                <span className="text-slate-500 block">26 Credits Completed • Information Security & AI</span>
              </div>
              <span className="font-bold text-slate-800 text-sm bg-white px-3 py-1 rounded-lg border border-slate-200">SGPA: 8.85</span>
            </div>
            <div className="p-3.5 bg-blue-50/70 rounded-xl border border-blue-200 flex justify-between items-center">
              <div>
                <span className="font-bold text-blue-900 text-sm">Semester 5 (Fall 2026 - Current)</span>
                <span className="text-blue-700 block">24 Credits Enrolled • Cyber Security Specialization</span>
              </div>
              <span className="font-bold text-blue-700 text-xs bg-blue-100 px-3 py-1 rounded-full">In Progress</span>
            </div>
          </div>
        </div>
      )}

      {/* 10. HOLIDAYS VIEW */}
      {activeTab === 'holidays' && (
        <div className="bg-white rounded-2xl border border-blue-200 p-6 sm:p-8 shadow-xs animate-in fade-in duration-200">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
            <div>
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                Official University Holiday Calendar (2026 - 2027)
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">Approved by University Academic Council</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex justify-between items-center">
              <div>
                <span className="font-bold text-slate-800 text-sm">Gandhi Jayanti</span>
                <span className="text-slate-500 block">National Holiday</span>
              </div>
              <span className="bg-blue-100 text-blue-800 font-semibold px-2.5 py-1 rounded-lg">02 Oct 2026</span>
            </div>
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex justify-between items-center">
              <div>
                <span className="font-bold text-slate-800 text-sm">Diwali & Dussehra Vacation</span>
                <span className="text-slate-500 block">Mid-Semester Autumn Break</span>
              </div>
              <span className="bg-blue-100 text-blue-800 font-semibold px-2.5 py-1 rounded-lg">20 - 25 Oct 2026</span>
            </div>
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex justify-between items-center">
              <div>
                <span className="font-bold text-slate-800 text-sm">Guru Nanak Jayanti</span>
                <span className="text-slate-500 block">Gazetted Holiday</span>
              </div>
              <span className="bg-blue-100 text-blue-800 font-semibold px-2.5 py-1 rounded-lg">15 Nov 2026</span>
            </div>
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex justify-between items-center">
              <div>
                <span className="font-bold text-slate-800 text-sm">Winter Vacation</span>
                <span className="text-slate-500 block">End-Semester Break</span>
              </div>
              <span className="bg-blue-100 text-blue-800 font-semibold px-2.5 py-1 rounded-lg">25 Dec - 02 Jan</span>
            </div>
          </div>
        </div>
      )}

      {/* 11. SERVICES VIEW */}
      {activeTab === 'services' && (
        <div className="bg-white rounded-2xl border border-blue-200 p-6 sm:p-8 shadow-xs animate-in fade-in duration-200">
          <h2 className="text-xl font-bold text-slate-900 mb-2">
            Campus IT & Facility Services
          </h2>
          <p className="text-xs text-slate-500 mb-6">Online service requests, library room booking & IT network credentials</p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
              <span className="font-bold text-slate-800 text-sm block mb-1">Campus Wi-Fi & eduroam</span>
              <p className="text-slate-600 mb-3">Single-sign-on credentials active. MAC registration for laptop & phone verified.</p>
              <span className="inline-block text-[11px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-semibold">Active & Connected</span>
            </div>
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
              <span className="font-bold text-slate-800 text-sm block mb-1">Central Library Discussion Room</span>
              <p className="text-slate-600 mb-3">Book 2-hour collaborative slots on Floor 2 & 3 with interactive digital displays.</p>
              <span className="inline-block text-[11px] bg-blue-100 text-blue-800 px-2 py-0.5 rounded font-semibold">Self-Service Active</span>
            </div>
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
              <span className="font-bold text-slate-800 text-sm block mb-1">Hostel Maintenance Helpdesk</span>
              <p className="text-slate-600 mb-3">Lodge maintenance requests for room electrical, AC, carpentry, or plumbing.</p>
              <span className="inline-block text-[11px] bg-slate-200 text-slate-700 px-2 py-0.5 rounded font-semibold">24x7 Helpdesk</span>
            </div>
          </div>
        </div>
      )}

      {/* 12. ENROLLMENT VIEW */}
      {activeTab === 'enrollment' && (
        <div className="bg-white rounded-2xl border border-blue-200 p-6 sm:p-8 shadow-xs animate-in fade-in duration-200">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
            <div>
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                Course Enrollment & Curriculum Registration
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">Semester 5 • B.Tech Computer Science & Engineering (Cyber Security)</p>
            </div>
            <span className="bg-emerald-100 text-emerald-800 text-xs font-semibold px-3 py-1 rounded-full">
              Registration Verified (24 Credits)
            </span>
          </div>

          <div className="space-y-2 text-xs">
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex justify-between">
              <span className="font-medium text-slate-800">CYS301: Network Defense & Countermeasures (Core)</span>
              <span className="text-slate-600 font-bold">4 Credits</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex justify-between">
              <span className="font-medium text-slate-800">CYS302: Applied Cryptography & PKI (Core)</span>
              <span className="text-slate-600 font-bold">4 Credits</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex justify-between">
              <span className="font-medium text-slate-800">CSET318: Cloud Security Architecture (Core)</span>
              <span className="text-slate-600 font-bold">4 Credits</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex justify-between">
              <span className="font-medium text-slate-800">CYS304: Cyber Forensics & Incident Analysis (Core Lab)</span>
              <span className="text-slate-600 font-bold">3 Credits</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex justify-between">
              <span className="font-medium text-slate-800">SCSE3040: Machine Learning Operations (Elective)</span>
              <span className="text-slate-600 font-bold">3 Credits</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex justify-between">
              <span className="font-medium text-slate-800">SCSE4041: Prompt Engineering & LLM Architecture (Elective)</span>
              <span className="text-slate-600 font-bold">3 Credits</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex justify-between">
              <span className="font-medium text-slate-800">CSET312: SCSET Cyber Security Research Seminar</span>
              <span className="text-slate-600 font-bold">3 Credits</span>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
