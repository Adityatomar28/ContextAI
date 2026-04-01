"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";
import axios from "axios";
import { BookOpen, ArrowRight, Loader2, Sparkles } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const formData = new URLSearchParams();
      formData.append("username", email);
      formData.append("password", password);
      
      const res = await axios.post((process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000") + "/api/v1/auth/login", formData, {
        headers: { "Content-Type": "application/x-www-form-urlencoded" }
      });
      localStorage.setItem("token", res.data.access_token);
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.response?.data?.detail || "Failed to login. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-[#030712] relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full bg-blue-900/20 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] rounded-full bg-indigo-900/20 blur-[120px] pointer-events-none" />
      <div className="absolute top-[40%] left-[30%] w-[30%] h-[30%] rounded-full bg-blue-500/10 blur-[100px] pointer-events-none" />

      {/* Left Pane - Branding & Graphic */}
      <div className="hidden lg:flex w-1/2 relative z-10 p-12 flex-col justify-between border-r border-white/5 bg-black/20 backdrop-blur-sm shadow-[20px_0_40px_-5px_rgba(0,0,0,0.3)]">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-lg shadow-blue-500/20 border border-white/10">
            <BookOpen className="w-8 h-8 text-white" />
          </div>
          <span className="font-extrabold text-3xl tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-white/70">Context-AI</span>
        </div>
        
        <div className="max-w-xl space-y-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-300 text-sm font-semibold tracking-wide">
            <Sparkles className="w-4 h-4" />
            Premium RAG Technology
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="text-5xl md:text-6xl font-bold text-white tracking-tight leading-tight">
            Query your intelligence base at <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">warp speed.</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="text-xl text-blue-200/60 leading-relaxed font-light">
            Upload vast libraries of documents and let our advanced AI embeddings uncover the insights you need in milliseconds.
          </motion.p>
        </div>

        <div className="text-sm text-slate-500 font-medium">
          © 2026 Context-AI. Built for enterprise productivity.
        </div>
      </div>

      {/* Right Pane - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 relative z-10">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4 }} className="w-full max-w-md">
          <div className="mb-12 text-center lg:hidden">
             <div className="flex items-center justify-center gap-3 mb-6">
                <div className="p-2.5 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg shadow-blue-500/20">
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
                <span className="font-bold text-2xl tracking-tight text-white">Context-AI</span>
             </div>
             <h2 className="text-2xl font-semibold text-white">Welcome back</h2>
          </div>
          
          <div className="hidden lg:block mb-10">
            <h2 className="text-3xl font-bold text-white mb-2 tracking-tight">Welcome back</h2>
            <p className="text-blue-200/60">Enter your credentials to access your workspace.</p>
          </div>

          <div className="bg-white/[0.03] border border-white/5 p-8 sm:p-10 rounded-[2rem] shadow-2xl backdrop-blur-xl relative overflow-hidden">
             {/* Subtle gradient border inside card */}
             <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />
             
             <form onSubmit={handleLogin} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-slate-300 text-sm font-medium">Email Address</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    required 
                    className="bg-black/20 border-white/10 text-white placeholder:text-slate-600 h-14 px-4 rounded-xl focus-visible:ring-blue-500/50 transition-all font-medium"
                    placeholder="you@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password" className="text-slate-300 text-sm font-medium">Password</Label>
                    <Link href="/forgot-password" className="text-sm font-medium text-blue-400 hover:text-blue-300 transition-colors">
                      Forgot?
                    </Link>
                  </div>
                  <Input 
                    id="password" 
                    type="password" 
                    required 
                    className="bg-black/20 border-white/10 text-white focus-visible:ring-blue-500/50 h-14 px-4 rounded-xl transition-all font-medium"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                
                {error && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm font-medium flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
                    {error}
                  </motion.div>
                )}

                <Button type="submit" className="w-full bg-gradient-to-br from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white h-14 rounded-xl shadow-[0_0_20px_rgba(37,99,235,0.2)] transition-all font-semibold text-base mt-2" disabled={loading}>
                  {loading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : null}
                  {loading ? "Authenticating..." : "Sign In to Workspace"}
                  {!loading && <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1" />}
                </Button>
             </form>
          </div>

          <div className="mt-8 text-center">
            <p className="text-sm text-blue-200/60 font-medium">
              Don't have an account yet?{" "}
              <Link href="/signup" className="text-blue-400 hover:text-blue-300 transition-colors font-semibold">
                Request Access
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
