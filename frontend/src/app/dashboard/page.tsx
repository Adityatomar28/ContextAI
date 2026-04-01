"use client";

import { useState, useRef, useEffect } from "react";
import { User, Bot, Send, Paperclip, Loader2, FileText, CheckCircle, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";

export default function Dashboard() {
  const [messages, setMessages] = useState<{ role: "human" | "system", content: string }[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messages.length > 0 && scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, loading]);

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const token = localStorage.getItem("token");
      await axios.post((process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000") + "/api/v1/upload", formData, {
        headers: { 
          "Content-Type": "multipart/form-data",
          "Authorization": `Bearer ${token}`
        }
      });
      setMessages(prev => [...prev, { role: "system", content: `Successfully processed ${file.name}. Your document is now fully vectorized and ready for querying!` }]);
    } catch (err: any) {
      console.error(err);
      setMessages(prev => [...prev, { role: "system", content: "Failed to upload document. Is the backend running?" }]);
    } finally {
      setUploading(false);
      setFile(null);
      setIsUploadOpen(false);
    }
  };

  const handleChat = async (e?: React.FormEvent, presetQuery?: string) => {
    if (e) e.preventDefault();
    const q = presetQuery || query;
    if (!q.trim()) return;

    const newMsgs = [...messages, { role: "human" as const, content: q }];
    setMessages(newMsgs);
    setQuery("");
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      const res = await axios.post((process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000") + "/api/v1/chat", 
        { query: q, history: [] }, 
        { headers: { "Authorization": `Bearer ${token}` }}
      );
      setMessages([...newMsgs, { role: "system", content: res.data.reply }]);
    } catch (err) {
      setMessages([...newMsgs, { role: "system", content: "Error communicating with knowledge base. Assure Mistral backend is online." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-transparent relative">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/10 via-slate-950 to-slate-950 pointer-events-none" />

      {/* Header */}
      <header className="h-24 flex items-center justify-between px-10 border-b border-white/5 bg-transparent backdrop-blur-md z-20 w-full relative">
        <div className="absolute bottom-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        
        <div className="flex items-center gap-4">
          <h2 className="text-2xl font-bold text-white tracking-tight drop-shadow-md">AI Assitant</h2>
          <span className="px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs font-semibold tracking-wide text-emerald-400 flex items-center gap-2 shadow-[0_0_15px_rgba(16,185,129,0.1)]">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse box-shadow-glow" /> 
            Live Context
          </span>
        </div>
        
        <Dialog open={isUploadOpen} onOpenChange={setIsUploadOpen}>
          <DialogTrigger className="inline-flex items-center justify-center whitespace-nowrap text-sm border border-blue-500/30 text-blue-300 hover:bg-blue-500/10 hover:text-white rounded-xl h-11 px-6 shadow-lg shadow-blue-900/20 transition-all font-medium">
            <Paperclip className="w-4 h-4 mr-2" />
            Upload Source
          </DialogTrigger>
          <DialogContent className="bg-[#0f1525] text-white border-white/10 max-w-md rounded-2xl glass shadow-2xl p-0 overflow-hidden">
            <div className="h-2 bg-gradient-to-r from-blue-500 to-indigo-600 w-full" />
            <div className="p-6">
              <DialogHeader className="mb-6">
                <DialogTitle className="text-2xl font-semibold">Upload PDF Document</DialogTitle>
              </DialogHeader>
              <div className="p-8 border-2 border-dashed border-slate-700/60 rounded-xl flex flex-col items-center justify-center space-y-4 hover:border-blue-500/50 hover:bg-white/5 transition-all bg-black/20 group">
                <input 
                  type="file" 
                  accept=".pdf" 
                  className="hidden" 
                  id="file-upload" 
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                />
                <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center w-full h-full">
                  <div className="p-4 rounded-full bg-blue-500/10 mb-4 group-hover:scale-110 transition-transform">
                    {file ? <CheckCircle className="w-10 h-10 text-emerald-400" /> : <FileText className="w-10 h-10 text-blue-400" />}
                  </div>
                  <span className="text-white font-medium text-lg">{file ? file.name : "Select Document"}</span>
                  <span className="text-slate-500 text-sm mt-2">Maximum size 50MB</span>
                </label>
              </div>
              {file && (
                <Button onClick={handleUpload} disabled={uploading} className="w-full mt-6 h-12 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-medium text-16">
                  {uploading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Process & Embed"}
                </Button>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </header>

      {/* Chat Area */}
      <ScrollArea className="flex-1 px-4 sm:px-10 relative z-10 w-full overflow-hidden">
        <div className="max-w-4xl mx-auto py-8 space-y-8 pb-40">
          
          <AnimatePresence>
            {messages.length === 0 && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, filter: "blur(10px)", transition: { duration: 0.2 } }}
                className="py-20 flex flex-col items-center justify-center text-center h-full"
              >
                <div className="relative mb-8">
                  <div className="absolute inset-0 bg-blue-500 blur-3xl opacity-20" />
                  <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-blue-500/20 to-indigo-600/20 border border-blue-400/30 flex items-center justify-center shadow-2xl relative z-10 box-glass">
                    <Bot className="w-12 h-12 text-blue-300 drop-shadow-[0_0_15px_rgba(96,165,250,0.5)]" />
                  </div>
                </div>
                <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-white/70 tracking-tight mb-4">
                  How can I help you today?
                </h1>
                <p className="text-lg text-blue-200/50 max-w-lg mb-12 font-medium">
                  Upload a PDF using the button above and select a prompt below to jumpstart your analysis.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-2xl">
                  {["Summarize the latest document", "Extract key metrics and KPIs", "Explain technical concepts", "Generate executive briefing"].map((suggestion, i) => (
                    <button key={i} onClick={() => handleChat(undefined, suggestion)} className="text-left p-4 sm:p-5 rounded-2xl border border-white/5 bg-white/[0.03] hover:bg-white/10 hover:border-blue-500/30 transition-all flex justify-between items-center group shadow-lg">
                      <span className="text-sm font-medium text-slate-300 group-hover:text-white transition-colors">{suggestion}</span>
                      <div className="w-8 h-8 rounded-full bg-black/20 flex items-center justify-center group-hover:bg-blue-600/20 transition-colors">
                        <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-blue-400 transform group-hover:translate-x-0.5 transition-all" />
                      </div>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {messages.map((msg, i) => (
            <motion.div 
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ ease: "easeOut", duration: 0.3 }}
              key={i} 
              className={`flex gap-4 sm:gap-6 ${msg.role === "human" ? "flex-row-reverse" : ""}`}
            >
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-lg relative ${msg.role === "human" ? "bg-gradient-to-br from-blue-500 to-indigo-600 shadow-blue-500/20 border border-white/10" : "bg-gradient-to-br from-slate-800 to-slate-900 shadow-black/50 border border-slate-700/50"}`}>
                {msg.role === "human" ? <User className="w-6 h-6 text-white drop-shadow-md" /> : <Bot className="w-6 h-6 text-emerald-400 drop-shadow-[0_0_10px_rgba(52,211,153,0.3)]" />}
              </div>
              <div className={`max-w-[85%] sm:max-w-[75%] p-5 sm:p-6 text-base leading-relaxed ${
                msg.role === "human" 
                  ? "bg-gradient-to-br from-blue-600/20 to-blue-900/20 text-blue-50 border border-blue-500/20 rounded-[2rem] rounded-tr-sm shadow-xl" 
                  : "bg-black/20 text-slate-200 border border-white/5 rounded-[2rem] rounded-tl-sm shadow-xl backdrop-blur-md"
              }`}>
                <p className="whitespace-pre-wrap font-medium">{msg.content}</p>
              </div>
            </motion.div>
          ))}
          {loading && (
             <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex gap-6">
               <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 shadow-black/50 border border-slate-700/50 flex items-center justify-center shrink-0">
                  <Bot className="w-6 h-6 text-emerald-400 relative z-10" />
               </div>
               <div className="bg-black/20 p-5 rounded-[2rem] rounded-tl-sm border border-white/5 flex items-center gap-3 shadow-xl backdrop-blur-md">
                 <div className="flex gap-1">
                   <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
                   <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
                   <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" />
                 </div>
                 <span className="text-slate-400 text-sm font-medium ml-2">Analyzing embeddings...</span>
               </div>
             </motion.div>
          )}
          <div ref={scrollRef} className="h-4" />
        </div>
      </ScrollArea>

      {/* Floating Input Box */}
      <div className="absolute bottom-6 inset-x-0 px-4 sm:px-10 z-30 pointer-events-none">
        <div className="max-w-3xl mx-auto pointer-events-auto">
          <form onSubmit={(e) => handleChat(e)} className="bg-slate-900/60 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-[0_0_40px_rgba(0,0,0,0.5)] p-2 flex gap-2 relative transition-all focus-within:border-blue-500/30 focus-within:bg-slate-900/80">
            <Input 
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              disabled={loading}
              placeholder="Query your uploaded documents..." 
              className="flex-1 bg-transparent border-0 text-white placeholder:text-slate-500 h-14 pl-4 rounded-xl focus-visible:ring-0 focus-visible:ring-offset-0 text-lg shadow-none"
            />
            <Button 
              type="submit" 
              disabled={loading || !query.trim()} 
              className="h-14 w-14 rounded-xl bg-blue-600 hover:bg-blue-500 text-white transition-all shadow-lg shadow-blue-900/50 disabled:opacity-50 disabled:shadow-none"
            >
              <Send className="w-6 h-6 translate-x-[2px] -translate-y-[2px]" />
            </Button>
          </form>
          <div className="text-center mt-3">
             <span className="text-[11px] text-slate-500 font-medium tracking-wide">Context-AI can make mistakes. Consider verifying important information.</span>
          </div>
        </div>
      </div>
    </div>
  );
}
