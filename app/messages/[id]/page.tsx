'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronLeft, 
  Send, 
  MoreVertical, 
  Phone, 
  Info,
  Smile,
  Paperclip,
  CheckCheck
} from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { useAppStore, REGISTERED_PARENTS, REGISTERED_TEACHERS } from '@/lib/store';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function ChatRoomPage() {
  const params = useParams();
  const router = useRouter();
  const contactPhone = params.id as string;
  const { messages, sendMessage, currentUser, userRole } = useAppStore();
  
  const [inputText, setInputText] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  // Find contact details
  const contacts = userRole === 'parent' ? REGISTERED_TEACHERS : REGISTERED_PARENTS;
  const contact = contacts.find(c => c.phone === contactPhone);

  // Filter messages for this specific conversation
  const chatMessages = messages.filter(m => 
    (m.senderId === contactPhone && m.receiverId === currentUser?.phone) ||
    (m.senderId === currentUser?.phone && m.receiverId === contactPhone)
  );

  // Scroll to bottom on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [chatMessages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    sendMessage(inputText, contactPhone);
    setInputText('');
  };

  if (!contact) return null;

  return (
    <div className="h-screen bg-slate-50 flex flex-col overflow-hidden">
      {/* Chat Header */}
      <header className="bg-white px-6 py-4 border-b border-slate-100 flex items-center justify-between shadow-sm shrink-0 z-10">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => router.back()}
            className="p-2 -ml-2 text-slate-400 hover:text-slate-900 transition-colors"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <div className="flex items-center gap-3">
            <div className={cn(
              "w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white shadow-sm",
              userRole === 'parent' ? "bg-teacher" : "bg-parent"
            )}>
              {contact.name.charAt(0)}
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm leading-tight">{contact.name}</h3>
              <p className="text-[10px] text-emerald-500 font-bold uppercase tracking-wider">Online</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button className="p-2 text-slate-400 hover:bg-slate-50 rounded-xl transition-all">
            <Phone className="w-5 h-5" />
          </button>
          <button className="p-2 text-slate-400 hover:bg-slate-50 rounded-xl transition-all">
            <Info className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Messages Area */}
      <main 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-6 space-y-6 scroll-smooth"
      >
        {chatMessages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
            <div className="w-16 h-16 bg-white rounded-3xl shadow-sm flex items-center justify-center text-slate-300">
              <Smile className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-bold text-slate-500">No messages yet</p>
              <p className="text-[10px] text-slate-400">Start the conversation with {contact.name}</p>
            </div>
          </div>
        )}

        {chatMessages.map((msg, idx) => {
          const isMe = msg.senderId === currentUser?.phone;
          
          return (
            <motion.div 
              key={msg.id}
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              className={cn(
                "flex flex-col max-w-[80%]",
                isMe ? "ml-auto items-end" : "mr-auto items-start"
              )}
            >
              <div className={cn(
                "px-5 py-3 rounded-2xl text-sm leading-relaxed shadow-sm",
                isMe 
                  ? "bg-parent text-white rounded-tr-none" 
                  : "bg-white text-slate-700 border border-slate-100 rounded-tl-none"
              )}>
                {msg.text}
              </div>
              <div className="flex items-center gap-1.5 mt-1.5 px-1">
                <span className="text-[9px] font-bold text-slate-400 tracking-wider">
                  {msg.timestamp}
                </span>
                {isMe && <CheckCheck className="w-3 h-3 text-parent" />}
              </div>
            </motion.div>
          );
        })}
      </main>

      {/* Input Area */}
      <footer className="bg-white p-6 border-t border-slate-100 shrink-0">
        <form 
          onSubmit={handleSend}
          className="max-w-4xl mx-auto flex items-center gap-4 bg-slate-50 p-2 rounded-[2rem] border border-slate-200 focus-within:border-parent focus-within:ring-4 focus-within:ring-parent/5 transition-all"
        >
          <button type="button" className="p-3 text-slate-400 hover:text-slate-600 transition-colors">
            <Paperclip className="w-5 h-5" />
          </button>
          <input 
            type="text" 
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Type a message..." 
            className="flex-1 bg-transparent border-none focus:outline-none text-sm font-medium py-2"
          />
          <button 
            type="submit"
            disabled={!inputText.trim()}
            className={cn(
              "w-12 h-12 rounded-full flex items-center justify-center transition-all active:scale-95 shadow-lg",
              inputText.trim() ? "bg-parent text-white shadow-parent/20" : "bg-slate-200 text-slate-400"
            )}
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
        <p className="text-center text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-4">
          End-to-End Encrypted
        </p>
      </footer>
    </div>
  );
}
