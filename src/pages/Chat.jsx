// src/pages/Chat.jsx
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useLocation, Link } from 'react-router-dom';
import {
  Send,
  Sparkles,
  RotateCcw,
  ArrowLeft,
  User,
  Layers,
  BarChart3,
  Bot,
  Maximize2,
  Minimize2
} from 'lucide-react';
import {
  STUDENT_PROFILE,
  DOMAINS,
  SUGGESTED_QUERIES,
  INITIAL_CHAT_MESSAGES,
  routeUserQuery,
  MOCK_RESPONSES,
  saveQueryToHistory
} from '../data/mockData';
import AnswerCard from '../components/responses/AnswerCard';
import ClarificationCard from '../components/responses/ClarificationCard';
import MultiDomainCard from '../components/responses/MultiDomainCard';
import HandoffCard from '../components/responses/HandoffCard';

import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Avatar, AvatarImage, AvatarFallback } from '../components/ui/avatar';
import { ScrollArea } from '../components/ui/scroll-area';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../components/ui/tooltip';

export default function Chat() {
  const location = useLocation();
  const [messages, setMessages] = useState(() => {
    return location.state?.initialMessages || INITIAL_CHAT_MESSAGES;
  });
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const messagesEndRef = useRef(null);

  // Sync initialMessages when passed via location state
  useEffect(() => {
    if (location.state?.initialMessages && location.state.initialMessages.length > 0) {
      setMessages(location.state.initialMessages);
    }
  }, [location.state?.initialMessages]);

  const toggleFullscreen = (e) => {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    const nextState = !isFullscreen;
    setIsFullscreen(nextState);

    if (nextState) {
      if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen().catch(() => { });
      }
    } else {
      if (document.fullscreenElement && document.exitFullscreen) {
        document.exitFullscreen().catch(() => { });
      }
    }
  };

  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleUserSubmit = useCallback((queryText) => {
    const text = (queryText || inputValue).trim();
    if (!text || isLoading) return;

    // Save to student query history
    saveQueryToHistory(text);

    const userMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    // Simulate smart semantic routing latency
    setTimeout(() => {
      const responseData = routeUserQuery(text);

      const assistantMessage = {
        id: `assistant-${Date.now()}`,
        sender: 'assistant',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        ...responseData
      };

      setMessages((prev) => [...prev, assistantMessage]);
      setIsLoading(false);
    }, 600);
  }, [inputValue, isLoading]);

  // Listen for history item click from sidebar
  useEffect(() => {
    const handleLoadQuery = (e) => {
      if (e.detail) {
        handleUserSubmit(e.detail);
      }
    };

    const handleNewChat = () => {
      setMessages(INITIAL_CHAT_MESSAGES);
    };

    window.addEventListener('ofd_load_query', handleLoadQuery);
    window.addEventListener('ofd_new_chat', handleNewChat);
    return () => {
      window.removeEventListener('ofd_load_query', handleLoadQuery);
      window.removeEventListener('ofd_new_chat', handleNewChat);
    };
  }, [handleUserSubmit]);

  const initialPromptHandled = useRef(false);

  // Handle passed initialPrompt from Dashboard
  useEffect(() => {
    const prompt = location.state?.initialPrompt;
    if (prompt && !initialPromptHandled.current) {
      const timer = setTimeout(() => {
        initialPromptHandled.current = true;
        handleUserSubmit(prompt);
        window.history.replaceState({}, document.title);
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [location.state, handleUserSubmit]);



  const handleClarificationOption = (option) => {
    if (isLoading) return;

    // Post the clarification choice as user action
    const choiceMessage = {
      id: `user-clarify-${Date.now()}`,
      sender: 'user',
      text: `Selected: ${option.label}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, choiceMessage]);
    setIsLoading(true);

    setTimeout(() => {
      let resolvedAnswer;
      if (option.id === 'fee_reg') {
        resolvedAnswer = MOCK_RESPONSES.fee_clarified;
      } else if (option.id === 'exam_reg') {
        resolvedAnswer = MOCK_RESPONSES.exam_clarified;
      } else {
        resolvedAnswer = routeUserQuery(option.label);
      }

      const assistantMessage = {
        id: `assistant-${Date.now()}`,
        sender: 'assistant',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        ...resolvedAnswer
      };

      setMessages((prev) => [...prev, assistantMessage]);
      setIsLoading(false);
    }, 500);
  };

  const handleClearChat = () => {
    setMessages(INITIAL_CHAT_MESSAGES);
  };

  return (
    <TooltipProvider>
      <div
        className={
          isFullscreen
            ? "fixed inset-0 z-50 flex flex-col h-screen w-screen bg-white overflow-hidden p-2 sm:p-4 animate-in fade-in zoom-in-95 duration-200"
            : "flex flex-col h-[calc(100vh-100px)] min-h-[580px] bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden transition-all duration-200"
        }
      >

        {/* 1. Professional Header */}
        <div className="bg-slate-900 text-white px-5 py-3.5 border-b border-slate-800 flex items-center justify-between gap-4 flex-shrink-0">
          <div className="flex items-center gap-3">
            <Link to="/">
              <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-300 hover:text-white hover:bg-slate-800">
                <ArrowLeft className="w-4 h-4" />
              </Button>
            </Link>

            <div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-400 animate-pulse"></span>
                <h2 className="text-base font-bold text-white tracking-tight">
                  Campus AI Assistant
                </h2>
                <Badge variant="outline" className="text-[10px] bg-blue-950 text-cyan-300 border-blue-800 font-mono">
                  One Front Door
                </Badge>
              </div>
              <div className="text-xs text-slate-400 flex items-center gap-2 mt-0.5">
                <span>Authenticated: {STUDENT_PROFILE.name}</span>
                <span>•</span>
                <span className="text-emerald-400 font-medium">Session Active</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link to="/evaluation">
              <Button variant="outline" size="sm" className="hidden sm:inline-flex gap-1.5 h-8 text-xs bg-slate-800 text-slate-200 border-slate-700 hover:bg-slate-700">
                <BarChart3 className="w-3.5 h-3.5 text-indigo-400" />
                <span>Evaluation</span>
              </Button>
            </Link>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={toggleFullscreen}
                  className="gap-1.5 h-8 text-xs bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700 hover:text-white cursor-pointer"
                >
                  {isFullscreen ? <Minimize2 className="w-3.5 h-3.5 text-cyan-400" /> : <Maximize2 className="w-3.5 h-3.5 text-cyan-400" />}
                  <span className="hidden sm:inline">{isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>{isFullscreen ? 'Exit Full Screen' : 'Open Full Screen'}</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleClearChat}
                  className="gap-1.5 h-8 text-xs bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700 hover:text-white cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Reset</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>Reset conversation</TooltipContent>
            </Tooltip>
          </div>
        </div>

        {/* 2. Active Domains Ribbon */}
        <div className="bg-slate-50 px-4 py-2 border-b border-slate-200/80 flex items-center justify-between flex-wrap gap-2 text-xs flex-shrink-0">
          <div className="flex items-center gap-1.5 text-slate-500 font-semibold uppercase tracking-wider text-[10px]">
            <Layers className="w-3 h-3 text-slate-400" />
            <span>Active Orchestration Mesh:</span>
          </div>

          <div className="flex items-center gap-1.5 flex-wrap">
            {DOMAINS.map((domain) => (
              <Badge
                key={domain.id}
                variant="outline"
                className={`text-[11px] font-semibold border ${domain.badgeBg}`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70 mr-1 inline-block"></span>
                {domain.name}
              </Badge>
            ))}
          </div>
        </div>

        {/* 3. Messages Feed */}
        <ScrollArea className="flex-1 p-4 sm:p-6 bg-slate-50/40">
          <div className="space-y-5 max-w-4xl mx-auto pb-4">
            {messages.map((message) => {
              if (message.sender === 'user') {
                return (
                  <div key={message.id} className="flex justify-end gap-2.5 max-w-2xl ml-auto">
                    <div className="flex flex-col items-end">
                      <div className="bg-blue-600 text-white px-4 py-2.5 rounded-2xl rounded-tr-xs shadow-xs text-[14.5px] leading-relaxed">
                        {message.text}
                      </div>
                      <span className="text-[10px] text-slate-400 mt-1 font-mono">
                        {message.timestamp}
                      </span>
                    </div>
                    <Avatar className="w-8 h-8 border border-slate-200 mt-1">
                      <AvatarImage src={STUDENT_PROFILE.avatarUrl} />
                      <AvatarFallback className="bg-slate-800 text-white font-bold text-xs">{STUDENT_PROFILE.name.substring(0, 2)}</AvatarFallback>
                    </Avatar>
                  </div>
                );
              }

              // Assistant message rendering based on type
              return (
                <div key={message.id} className="flex gap-3 max-w-3xl mr-auto">
                  <Avatar className="w-8 h-8 border border-blue-200 mt-1">
                    <AvatarFallback className="bg-gradient-to-tr from-blue-700 to-indigo-600 text-white font-bold">
                      <Sparkles className="w-4 h-4" />
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1 min-w-0 space-y-3">
                    {/* Direct Single Domain Answer */}
                    {message.type === 'answer' && (
                      <AnswerCard data={message} />
                    )}

                    {/* Ambiguous Clarification Card */}
                    {message.type === 'clarification' && (
                      <ClarificationCard
                        data={message}
                        onSelectOption={handleClarificationOption}
                      />
                    )}

                    {/* Multi-Domain Synthesized Card */}
                    {message.type === 'multi_answer' && (
                      <MultiDomainCard data={message} />
                    )}

                    {/* Human Handoff Card */}
                    {message.type === 'handoff' && (
                      <HandoffCard data={message} />
                    )}

                    <div className="text-[10px] text-slate-400 mt-1 flex items-center gap-2 pl-1 font-mono">
                      <span>{message.timestamp}</span>
                      <span>•</span>
                      <span>One Front Door AI</span>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Loading Indicator */}
            {isLoading && (
              <div className="flex gap-3 max-w-md mr-auto animate-pulse">
                <Avatar className="w-8 h-8 border border-blue-200">
                  <AvatarFallback className="bg-blue-600 text-white font-bold">
                    <Sparkles className="w-4 h-4" />
                  </AvatarFallback>
                </Avatar>
                <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-2xs space-y-2 flex-1">
                  <div className="flex items-center gap-2 text-xs font-semibold text-blue-700">
                    <Sparkles className="w-3.5 h-3.5 animate-spin text-blue-600" />
                    <span>Orchestrating semantic query routing...</span>
                  </div>
                  <div className="h-2 bg-slate-200 rounded w-3/4 animate-pulse"></div>
                  <div className="h-2 bg-slate-100 rounded w-1/2 animate-pulse"></div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        {/* 4. Suggested Queries Chips */}
        <div className="px-4 py-2 bg-white border-t border-slate-100 flex items-center gap-2 overflow-x-auto text-xs flex-shrink-0">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 whitespace-nowrap">
            Try asking:
          </span>
          <div className="flex items-center gap-1.5 overflow-x-auto py-0.5 no-scrollbar">
            {SUGGESTED_QUERIES.map((sq, idx) => (
              <Button
                key={idx}
                variant="outline"
                size="sm"
                onClick={() => handleUserSubmit(sq.query)}
                className="h-7 text-[11px] rounded-full bg-slate-50 border-slate-200 text-slate-700 hover:bg-blue-50 hover:text-blue-800 hover:border-blue-200 whitespace-nowrap cursor-pointer"
              >
                {sq.label}
              </Button>
            ))}
          </div>
        </div>

        {/* 5. Message Input Bar */}
        <div className="p-3 bg-white border-t border-slate-200 flex-shrink-0">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleUserSubmit();
            }}
            className="flex items-center gap-2"
          >
            <Input
              type="text"
              placeholder="Ask anything about fees, exams, attendance, cafeteria or timetable..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              disabled={isLoading}
              className="h-10 text-xs sm:text-sm bg-slate-50 border-slate-200 focus:bg-white focus:ring-blue-500 rounded-xl"
            />
            <Button
              type="submit"
              disabled={!inputValue.trim() || isLoading}
              className="h-10 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl shadow-xs gap-1.5 cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span className="hidden sm:inline text-xs font-semibold">Send</span>
            </Button>
          </form>
        </div>
      </div>
    </TooltipProvider>
  );
}
