'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { Send, Bot, User } from 'lucide-react';
import { ResultsModal, PHIScoreResult } from './ResultsModal';
import { calculatePHIScore } from './phiScoring';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export function AIChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const handoverNote = `Handover Note: Patient: Baby Boy 'B' (Twin 2). Mother: Elena Volkov (Refugee status). Feeding/GI: Total fluids 150ml/kg/d. EBM via NGT. Tolerating 8ml 2-hourly. No aspirates. Last BO was meconium-ish/seedy. Resp: CPAP 6cmH2O, FiO2 28%. SpO2 94%. Note: Using the 'Neo-Breathe 500' prototype ventilator (Trial Phase - Clinical Engineering Dept only). Meds: IV Benzylpenicillin + Gentamicin. Trust Savings Note: Using Generic Lot 2026/B (per Pharmacy Cost-Correction Directive). Social/Safeguarding: Police Liaison Officer PC Miller (Badge #4492) visited Ward 4 today regarding Elena's residency status in Warwick. Elena very distressed; requested no "official records" be generated. Neuro/Skin: Stable. Grade 1 PVL on left. Unique Marker: Small 'Strawberry' birthmark on L-inner thigh and a dimple on the L-preauricular (ear) area. Plan: Night shift to monitor apnoeas and manage Mother's anxiety. Handover to Night Lead SN James.`;
  const [input, setInput] = useState('');
  const [highlightedWords, setHighlightedWords] = useState<Set<number>>(new Set());
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartIndex, setDragStartIndex] = useState<number | null>(null);
  const [dragCurrentIndex, setDragCurrentIndex] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showResultsModal, setShowResultsModal] = useState(false);
  const [scoreResult, setScoreResult] = useState<PHIScoreResult | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const autoScrollIntervalRef = useRef<number | null>(null);

  // Split text into words and spaces for rendering
  const textParts = handoverNote.split(/(\s+)/);
  const wordsWithSpaces = textParts.map((part, index) => ({
    text: part,
    isSpace: /^\s+$/.test(part),
    wordIndex: /^\s+$/.test(part) ? -1 : textParts.slice(0, index).filter(p => !/^\s+$/.test(p)).length,
  }));

  // Create a map from word index to word for scoring
  const wordIndexToWordMap = new Map<number, string>();
  wordsWithSpaces.forEach((part) => {
    if (!part.isSpace && part.wordIndex !== -1) {
      wordIndexToWordMap.set(part.wordIndex, part.text);
    }
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleWordMouseDown = (wordIndex: number, e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    setDragStartIndex(wordIndex);
    setDragCurrentIndex(wordIndex);
  };

  const handleWordMouseEnter = (wordIndex: number) => {
    if (isDragging && dragStartIndex !== null) {
      setDragCurrentIndex(wordIndex);
    }
  };

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging || !scrollContainerRef.current) return;

    const container = scrollContainerRef.current;
    const rect = container.getBoundingClientRect();
    const mouseY = e.clientY - rect.top;
    const scrollZone = 50; // pixels from edge to trigger auto-scroll
    const scrollSpeed = 10; // pixels per scroll step

    // Only auto-scroll if mouse is within container bounds
    if (mouseY < 0 || mouseY > rect.height) {
      // Stop auto-scrolling if mouse is outside container
      if (autoScrollIntervalRef.current !== null) {
        clearInterval(autoScrollIntervalRef.current);
        autoScrollIntervalRef.current = null;
      }
      return;
    }

    // Stop any existing auto-scroll
    if (autoScrollIntervalRef.current !== null) {
      clearInterval(autoScrollIntervalRef.current);
      autoScrollIntervalRef.current = null;
    }

    // Check if mouse is in the bottom scroll zone
    if (mouseY > rect.height - scrollZone) {
      autoScrollIntervalRef.current = window.setInterval(() => {
        if (scrollContainerRef.current) {
          const maxScroll = scrollContainerRef.current.scrollHeight - scrollContainerRef.current.clientHeight;
          if (scrollContainerRef.current.scrollTop < maxScroll) {
            scrollContainerRef.current.scrollTop = Math.min(
              scrollContainerRef.current.scrollTop + scrollSpeed,
              maxScroll
            );
          } else {
            if (autoScrollIntervalRef.current !== null) {
              clearInterval(autoScrollIntervalRef.current);
              autoScrollIntervalRef.current = null;
            }
          }
        }
      }, 16); // ~60fps
    }
    // Check if mouse is in the top scroll zone
    else if (mouseY < scrollZone) {
      autoScrollIntervalRef.current = window.setInterval(() => {
        if (scrollContainerRef.current) {
          if (scrollContainerRef.current.scrollTop > 0) {
            scrollContainerRef.current.scrollTop = Math.max(
              scrollContainerRef.current.scrollTop - scrollSpeed,
              0
            );
          } else {
            if (autoScrollIntervalRef.current !== null) {
              clearInterval(autoScrollIntervalRef.current);
              autoScrollIntervalRef.current = null;
            }
          }
        }
      }, 16); // ~60fps
    }
  }, [isDragging]);

  const handleMouseUp = useCallback(() => {
    // Stop auto-scrolling
    if (autoScrollIntervalRef.current !== null) {
      clearInterval(autoScrollIntervalRef.current);
      autoScrollIntervalRef.current = null;
    }

    if (isDragging && dragStartIndex !== null && dragCurrentIndex !== null) {
      const start = Math.min(dragStartIndex, dragCurrentIndex);
      const end = Math.max(dragStartIndex, dragCurrentIndex);
      
      // Determine if we should highlight or unhighlight based on the majority state
      const range: number[] = [];
      for (let i = start; i <= end; i++) {
        range.push(i);
      }
      
      setHighlightedWords((prev) => {
        const allHighlighted = range.every(idx => prev.has(idx));
        const newSet = new Set(prev);
        for (let i = start; i <= end; i++) {
          if (allHighlighted) {
            newSet.delete(i);
          } else {
            newSet.add(i);
          }
        }
        return newSet;
      });
    }
    
    setIsDragging(false);
    setDragStartIndex(null);
    setDragCurrentIndex(null);
  }, [isDragging, dragStartIndex, dragCurrentIndex]);

  // Set up document-level mouse listeners when dragging
  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (autoScrollIntervalRef.current !== null) {
        clearInterval(autoScrollIntervalRef.current);
      }
    };
  }, []);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;

    // Always calculate and show PHI score when submit is pressed
    const result = calculatePHIScore(highlightedWords, wordIndexToWordMap);
    
    // Set score result and show modal immediately
    setScoreResult(result);
    setShowResultsModal(true);

    // Only send message if there's input
    if (input.trim()) {
      const userMessage: Message = {
        id: Date.now().toString(),
        role: 'user',
        content: input.trim(),
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, userMessage]);
      setInput('');
      setIsLoading(true);

      // Simulate AI response (in a real scenario, this would call an API)
      setTimeout(() => {
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: 'I understand you\'re asking about healthcare information. How can I help you?',
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, assistantMessage]);
        setIsLoading(false);
      }, 1000);
    }
  };

  return (
    <>
      {scoreResult && (
        <ResultsModal
          isOpen={showResultsModal}
          onClose={() => {
            setShowResultsModal(false);
            setScoreResult(null);
          }}
          result={scoreResult}
        />
      )}
      <div className="flex flex-col h-full bg-white">
      {/* Chat Header */}
      <div className="border-b border-gray-200 px-6 py-4 bg-white">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">AI Assistant</h2>
            <p className="text-xs text-gray-500">Healthcare Education Chat</p>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {message.role === 'assistant' && (
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                <Bot className="w-5 h-5 text-white" />
              </div>
            )}
            <div
              className={`max-w-[80%] rounded-lg px-4 py-3 ${
                message.role === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-900'
              }`}
            >
              <p className="text-sm whitespace-pre-wrap">{message.content}</p>
              <p className={`text-xs mt-1 ${message.role === 'user' ? 'text-blue-100' : 'text-gray-500'}`}>
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
            {message.role === 'user' && (
              <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center flex-shrink-0">
                <User className="w-5 h-5 text-gray-600" />
              </div>
            )}
          </div>
        ))}
        {isLoading && (
          <div className="flex gap-3 justify-start">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div className="bg-gray-100 rounded-lg px-4 py-3">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="px-3 md:px-6 py-3 bg-white">
        <form onSubmit={handleSend} className="flex items-end gap-3 max-w-3xl mx-auto">
          <div className="flex-1 relative">
            <div 
              ref={scrollContainerRef}
              className="min-h-[52px] max-h-[200px] overflow-y-auto px-3 py-2.5 border border-gray-300 rounded-2xl bg-white focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent"
              style={{ scrollbarWidth: 'thin' }}
              onMouseLeave={handleMouseUp}
            >
              <div 
                ref={containerRef}
                className="text-base leading-relaxed text-gray-900 select-none"
                onMouseUp={handleMouseUp}
              >
                {wordsWithSpaces.map((part, index) => {
                  if (part.isSpace) {
                    // Check if this space is between two consecutive highlighted words
                    const prevPart = index > 0 ? wordsWithSpaces[index - 1] : null;
                    const nextPart = index < wordsWithSpaces.length - 1 ? wordsWithSpaces[index + 1] : null;
                    const prevWordIndex = prevPart && !prevPart.isSpace ? prevPart.wordIndex : -1;
                    const nextWordIndex = nextPart && !nextPart.isSpace ? nextPart.wordIndex : -1;
                    const areConsecutive = prevWordIndex !== -1 && nextWordIndex !== -1 && nextWordIndex === prevWordIndex + 1;
                    
                    const prevHighlighted = prevWordIndex !== -1 && highlightedWords.has(prevWordIndex);
                    const nextHighlighted = nextWordIndex !== -1 && highlightedWords.has(nextWordIndex);
                    const prevInDrag = prevWordIndex !== -1 && isDragging && dragStartIndex !== null && dragCurrentIndex !== null &&
                      prevWordIndex >= Math.min(dragStartIndex, dragCurrentIndex) &&
                      prevWordIndex <= Math.max(dragStartIndex, dragCurrentIndex);
                    const nextInDrag = nextWordIndex !== -1 && isDragging && dragStartIndex !== null && dragCurrentIndex !== null &&
                      nextWordIndex >= Math.min(dragStartIndex, dragCurrentIndex) &&
                      nextWordIndex <= Math.max(dragStartIndex, dragCurrentIndex);
                    
                    // Space should be highlighted if between two highlighted words
                    const betweenHighlighted = areConsecutive && prevHighlighted && nextHighlighted;
                    // Space should show drag preview if between two words in drag range (but not yet highlighted)
                    const betweenDragPreview = areConsecutive && prevInDrag && nextInDrag && !prevHighlighted && !nextHighlighted;
                    
                    return (
                      <span
                        key={index}
                        className={
                          betweenHighlighted
                            ? 'bg-red-200'
                            : betweenDragPreview
                            ? 'bg-red-100'
                            : ''
                        }
                      >
                        {part.text}
                      </span>
                    );
                  }
                  
                  const isHighlighted = highlightedWords.has(part.wordIndex);
                  const isInDragRange = isDragging && dragStartIndex !== null && dragCurrentIndex !== null &&
                    part.wordIndex >= Math.min(dragStartIndex, dragCurrentIndex) &&
                    part.wordIndex <= Math.max(dragStartIndex, dragCurrentIndex);
                  const isOnlyDragPreview = isInDragRange && !isHighlighted;
                  
                  return (
                    <span
                      key={index}
                      onMouseDown={(e) => handleWordMouseDown(part.wordIndex, e)}
                      onMouseEnter={() => handleWordMouseEnter(part.wordIndex)}
                      className={`cursor-pointer ${
                        isHighlighted
                          ? 'bg-red-200'
                          : isOnlyDragPreview
                          ? 'bg-red-100'
                          : ''
                      }`}
                    >
                      {part.text}
                    </span>
                  );
                })}
              </div>
            </div>
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="mb-0.5 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center shrink-0"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
    </>
  );
}

