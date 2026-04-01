"use client";

import { motion } from "framer-motion";
import { ArrowRight, BookOpen, Layers, Zap, Sparkles } from "lucide-react";
import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="min-h-screen w-full bg-[#030712] flex flex-col relative overflow-x-hidden selection:bg-blue-500/30">
      {/* Premium Background Effects */}
      <div className="absolute top-[-20%] left-[-10%] w-[800px] h-[800px] rounded-full bg-blue-900/20 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[800px] h-[800px] rounded-full bg-emerald-900/20 blur-[120px] pointer-events-none" />
      <div className="absolute top-[30%] left-[40%] w-[600px] h-[600px] rounded-full bg-indigo-500/10 blur-[100px] pointer-events-none" />

      {/* Navbar overlay */}
      <nav className="absolute top-0 w-full p-6 flex justify-between items-center z-50 border-b border-white/5 bg-black/10 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg shadow-blue-500/20 border border-white/10">
            <BookOpen className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-white/70">Context-AI</span>
        </div>
        <div className="flex gap-6 items-center">
          <a href="#features" className="text-slate-300 hover:text-white font-medium transition-colors hidden sm:block">
            Features
          </a>
          <Link 
            href="/login"
            className="inline-flex items-center justify-center font-semibold text-sm h-10 px-5 rounded-full bg-white/5 hover:bg-white/10 text-white border border-white/10 backdrop-blur-md transition-all hover:scale-105"
          >
            Sign In
          </Link>
          <Link 
            href="/signup"
            className="hidden sm:inline-flex items-center justify-center font-semibold text-sm h-10 px-5 rounded-full bg-blue-600 hover:bg-blue-500 text-white shadow-[0_0_20px_rgba(37,99,235,0.3)] transition-all hover:scale-105"
          >
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 text-center z-10 pt-32 pb-20 relative min-h-screen">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay pointer-events-none"></div>
        
        <div className="max-w-5xl space-y-8 relative z-10 animate-in fade-in duration-1000 slide-in-from-bottom-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-300 text-sm font-semibold tracking-wide mb-4 shadow-[0_0_15px_rgba(59,130,246,0.15)] animate-bounce">
             <Sparkles className="w-4 h-4" />
             Next-Gen Document Intelligence
          </div>
          <h1 className="text-6xl md:text-8xl font-extrabold text-white tracking-tighter drop-shadow-2xl leading-[1.1]">
            Chat with your <br className="hidden md:block" /> documents{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-emerald-400">
              using AI
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-slate-300 max-w-3xl mx-auto drop-shadow-md font-light leading-relaxed">
            Context-AI is your ultimate knowledge assistant. Upload impenetrable PDFs and let our advanced RAG models give you precise, context-aware answers in seconds.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
            <Link 
              href="/signup"
              className="inline-flex items-center justify-center w-full sm:w-auto text-lg h-14 px-8 bg-white text-black hover:bg-slate-200 shadow-[0_0_30px_rgba(255,255,255,0.3)] transition-all hover:scale-105 rounded-full font-bold group"
            >
              Start for Free
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link 
              href="/dashboard"
              className="inline-flex items-center justify-center w-full sm:w-auto text-lg h-14 px-8 border border-white/10 text-white hover:bg-white/5 hover:border-white/20 backdrop-blur-md transition-all hover:scale-105 rounded-full glass font-semibold"
            >
              Enter Dashboard
            </Link>
          </div>
        </div>

        {/* Floating Feature Cards */}
        <div id="features" className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-32 max-w-6xl w-full px-4 scroll-mt-32">
          {[
            { icon: <BookOpen className="w-6 h-6 text-blue-400" />, title: "Instant Chat", desc: "Instantly chat with your textbooks, research papers, and complex technical manuals in human language." },
            { icon: <Layers className="w-6 h-6 text-indigo-400" />, title: "Context-Aware", desc: "Retrieval Augmented Generation ensures responses are grounded only in the truth of your documents." },
            { icon: <Zap className="w-6 h-6 text-emerald-400" />, title: "Lightning Fast", desc: "Find exactly what you need in milliseconds using state-of-the-art vector embeddings." }
          ].map((feature, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -10, scale: 1.02 }}
              className="bg-white/[0.02] border border-white/5 p-8 rounded-[2rem] flex flex-col items-center text-center space-y-5 group hover:bg-white/[0.04] hover:border-white/10 transition-all shadow-2xl relative overflow-hidden backdrop-blur-sm"
            >
              <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent group-hover:via-white/30 transition-colors" />
              <div className="p-4 bg-black/40 rounded-2xl group-hover:bg-black/60 group-hover:scale-110 transition-all shadow-inner border border-white/5">
                {feature.icon}
              </div>
              <h3 className="text-2xl font-bold text-white tracking-tight">{feature.title}</h3>
              <p className="text-slate-400 leading-relaxed">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="z-10 w-full pt-16 pb-8 border-t border-white/5 bg-black/40 backdrop-blur-xl relative mt-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            <div className="space-y-6 col-span-1 md:col-span-2">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg border border-white/10">
                  <BookOpen className="w-5 h-5 text-white" />
                </div>
                <span className="text-2xl font-bold tracking-tight text-white">Context-AI</span>
              </div>
              <p className="text-slate-400 max-w-md text-sm leading-relaxed">
                Transforming the way you interact with human knowledge. Upload, query, and extract insights from your entire document library with advanced RAG AI technology.
              </p>
            </div>
            
            <div className="space-y-4">
              <h4 className="text-white font-semibold mb-4">Connect</h4>
              <ul className="space-y-4 text-sm text-slate-400">
                <li>
                  <a href="https://linkedin.com/in/aditya-singh-tomar-1683a3279" target="_blank" className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-500/10 hover:bg-blue-500/20 text-blue-300 font-bold tracking-wide transition-all hover:scale-105 border border-blue-500/20 shadow-lg shadow-blue-500/10">
                    LinkedIn <ArrowRight className="w-4 h-4 ml-1" />
                  </a>
                </li>
                <li>
                  <a href="mailto:adityasinghtomar" className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 font-bold tracking-wide transition-all hover:scale-105 border border-indigo-500/20 shadow-lg shadow-indigo-500/10">
                    Email <ArrowRight className="w-4 h-4 ml-1" />
                  </a>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-500 font-medium">
            <div>
              © 2026 Context-AI. Developedby Aditya Singh Tomar. All rights reserved.
            </div>
            <div className="flex gap-6">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
