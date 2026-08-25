import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Send, Bot, User, Loader2, MessageSquare } from 'lucide-react';
import { GoogleGenAI } from '@google/genai';

// Lazy initialization to prevent app crash on load if API key is missing
let aiClient: GoogleGenAI | null = null;
function getAIClient() {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.error("GEMINI_API_KEY is missing. Chatbot will not function.");
      return null;
    }
    aiClient = new GoogleGenAI({ apiKey });
  }
  return aiClient;
}

interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
}

export function Chatbot({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', role: 'model', text: 'Hi there! I can help answer any questions about our Static Glazing installation process, pricing, or designs. How can I help you today?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg: Message = { id: Date.now().toString(), role: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const client = getAIClient();
      if (!client) {
        throw new Error("API key is missing. Please configure GEMINI_API_KEY in Vercel.");
      }

      // Build chat history for context
      const chat = client.chats.create({
        model: 'gemini-3.1-pro-preview',
        config: {
          systemInstruction: "You are a helpful customer support assistant for Brightside, a company that provides Static Glazing installation (window privacy film). You answer questions about pricing, designs, and the installation process. Be concise, friendly, and helpful. The app allows users to get a precision quote by entering window dimensions and selecting a design.",
        }
      });

      // Send previous messages to establish context (excluding the initial greeting if needed, or just send the latest)
      // For simplicity, we'll just send the current message, but ideally we'd use the chat session.
      // Since ai.chats.create creates a new session, we should ideally maintain the chat instance,
      // but recreating it and sending the history is also possible.
      // Let's just send the current message for now, or we can use generateContent with history.
      
      const response = await chat.sendMessage({ message: userMsg.text });
      
      const modelMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: response.text || 'I am sorry, I could not process that request.'
      };
      
      setMessages(prev => [...prev, modelMsg]);
    } catch (error) {
      console.error("Chat error:", error);
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: 'Sorry, I encountered an error. Please try again later.'
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className="fixed bottom-4 right-4 w-[350px] max-w-[calc(100vw-2rem)] h-[500px] max-h-[calc(100vh-2rem)] bg-surface-bg border border-surface-highest rounded-2xl shadow-2xl flex flex-col z-50 overflow-hidden"
        >
          {/* Header */}
          <div className="bg-surface-low p-4 border-b border-surface-highest flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-brand-lime flex items-center justify-center text-black">
                <Bot size={18} />
              </div>
              <div>
                <h3 className="font-headline font-bold text-sm text-text-main">Brightside Assistant</h3>
                <p className="text-[10px] text-brand-lime">Online</p>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-surface-highest rounded-full transition-colors text-text-muted hover:text-text-main"
            >
              <X size={18} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-surface-bg/50">
            {messages.map((msg) => (
              <div 
                key={msg.id} 
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex gap-2 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-1 ${
                    msg.role === 'user' ? 'bg-surface-highest text-text-muted' : 'bg-brand-lime text-black'
                  }`}>
                    {msg.role === 'user' ? <User size={12} /> : <Bot size={12} />}
                  </div>
                  <div className={`p-3 rounded-2xl text-sm ${
                    msg.role === 'user' 
                      ? 'bg-surface-highest text-text-main rounded-tr-sm' 
                      : 'bg-surface-low border border-surface-highest text-text-main rounded-tl-sm'
                  }`}>
                    {msg.text}
                  </div>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="flex gap-2 max-w-[85%]">
                  <div className="w-6 h-6 rounded-full bg-brand-lime text-black flex items-center justify-center shrink-0 mt-1">
                    <Bot size={12} />
                  </div>
                  <div className="p-3 rounded-2xl text-sm bg-surface-low border border-surface-highest text-text-main rounded-tl-sm flex items-center gap-2">
                    <Loader2 size={14} className="animate-spin text-brand-lime" />
                    <span className="text-text-muted text-xs">Typing...</span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-3 border-t border-surface-highest bg-surface-low">
            <div className="flex items-center gap-2 bg-surface-bg border border-surface-highest rounded-full p-1 pl-4">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Type your message..."
                className="flex-1 bg-transparent border-none outline-none text-sm text-text-main placeholder:text-text-muted"
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                className="w-8 h-8 rounded-full bg-brand-lime text-black flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#b4cf52] transition-colors shrink-0"
              >
                <Send size={14} className="ml-0.5" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
