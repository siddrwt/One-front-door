// src/components/layout/CamuLayout.jsx
import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Building2,
  MessageSquare,
  CalendarCheck,
  CalendarDays,
  FileBarChart,
  TrendingUp,
  Sun,
  Utensils,
  Table,
  CalendarPlus,
  Headphones,
  UserPlus,
  Search,
  ChevronsLeft,
  ChevronsRight,
  User,
  Grid,
  Accessibility,
  Settings,
  LogOut,
  Menu,
  X,
  History,
  SquarePen,
  ArrowLeft,
  RotateCcw,
  Sparkles,
  BarChart3
} from 'lucide-react';

import { STUDENT_PROFILE, getStoredQueryHistory, clearStoredQueryHistory } from '../../data/mockData';
import DraggableBot from '../DraggableBot';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '../ui/avatar';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '../ui/sheet';
import { ScrollArea } from '../ui/scroll-area';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';

export default function CamuLayout({ children }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [history, setHistory] = useState(getStoredQueryHistory);
  const location = useLocation();
  const navigate = useNavigate();

  const isBotOpen = location.pathname === '/chat';

  // Listen for history updates when new queries are submitted
  useEffect(() => {
    const updateHist = () => setHistory(getStoredQueryHistory());
    window.addEventListener('ofd_history_updated', updateHist);
    return () => {
      window.removeEventListener('ofd_history_updated', updateHist);
    };
  }, []);

  const historyGroups = [
    {
      title: 'Recent Conversations',
      items: history.length > 0 ? history : [
        { id: '1', query: 'What is my current semester attendance?' },
        { id: '2', query: 'When is the semester fee deadline?' },
        { id: '3', query: 'What is my timetable for Semester 5?' }
      ]
    }
  ];

  // Categorized navigation items with curated color themes
  const navigationCategories = [
    {
      title: 'Portal Overview',
      items: [
        { name: 'My Institution', path: '/', icon: Building2, active: location.pathname === '/' && !location.search, color: 'text-indigo-600 bg-indigo-50 border-indigo-100' },
        { name: 'Messages', path: '/?tab=messages', icon: MessageSquare, badge: '2', active: location.search.includes('messages'), color: 'text-sky-600 bg-sky-50 border-sky-100' },
        { name: 'Reports', path: '/?tab=reports', icon: FileBarChart, active: location.search.includes('reports'), color: 'text-purple-600 bg-purple-50 border-purple-100' },
        { name: 'Progress Report', path: '/?tab=progress', icon: TrendingUp, active: location.search.includes('progress'), color: 'text-blue-600 bg-blue-50 border-blue-100' },
      ]
    },
    {
      title: 'Academics',
      items: [
        { name: 'Attendance', path: '/?tab=attendance', icon: CalendarCheck, active: location.search.includes('attendance'), color: 'text-emerald-600 bg-emerald-50 border-emerald-100' },
        { name: 'Exam schedules', path: '/?tab=exams', icon: CalendarDays, active: location.search.includes('exams'), color: 'text-amber-600 bg-amber-50 border-amber-100' },
        { name: 'Timetable', path: '/?tab=timetable', icon: Table, active: location.search.includes('timetable'), color: 'text-cyan-600 bg-cyan-50 border-cyan-100' },
        { name: 'Enrollment', path: '/?tab=enrollment', icon: UserPlus, active: location.search.includes('enrollment'), color: 'text-indigo-600 bg-indigo-50 border-indigo-100' },
      ]
    },
    {
      title: 'Campus Life & Services',
      items: [
        { name: 'Cafeteria', path: '/?tab=cafeteria', icon: Utensils, active: location.search.includes('cafeteria'), color: 'text-rose-600 bg-rose-50 border-rose-100' },
        { name: 'Holidays', path: '/?tab=holidays', icon: Sun, active: location.search.includes('holidays'), color: 'text-amber-500 bg-amber-50 border-amber-100' },
        { name: 'Leave and Gate Pass', path: '/?tab=gatepass', icon: CalendarPlus, active: location.search.includes('gatepass'), color: 'text-rose-600 bg-rose-50 border-rose-100' },
        { name: 'Services', path: '/?tab=services', icon: Headphones, active: location.search.includes('services'), color: 'text-violet-600 bg-violet-50 border-violet-100' },
      ]
    }
  ];

  const handleSelectHistoryItem = (query) => {
    window.dispatchEvent(new CustomEvent('ofd_load_query', { detail: query }));
  };

  const handleNewChat = () => {
    window.dispatchEvent(new Event('ofd_new_chat'));
  };

  return (
    <TooltipProvider>
      <div className="h-screen w-screen bg-[#fff7f2] flex font-sans antialiased text-slate-800 relative overflow-hidden selection:bg-blue-100">

        {/* 1. Full-Height Fixed Left Sidebar */}
        <aside
          className={`bg-white border-r border-slate-200/80 flex-shrink-0 hidden lg:flex flex-col z-30 transition-all duration-300 h-full ${sidebarCollapsed ? 'w-16' : 'w-64'
            }`}
        >
          {/* Top University Portal Crest / Logo Header */}
          <div className="p-4 pt-5 pb-3 border-b border-slate-100">
            {!sidebarCollapsed ? (
              <Link to="/" className="flex items-center gap-3 group">
                <img
                  src="/logo.png"
                  alt="Student Portal Crest"
                  className="w-10 h-10 object-contain rounded-xl shadow-xs border border-slate-200/80 bg-[#2c211c] p-1 group-hover:scale-105 transition-transform"
                />
                <div className="flex flex-col">
                  <span className="font-extrabold text-slate-900 text-sm tracking-tight leading-tight">STUDENT PORTAL</span>
                  <span className="text-[10px] text-blue-600 font-bold tracking-wide uppercase">One Front Door</span>
                </div>
              </Link>
            ) : (
              <Link to="/" className="flex justify-center group">
                <img
                  src="/logo.png"
                  alt="Student Portal Crest"
                  className="w-9 h-9 object-contain rounded-xl shadow-xs border border-slate-200/80 bg-[#2c211c] p-1 group-hover:scale-105 transition-transform"
                />
              </Link>
            )}
          </div>

          {/* SIDEBAR CONTENT OPTION A: CHAT QUERY HISTORY (Shown when Bot is opened) */}
          {isBotOpen ? (
            <>
              {/* + New Chat Action Button */}
              {!sidebarCollapsed && (
                <div className="p-3">
                  <Button
                    type="button"
                    onClick={handleNewChat}
                    className="w-full justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-xs cursor-pointer rounded-xl h-9 text-xs"
                  >
                    <SquarePen className="w-4 h-4" />
                    <span>+ New Chat</span>
                  </Button>
                </div>
              )}

              {/* History Section Title */}
              {!sidebarCollapsed && (
                <div className="px-3.5 pt-2 pb-1.5 flex items-center justify-between text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <div className="flex items-center gap-1.5">
                    <History className="w-3.5 h-3.5 text-blue-600" />
                    <span>Chat History</span>
                  </div>
                  <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-4 font-semibold">
                    {history.length}
                  </Badge>
                </div>
              )}

              {/* Grouped Query History List */}
              <ScrollArea className="flex-1 px-2 py-1">
                <div className="space-y-3">
                  {historyGroups.map((group) => (
                    <div key={group.title} className="space-y-1">
                      {!sidebarCollapsed && (
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2 pt-1">
                          {group.title}
                        </div>
                      )}
                      {group.items.map((item) => (
                        sidebarCollapsed ? (
                          <Tooltip key={item.id}>
                            <TooltipTrigger asChild>
                              <button
                                type="button"
                                onClick={() => handleSelectHistoryItem(item.query)}
                                className="w-full flex justify-center py-2 rounded-lg text-slate-600 hover:bg-blue-50 hover:text-blue-900 transition-colors"
                              >
                                <MessageSquare className="w-4 h-4 text-blue-600" />
                              </button>
                            </TooltipTrigger>
                            <TooltipContent side="right">
                              <p className="text-xs">{item.query}</p>
                            </TooltipContent>
                          </Tooltip>
                        ) : (
                          <button
                            key={item.id}
                            type="button"
                            onClick={() => handleSelectHistoryItem(item.query)}
                            className="w-full text-left px-2.5 py-2 rounded-lg text-xs hover:bg-blue-50/80 text-slate-700 hover:text-blue-900 transition-colors flex items-start gap-2 group cursor-pointer"
                          >
                            <MessageSquare className="w-3.5 h-3.5 text-blue-500 group-hover:text-blue-700 mt-0.5 flex-shrink-0" />
                            <div className="min-w-0 flex-1">
                              <p className="truncate text-[12.5px] leading-tight font-medium text-slate-800 group-hover:text-blue-900">
                                {item.query}
                              </p>
                              <span className="text-[10px] text-slate-400 block mt-0.5">
                                {item.timestamp}
                              </span>
                            </div>
                          </button>
                        )
                      ))}
                    </div>
                  ))}
                </div>
              </ScrollArea>

              {/* Bottom: Return to Portal / My Institution */}
              <div className="p-3 border-t border-slate-100 space-y-2">
                <Link to="/">
                  <Button
                    variant="outline"
                    className="w-full justify-center gap-2 rounded-xl text-xs h-9 font-semibold text-slate-700"
                  >
                    <ArrowLeft className="w-4 h-4 text-slate-500" />
                    {!sidebarCollapsed && <span>Back to Portal</span>}
                  </Button>
                </Link>

                {!sidebarCollapsed && (
                  <button
                    type="button"
                    onClick={() => clearStoredQueryHistory()}
                    className="w-full text-center text-[10px] text-slate-400 hover:text-rose-600 transition-colors py-0.5 cursor-pointer"
                  >
                    Clear Query History
                  </button>
                )}
              </div>
            </>
          ) : (
            /* SIDEBAR CONTENT OPTION B: STANDARD MY INSTITUTION PORTAL MENU */
            <>
              {/* Search Input with Ctrl K */}
              {!sidebarCollapsed && (
                <div className="px-3 py-2.5 mb-1">
                  <div className="relative group">
                    <Search className="w-3.5 h-3.5 text-slate-400 group-focus-within:text-blue-600 absolute left-3 top-1/2 -translate-y-1/2 z-10 transition-colors" />
                    <Input
                      type="text"
                      placeholder="Search portal..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-9 pr-12 h-9 text-xs bg-slate-50 border-slate-200/90 focus:bg-white focus:border-blue-500 rounded-xl transition-all placeholder:text-slate-400"
                    />
                    <kbd className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-400 border border-slate-200/90 px-1.5 py-0.5 rounded-md bg-white shadow-2xs">
                      Ctrl K
                    </kbd>
                  </div>
                </div>
              )}

              {/* Navigation Items List with Grouping */}
              <ScrollArea className="flex-1 px-3 py-1">
                <div className="space-y-4">
                  {navigationCategories.map((cat, catIdx) => (
                    <div key={catIdx} className="space-y-1">
                      {!sidebarCollapsed && (
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2 pt-1 pb-1">
                          {cat.title}
                        </div>
                      )}
                      <div className="space-y-1">
                        {cat.items.map((item, idx) => {
                          const Icon = item.icon;
                          const isSelected = item.active;

                          if (sidebarCollapsed) {
                            return (
                              <Tooltip key={idx}>
                                <TooltipTrigger asChild>
                                  <Link
                                    to={item.path}
                                    className={`flex justify-center p-2 rounded-xl text-xs transition-all ${isSelected
                                      ? 'bg-blue-600 text-white shadow-sm'
                                      : 'text-slate-600 hover:bg-slate-100/80 hover:text-slate-900'
                                      }`}
                                  >
                                    <Icon className={`w-4 h-4 ${isSelected ? 'text-white' : 'text-slate-600'}`} />
                                  </Link>
                                </TooltipTrigger>
                                <TooltipContent side="right">
                                  <p className="text-xs font-medium">{item.name}</p>
                                </TooltipContent>
                              </Tooltip>
                            );
                          }

                          return (
                            <Link
                              key={idx}
                              to={item.path}
                              className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-all group ${isSelected
                                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold shadow-xs'
                                : 'text-slate-700 hover:bg-slate-100/90 hover:text-slate-900 font-medium'
                                }`}
                            >
                              <div className="flex items-center gap-3">
                                <div className={`p-1.5 rounded-lg border transition-transform group-hover:scale-105 ${isSelected
                                  ? 'bg-white/20 text-white border-transparent'
                                  : `${item.color}`
                                  }`}>
                                  <Icon className="w-3.5 h-3.5" />
                                </div>
                                <span className="text-[13px]">{item.name}</span>
                              </div>
                              {item.badge && (
                                <Badge className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${isSelected
                                  ? 'bg-white/25 text-white border-transparent'
                                  : 'bg-blue-600 text-white shadow-2xs'
                                  }`}>
                                  {item.badge}
                                </Badge>
                              )}
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>

              {/* Sidebar Collapse Toggle Button */}
              <div className="p-3 border-t border-slate-100 flex items-center flex-shrink-0">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                  className="w-full justify-center text-slate-500 hover:text-slate-900 h-8 text-xs cursor-pointer"
                  title={sidebarCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
                >
                  {sidebarCollapsed ? (
                    <ChevronsRight className="w-4 h-4" />
                  ) : (
                    <div className="flex items-center gap-1.5 text-xs text-slate-600 font-medium">
                      <ChevronsLeft className="w-4 h-4" />
                      <span>Collapse menu</span>
                    </div>
                  )}
                </Button>
              </div>
            </>
          )}
        </aside>

        {/* Mobile Drawer using shadcn Sheet */}
        <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
          <SheetContent side="left" className="w-72 p-4 flex flex-col justify-between">
            <div>
              <SheetHeader className="pb-3 border-b border-slate-100 mb-3 flex flex-row items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <img src="/logo.png" alt="Student Portal Crest" className="w-8 h-8 object-contain rounded-lg border border-slate-200 bg-[#2c211c] p-0.5" />
                  <SheetTitle className="font-bold text-slate-900 text-sm">STUDENT PORTAL</SheetTitle>
                </div>
              </SheetHeader>

              {isBotOpen ? (
                <div className="space-y-2">
                  <Button
                    onClick={() => {
                      handleNewChat();
                      setMobileMenuOpen(false);
                    }}
                    className="w-full justify-center gap-2 bg-blue-600 text-white rounded-lg h-9 text-xs font-semibold"
                  >
                    <SquarePen className="w-3.5 h-3.5" />
                    <span>+ New Chat</span>
                  </Button>
                  <div className="text-[11px] font-bold text-slate-400 uppercase pt-2">History</div>
                  <ScrollArea className="h-64">
                    <div className="space-y-1">
                      {history.slice(0, 10).map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => {
                            handleSelectHistoryItem(item.query);
                            setMobileMenuOpen(false);
                          }}
                          className="w-full text-left p-2 rounded text-xs hover:bg-slate-100 truncate block text-slate-700"
                        >
                          {item.query}
                        </button>
                      ))}
                    </div>
                  </ScrollArea>
                  <Link
                    to="/"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block text-center bg-slate-100 text-slate-700 py-2 rounded-lg text-xs font-semibold mt-3"
                  >
                    Back to Portal
                  </Link>
                </div>
              ) : (
                <ScrollArea className="h-[calc(100vh-140px)]">
                  <div className="space-y-4">
                    {navigationCategories.map((cat, catIdx) => (
                      <div key={catIdx} className="space-y-1">
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2">
                          {cat.title}
                        </div>
                        <div className="space-y-0.5">
                          {cat.items.map((item, idx) => (
                            <Link
                              key={idx}
                              to={item.path}
                              onClick={() => setMobileMenuOpen(false)}
                              className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium text-slate-700 hover:bg-slate-100"
                            >
                              <div className="flex items-center gap-3">
                                <div className={`p-1.5 rounded-lg border ${item.color}`}>
                                  <item.icon className="w-3.5 h-3.5" />
                                </div>
                                <span>{item.name}</span>
                              </div>
                              {item.badge && (
                                <Badge className="bg-blue-600 text-white text-[10px] px-1.5 py-0">
                                  {item.badge}
                                </Badge>
                              )}
                            </Link>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              )}
            </div>

            <div className="pt-3 border-t border-slate-100 text-xs text-slate-600 flex items-center gap-2">
              <Avatar className="w-7 h-7">
                <AvatarImage src={STUDENT_PROFILE.avatarUrl} alt={STUDENT_PROFILE.name} />
                <AvatarFallback>{STUDENT_PROFILE.name.substring(0, 2)}</AvatarFallback>
              </Avatar>
              <div className="truncate">
                <span className="font-bold text-slate-900 block truncate">{STUDENT_PROFILE.name}</span>
                <span className="text-[10px] text-slate-500 block truncate">{STUDENT_PROFILE.enrollmentNo}</span>
              </div>
            </div>
          </SheetContent>
        </Sheet>

        {/* 2. Main Center Body (Fixed Header, Scrollable Main Area) */}
        <div className="flex-1 min-w-0 flex flex-col h-full overflow-hidden">

          {/* Top Header - Fixed flex-shrink-0 */}
          <header className="w-full pt-3 px-4 sm:px-8 flex items-center justify-between gap-4 flex-shrink-0 z-20 bg-[#fff7f2]">
            <div className="lg:hidden flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="h-9 w-9 bg-white"
              >
                <Menu className="w-5 h-5 text-slate-700" />
              </Button>
              <img src="/logo.png" alt="Student Portal Crest" className="w-8 h-8 object-contain rounded-lg border border-slate-200 bg-[#2c211c] p-0.5" />
            </div>

            {/* Quick Link to Evaluation Bench */}
            <div className="hidden sm:flex items-center gap-2">
              <Link to="/evaluation">
                <Button variant="outline" size="sm" className="h-8 gap-1.5 text-xs bg-white border-slate-200/80 text-slate-700 hover:text-indigo-600 hover:border-indigo-200">
                  <BarChart3 className="w-3.5 h-3.5 text-indigo-600" />
                  <span>System Benchmarks</span>
                </Button>
              </Link>
            </div>

            {/* Top-Right: Student Snippet with Avatar */}
            <div className="flex items-center ml-auto">
              <div className="bg-white rounded-2xl shadow-xs border border-slate-200/80 px-3.5 py-1.5 flex items-center gap-3">
                <Avatar className="w-9 h-9 border border-slate-200">
                  <AvatarImage src={STUDENT_PROFILE.headerAvatarUrl || STUDENT_PROFILE.avatarUrl} alt={STUDENT_PROFILE.name} />
                  <AvatarFallback className="bg-blue-600 text-white font-bold text-xs">{STUDENT_PROFILE.name.substring(0, 2)}</AvatarFallback>
                </Avatar>
                <div className="text-left text-xs leading-tight">
                  <div className="font-bold text-slate-900 text-[13px]">{STUDENT_PROFILE.name}</div>
                  <div className="text-[11px] text-slate-600 font-normal">{STUDENT_PROFILE.college}</div>
                  <div className="text-[10px] text-slate-500 font-medium">
                    {STUDENT_PROFILE.semester} | {STUDENT_PROFILE.academicYear}
                  </div>
                </div>
              </div>
            </div>
          </header>

          {/* Dynamic Page Content Area - Scrollable */}
          <main className="flex-1 px-4 sm:px-8 py-5 overflow-y-auto">
            {children}
          </main>
        </div>

        {/* 3. Far-Right Docked Action Rail - Fixed h-full */}
        <aside className="w-14 hidden md:flex flex-col items-center py-6 pr-3 flex-shrink-0 h-full justify-start">
          <div className="flex flex-col items-center gap-3">
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  className="w-9 h-9 rounded-full bg-[#112a59] hover:bg-[#1a3d7c] text-white flex items-center justify-center shadow-xs transition-transform hover:scale-105 cursor-pointer"
                  onClick={() => navigate('/')}
                >
                  <User className="w-4 h-4 text-white" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="left">Student Profile</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  className="w-9 h-9 rounded-full bg-[#112a59] hover:bg-[#1a3d7c] text-white flex items-center justify-center shadow-xs transition-transform hover:scale-105 cursor-pointer"
                >
                  <Settings className="w-4 h-4 text-white" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="left">Settings</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  className="w-9 h-9 rounded-full bg-[#112a59] hover:bg-rose-700 text-white flex items-center justify-center shadow-xs transition-transform hover:scale-105 cursor-pointer"
                >
                  <LogOut className="w-4 h-4 text-white" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="left">Sign Out</TooltipContent>
            </Tooltip>
          </div>
        </aside>

        {/* 4. Fixed Bot Button at Bottom (Hidden when on full-screen /chat page) */}
        {!isBotOpen && <DraggableBot />}
      </div>
    </TooltipProvider>
  );
}

