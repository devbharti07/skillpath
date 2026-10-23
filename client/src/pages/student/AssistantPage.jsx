import React, { useState, useEffect, useRef } from 'react';
import api from '../../services/api.js';
import {
  Bot,
  Send,
  Sparkles,
  Trash2,
  User,
  Shield,
  HelpCircle,
  Lightbulb,
  ArrowRight
} from 'lucide-react';

export default function AssistantPage() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const messagesEndRef = useRef(null);

  const loadHistory = async () => {
    try {
      setInitialLoading(true);
      const history = await api.getAssistantHistory();
      if (history && history.length > 0) {
        setMessages(history);
      } else {
        // Welcome message
        setMessages([
          {
            id: 'welcome',
            role: 'ASSISTANT',
            content: `Hello! I am your SkillPath Career & Skill Assistant.

I can help you:
• Compare career pathways (e.g. Frontend vs Backend)
• Identify missing prerequisites for your goals
• Recommend your next study steps based on your active roadmaps
• Suggest portfolio project ideas that stand out to recruiters

What would you like to explore today?`,
            source: 'SkillPath Intelligent Guidance Engine'
          }
        ]);
      }
    } catch (err) {
      console.error('Failed to load chat history:', err);
    } finally {
      setInitialLoading(false);
    }
  };

  useEffect(() => {
    loadHistory();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSend = async (messageToSend) => {
    const text = messageToSend || input;
    if (!text || !text.trim() || loading) return;

    const userMsg = {
      id: `temp-${Date.now()}`,
      role: 'USER',
      content: text.trim()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await api.chatWithAssistant(text.trim());
      const botMsg = {
        id: `bot-${Date.now()}`,
        role: 'ASSISTANT',
        content: res.message,
        source: res.source
      };
      setMessages(prev => [...prev, botMsg]);
    } catch (err) {
      setMessages(prev => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          role: 'ASSISTANT',
          content: 'I encountered an error processing your request. Please try again shortly.',
          isError: true
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = async () => {
    if (!window.confirm('Clear conversation history?')) return;
    try {
      await api.clearAssistantHistory();
      loadHistory();
    } catch (err) {
      console.error('Failed to clear history:', err);
    }
  };

  const quickPrompts = [
    'Compare Frontend and Backend paths',
    'Recommend my next learning step',
    'Suggest portfolio project ideas',
    'What are the prerequisites for AI/ML?'
  ];

  return (
    <div className="max-w-4xl mx-auto flex flex-col h-[82vh] space-y-4">
      {/* Header */}
      <div className="glass-card p-4 rounded-2xl flex items-center justify-between border border-borderBase-light dark:border-borderBase-dark flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary to-secondary flex items-center justify-center text-white shadow-md">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-extrabold text-base text-textMain-light dark:text-textMain-dark">
                AI Career Assistant
              </h1>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-primary-100 text-primary-800 dark:bg-primary-950 dark:text-primary-300">
                Active Guidance
              </span>
            </div>
            <p className="text-[11px] text-textMuted-light dark:text-textMuted-dark">
              Calibrated with your verified profile data & roadmaps
            </p>
          </div>
        </div>

        <button
          onClick={handleClear}
          title="Clear chat history"
          className="p-2 rounded-xl text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {/* Messages Stream */}
      <div className="flex-1 glass-card p-4 sm:p-6 rounded-3xl overflow-y-auto space-y-4 border border-borderBase-light dark:border-borderBase-dark">
        {initialLoading ? (
          <div className="py-20 text-center text-xs text-textMuted-light dark:text-textMuted-dark">
            Loading assistant session...
          </div>
        ) : (
          messages.map((msg) => {
            const isUser = msg.role === 'USER';
            return (
              <div
                key={msg.id}
                className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
              >
                {!isUser && (
                  <div className="w-8 h-8 rounded-xl bg-primary-100 dark:bg-primary-950 text-primary flex items-center justify-center flex-shrink-0 mt-1">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div
                  className={`max-w-[85%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed ${
                    isUser
                      ? 'bg-primary text-white font-medium shadow-sm'
                      : 'bg-slate-50 dark:bg-slate-800/80 text-textMain-light dark:text-textMain-dark border border-slate-200 dark:border-slate-700'
                  }`}
                >
                  <div className="whitespace-pre-wrap">{msg.content}</div>

                  {!isUser && msg.source && (
                    <div className="mt-3 pt-2 border-t border-slate-200/60 dark:border-slate-700/60 text-[10px] text-textMuted-light dark:text-textMuted-dark flex items-center justify-between">
                      <span className="font-semibold text-primary">{msg.source}</span>
                      <span>Educational guidance</span>
                    </div>
                  )}
                </div>

                {isUser && (
                  <div className="w-8 h-8 rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 flex items-center justify-center flex-shrink-0 mt-1 text-xs font-bold">
                    You
                  </div>
                )}
              </div>
            );
          })
        )}

        {loading && (
          <div className="flex gap-3 justify-start">
            <div className="w-8 h-8 rounded-xl bg-primary-100 dark:bg-primary-950 text-primary flex items-center justify-center flex-shrink-0">
              <Bot className="w-4 h-4" />
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 flex items-center gap-1.5 text-xs text-textMuted-light dark:text-textMuted-dark">
              <span className="inline-block w-2 h-2 rounded-full bg-primary animate-ping" />
              <span>Analyzing recommendations...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Prompt Suggestions */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 flex-shrink-0">
        {quickPrompts.map((qp, i) => (
          <button
            key={i}
            onClick={() => handleSend(qp)}
            disabled={loading}
            className="px-3 py-1.5 rounded-full text-[11px] font-semibold bg-white dark:bg-slate-800 border border-borderBase-light dark:border-borderBase-dark text-textMain-light dark:text-textMain-dark hover:border-primary transition-colors whitespace-nowrap shadow-sm disabled:opacity-50"
          >
            {qp}
          </button>
        ))}
      </div>

      {/* Input Form */}
      <form
        onSubmit={(e) => { e.preventDefault(); handleSend(); }}
        className="flex items-center gap-2 glass-card p-2 rounded-2xl border border-borderBase-light dark:border-borderBase-dark flex-shrink-0"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about careers, missing prerequisites, or next steps..."
          disabled={loading}
          className="flex-1 bg-transparent px-3 py-2 text-xs sm:text-sm text-textMain-light dark:text-textMain-dark focus:outline-none"
        />

        <button
          type="submit"
          disabled={!input.trim() || loading}
          className="p-2.5 rounded-xl bg-primary text-white hover:bg-primary-700 transition-all disabled:opacity-40 shadow-sm"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}
