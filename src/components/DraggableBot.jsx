// src/components/DraggableBot.jsx
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Bot,
  Sparkles,
  X,
  Minus,
  Maximize2,
  Send,
  RotateCcw,
  MessageSquare
} from 'lucide-react';
import {
  STUDENT_PROFILE,
  routeUserQuery,
  INITIAL_CHAT_MESSAGES,
  saveQueryToHistory
} from '../data/mockData';
import AnswerCard from './responses/AnswerCard';
import ClarificationCard from './responses/ClarificationCard';
import MultiDomainCard from './responses/MultiDomainCard';
import HandoffCard from './responses/HandoffCard';

import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar';
import { ScrollArea } from './ui/scroll-area';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';


export default function DraggableBot() {
  const location = useLocation();
  const navigate = useNavigate();

  // Dialog open/closed state
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [showTooltip, setShowTooltip] = useState(true);

  // Chat conversation state
  const [messages, setMessages] = useState(() => [
    {
      id: 'bot-welcome-0',
      sender: 'assistant',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      type: 'answer',
      domain: 'general',
      domainLabel: 'LUNA Campus AI',
      confidence: 0.99,
      answer: `Hello **${STUDENT_PROFILE.name}**! 👋\n\nI am **LUNA**, your Campus AI Assistant powered by *One Front Door*. I can instantly answer your questions about **Semester 5 Courses, Timetable, Attendance, Gate Pass, Fees**, and **IT Services**.\n\nClick the expand icon at the top right to open full screen anytime!`
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatScrollRef = useRef(null);

  // Hide initial hint tooltip after 6 seconds
  useEffect(() => {
    const timer = setTimeout(() => setShowTooltip(false), 6000);
    return () => clearTimeout(timer);
  }, []);

  // Auto-scroll chat to bottom
  useEffect(() => {
    if (isOpen && chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [messages, isLoading, isOpen]);

  // Submit query in bot chat
  const handleSend = useCallback((textToSend) => {
    const query = (textToSend || inputValue).trim();
    if (!query || isLoading) return;

    // Save to query history
    saveQueryToHistory(query);

    const userMsg = {
      id: `bot-user-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue('');
    setIsLoading(true);

    setTimeout(() => {
      const responseData = routeUserQuery(query);
      const botMsg = {
        id: `bot-resp-${Date.now()}`,
        sender: 'assistant',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        ...responseData
      };

      setMessages((prev) => [...prev, botMsg]);
      setIsLoading(false);
    }, 500);
  }, [inputValue, isLoading]);

  const handleOpenFullScreen = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setIsOpen(false);
    navigate('/chat', { state: { initialMessages: messages } });
  };

  // When the full-screen bot page (/chat) is opened, completely remove this small bot icon
  if (location.pathname === '/chat') {
    return null;
  }

  const QUICK_QUESTIONS = [
    { label: '📊 My Attendance', query: 'What is my current semester attendance?' },
    { label: '📅 Timetable', query: 'What is my timetable for Semester 5?' },
    { label: '💳 Fee Status', query: 'When is the semester fee deadline?' },
    { label: '🚪 Gate Pass', query: 'How can I apply for a hostel gate pass?' },
    { label: '📶 Campus Wi-Fi', query: 'How do I connect to campus Wi-Fi?' }
  ];

  // Check if current view is the student profile page
  const isProfilePage = location.pathname === '/' && (!location.search || location.search === '' || location.search.includes('profile'));

  return (
    <>
      {/* 1. Fixed Bot Icon Button at Bottom Right (Hidden ONLY on Profile page, shown on Cafeteria & all other tabs) */}
      {!isProfilePage && (
        <div
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '20px',
            zIndex: 40
          }}
          className="select-none"
        >
          {/* Floating Tooltip Hint (Shown when closed) */}
          {showTooltip && !isOpen && (
            <div className="absolute right-full mr-3 top-1/2 -translate-y-1/2 whitespace-nowrap bg-slate-900 text-white text-[11px] font-medium py-1.5 px-3 rounded-full shadow-xl pointer-events-none animate-bounce flex items-center gap-1.5 border border-slate-700">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>Ask LUNA • Click to chat</span>
              <div className="absolute -right-1 top-1/2 -translate-y-1/2 w-2 h-2 bg-slate-900 rotate-45 border-t border-r border-slate-700"></div>
            </div>
          )}

          <div className="relative group">
            {/* Glowing pulse rings */}
            <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-blue-600 via-indigo-500 to-cyan-400 opacity-75 blur-xs group-hover:opacity-100 transition duration-300 animate-pulse"></div>

            {/* Main Round Button */}
            <button
              type="button"
              onClick={() => {
                setIsOpen((prev) => !prev);
                setIsMinimized(false);
                setShowTooltip(false);
              }}
              className={`relative w-14 h-14 rounded-full flex items-center justify-center text-white shadow-2xl transition-all duration-200 border-2 ${isOpen
                  ? 'bg-gradient-to-br from-indigo-700 to-blue-900 border-cyan-400 scale-105'
                  : 'bg-gradient-to-br from-blue-700 via-indigo-600 to-sky-500 border-white/90 hover:scale-105 active:scale-95'
                } cursor-pointer`}
              aria-label="Toggle LUNA AI Assistant"
              title={isOpen ? "Close LUNA" : "Open LUNA AI Assistant"}
            >
              {isOpen ? (
                <X className="w-6 h-6 text-white transition-transform" />
              ) : (
                <div className="relative flex items-center justify-center">
                  <Bot className="w-7 h-7 text-white drop-shadow-md" />
                  <Sparkles
                    className="w-3.5 h-3.5 text-cyan-200 absolute -top-1 -right-1 animate-spin"
                    style={{ animationDuration: '6s' }}
                  />
                </div>
              )}

              {/* Active Green Status Dot */}
              <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-400 border-2 border-white rounded-full shadow-xs"></span>
            </button>

            {/* Mini label below */}
            <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1 px-1.5 py-0.5 rounded bg-slate-900/90 text-white text-[9px] font-bold tracking-wider uppercase shadow-xs pointer-events-none whitespace-nowrap">
              {isOpen ? 'Close' : 'LUNA AI'}
            </div>
          </div>
        </div>
      )}

      {/* 2. Interactive Chat Popup Window (Opens on current page without redirecting) */}
      {isOpen && (
        <div
          style={{
            position: 'fixed',
            bottom: '96px',
            right: '20px',
            zIndex: 50,
            width: '420px',
            maxWidth: 'calc(100vw - 32px)',
            height: isMinimized ? 'auto' : '540px',
            maxHeight: 'calc(100vh - 120px)'
          }}
          className="bg-white rounded-2xl shadow-2xl border border-blue-200/90 flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-blue-800 text-white px-4 py-3 flex items-center justify-between shadow-xs flex-shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="relative w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center shadow-inner">
                <Bot className="w-5 h-5 text-white" />
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full border border-blue-950"></span>
              </div>
              <div>
                <div className="font-bold text-xs text-white flex items-center gap-1.5">
                  LUNA • Campus AI
                  <span className="bg-cyan-400/20 text-cyan-200 text-[9px] px-1.5 py-0.2 rounded font-semibold border border-cyan-400/30">
                    One Front Door
                  </span>
                </div>
                <div className="text-[10px] text-blue-200/90 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                  Active • Campus ERP & SCSET
                </div>
              </div>
            </div>

            {/* Action buttons in header */}
            <div className="flex items-center gap-1">
              {/* FULLSCREEN BUTTON: When clicked, transitions to full screen! */}
              <button
                type="button"
                onClick={handleOpenFullScreen}
                className="p-1.5 text-blue-200 hover:text-white hover:bg-white/10 rounded-md transition-colors cursor-pointer"
                title="Open Full Screen Chat (Replaces menu with history)"
              >
                <Maximize2 className="w-3.5 h-3.5" />
              </button>

              <button
                type="button"
                onClick={() => {
                  setMessages([
                    {
                      id: `reset-${Date.now()}`,
                      sender: 'assistant',
                      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                      type: 'answer',
                      domain: 'general',
                      domainLabel: 'LUNA Campus AI',
                      confidence: 0.99,
                      answer: `Conversation reset. How can I assist you with university academic services today, **${STUDENT_PROFILE.name}**?`
                    }
                  ]);
                }}
                className="p-1.5 text-blue-200 hover:text-white hover:bg-white/10 rounded-md transition-colors cursor-pointer"
                title="Reset Conversation"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>

              <button
                type="button"
                onClick={() => setIsMinimized(!isMinimized)}
                className="p-1.5 text-blue-200 hover:text-white hover:bg-white/10 rounded-md transition-colors cursor-pointer"
                title={isMinimized ? "Expand" : "Minimize"}
              >
                <Minus className="w-3.5 h-3.5" />
              </button>

              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1.5 text-blue-200 hover:text-white hover:bg-white/10 rounded-md transition-colors cursor-pointer"
                title="Close Assistant"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {!isMinimized && (
            <>
              {/* Quick Query Suggestion Chips */}
              <div className="bg-slate-50 border-b border-slate-200/80 px-3 py-2 flex items-center gap-1.5 overflow-x-auto text-[11px] no-scrollbar flex-shrink-0">
                <span className="text-slate-400 font-semibold uppercase text-[9px] tracking-wider flex-shrink-0">
                  Quick:
                </span>
                {QUICK_QUESTIONS.map((chip, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSend(chip.query)}
                    className="flex-shrink-0 bg-white hover:bg-blue-50 text-slate-700 hover:text-blue-700 px-2 py-1 rounded-md border border-slate-200/90 hover:border-blue-300 font-medium transition-all shadow-2xs cursor-pointer"
                  >
                    {chip.label}
                  </button>
                ))}
              </div>

              {/* Chat Message Stream */}
              <div
                ref={chatScrollRef}
                className="flex-1 overflow-y-auto p-3.5 space-y-3 bg-slate-50/70"
              >
                {messages.map((msg) => {
                  const isUser = msg.sender === 'user';

                  if (isUser) {
                    return (
                      <div key={msg.id} className="flex justify-end">
                        <div className="max-w-[85%] bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl rounded-tr-xs px-3.5 py-2 shadow-xs text-xs">
                          <p className="leading-relaxed font-normal">{msg.text}</p>
                          <div className="text-[9px] text-blue-100 text-right mt-1 opacity-80">
                            {msg.timestamp}
                          </div>
                        </div>
                      </div>
                    );
                  }

                  // Assistant response
                  return (
                    <div key={msg.id} className="space-y-1.5">
                      <div className="flex items-center gap-1.5 text-[10px] text-slate-500 font-medium">
                        <img
                          src="/logo.png"
                          alt="AI"
                          className="w-4 h-4 rounded-full object-contain border border-slate-200 bg-[#2c211c]"
                        />
                        <span>Campus AI</span>
                        <span className="text-slate-300">•</span>
                        <span>{msg.timestamp}</span>
                      </div>

                      {msg.type === 'answer' && <AnswerCard data={msg} />}
                      {msg.type === 'clarification' && (
                        <ClarificationCard
                          data={msg}
                          onSelectOption={(opt) => handleSend(`Selected: ${opt.label}`)}
                        />
                      )}
                      {msg.type === 'multi_answer' && <MultiDomainCard data={msg} />}
                      {msg.type === 'handoff' && <HandoffCard data={msg} />}
                    </div>
                  );
                })}

                {/* Loading State */}
                {isLoading && (
                  <div className="flex items-center gap-2 p-3 bg-white rounded-xl border border-slate-200 shadow-2xs max-w-[70%]">
                    <Sparkles className="w-4 h-4 text-blue-600 animate-spin" />
                    <span className="text-xs text-slate-600 font-medium">
                      Searching Academic Knowledge Base...
                    </span>
                  </div>
                )}
              </div>

              {/* Chat Input Bar */}
              <div className="p-2.5 bg-white border-t border-slate-200 flex-shrink-0">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSend();
                  }}
                  className="flex items-center gap-1.5"
                >
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Ask about timetable, attendance, gate pass, fees..."
                    className="flex-1 bg-slate-100/80 focus:bg-white text-xs text-slate-800 placeholder-slate-400 px-3 py-2 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                  />
                  <button
                    type="submit"
                    disabled={!inputValue.trim() || isLoading}
                    className="bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white p-2 rounded-xl transition-all shadow-xs flex-shrink-0 cursor-pointer"
                    aria-label="Send message"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>

                <div className="flex items-center justify-between text-[10px] text-slate-400 mt-1.5 px-1">
                  <span>Student ID: {STUDENT_PROFILE.rollNo}</span>
                  <button
                    type="button"
                    onClick={handleOpenFullScreen}
                    className="text-blue-600 hover:underline cursor-pointer font-medium flex items-center gap-1"
                  >
                    <span>Full Screen Chat</span>
                    <Maximize2 className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
}
