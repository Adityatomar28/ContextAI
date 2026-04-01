"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";
import axios from "axios";
import { toast } from "sonner";
import { BookOpen, ArrowRight, Loader2, Zap } from "lucide-react";

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState<"signup" | "verify">("signup");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await axios.post((process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000") + "/api/v1/auth/signup", {
        email,
        password
      });
      toast.success("Verification email sent! Please check your inbox.");
      setStep("verify");
    } catch (err: any) {
      setError(err.response?.data?.detail || "Failed to sign up. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await axios.post((process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000") + "/api/v1/auth/verify-otp", {
        email: email,
        otp: otp
      });
      toast.success("Email verified successfully! You can now log in.");
      router.push("/login");
    } catch (err: any) {
      setError(err.response?.data?.detail || "Invalid or expired OTP.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-row-reverse bg-[#030712] relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-[-20%] left-[40%] w-[60%] h-[60%] rounded-full bg-emerald-900/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[40%] w-[60%] h-[60%] rounded-full bg-teal-900/10 blur-[120px] pointer-events-none" />

      {/* Left Pane (Now Right because of flex-row-reverse) - Branding & Graphic */}
      <div className="hidden lg:flex w-1/2 relative z-10 p-12 flex-col justify-between border-l border-white/5 bg-black/20 backdrop-blur-sm shadow-[-20px_0_40px_-5px_rgba(0,0,0,0.3)]">
        <div className="flex items-center gap-3 self-end">
          <span className="font-extrabold text-3xl tracking-tight text-transparent bg-clip-text bg-gradient-to-l from-white to-white/70">Context-AI</span>
          <div className="p-3 bg-gradient-to-bl from-emerald-500 to-teal-600 rounded-2xl shadow-lg shadow-emerald-500/20 border border-white/10">
            <BookOpen className="w-8 h-8 text-white" />
          </div>
        </div>
        
        <div className="max-w-xl space-y-6 self-start text-right w-full">
          <div className="flex justify-end">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-sm font-semibold tracking-wide">
              Secure Architecture
              <Zap className="w-4 h-4" />
            </motion.div>
          </div>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="text-5xl md:text-6xl font-bold text-white tracking-tight leading-tight">
            Supercharge your <span className="text-transparent bg-clip-text bg-gradient-to-l from-emerald-400 to-teal-400">knowledge.</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="text-xl text-teal-100/60 leading-relaxed font-light mt-4 inline-block max-w-lg">
            Join Context-AI to gain secure, frictionless access to instant document analysis relying on state-of-the-art vector embeddings.
          </motion.p>
        </div>

        <div className="text-sm text-slate-500 font-medium text-right">
          © 2026 Context-AI. Built for enterprise productivity.
        </div>
      </div>

      {/* Right Pane (Now Left) - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 relative z-10">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4 }} className="w-full max-w-md">
          <div className="mb-12 text-center lg:hidden">
             <div className="flex items-center justify-center gap-3 mb-6">
                <div className="p-2.5 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl shadow-lg shadow-emerald-500/20">
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
                <span className="font-bold text-2xl tracking-tight text-white">Context-AI</span>
             </div>
             <h2 className="text-2xl font-semibold text-white">Create Account</h2>
          </div>
          
          <div className="hidden lg:block mb-10 text-left">
            <h2 className="text-3xl font-bold text-white mb-2 tracking-tight">
              {step === "signup" ? "Create Account" : "Verify Email"}
            </h2>
            <p className="text-teal-100/60">
              {step === "signup" ? "Unlock the full power of your document library today." : `We sent a 6-digit code to ${email}`}
            </p>
          </div>

          <div className="bg-white/[0.03] border border-white/5 p-8 sm:p-10 rounded-[2rem] shadow-2xl backdrop-blur-xl relative overflow-hidden">
             {/* Subtle gradient border inside card */}
             <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-l from-transparent via-emerald-500/50 to-transparent" />
             
             {step === "signup" ? (
             <form onSubmit={handleSignup} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-slate-300 text-sm font-medium">Work Email</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    required 
                    className="bg-black/20 border-white/10 text-white placeholder:text-slate-600 h-14 px-4 rounded-xl focus-visible:ring-emerald-500/50 transition-all font-medium"
                    placeholder="you@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-slate-300 text-sm font-medium">Create Password</Label>
                  <Input 
                    id="password" 
                    type="password" 
                    required 
                    className="bg-black/20 border-white/10 text-white focus-visible:ring-emerald-500/50 h-14 px-4 rounded-xl transition-all font-medium"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <p className="text-xs text-slate-500 mt-2 font-medium">Must be at least 8 characters long.</p>
                </div>
                
                {error && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm font-medium flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
                    {error}
                  </motion.div>
                )}

                <Button type="submit" className="w-full bg-gradient-to-bl from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white h-14 rounded-xl shadow-[0_0_20px_rgba(16,185,129,0.2)] transition-all font-semibold text-base mt-2" disabled={loading}>
                  {loading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : null}
                  {loading ? "Provisioning..." : "Create Free Account"}
                  {!loading && <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1" />}
                </Button>
             </form>
             ) : (
             <form onSubmit={handleVerify} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="otp" className="text-slate-300 text-sm font-medium">Verification Code</Label>
                  <Input 
                    id="otp" 
                    type="text" 
                    required 
                    maxLength={6}
                    className="bg-black/20 border-white/10 text-white placeholder:text-slate-600 h-14 px-4 rounded-xl focus-visible:ring-emerald-500/50 transition-all font-medium text-center text-2xl tracking-[0.5em]"
                    placeholder="••••••"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                  />
                  <p className="text-xs text-slate-500 mt-2 font-medium text-center">Check your spam folder if you don't see it.</p>
                </div>
                
                {error && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm font-medium flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
                    {error}
                  </motion.div>
                )}

                <Button type="submit" className="w-full bg-gradient-to-bl from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white h-14 rounded-xl shadow-[0_0_20px_rgba(16,185,129,0.2)] transition-all font-semibold text-base mt-2" disabled={loading || otp.length < 6}>
                  {loading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : null}
                  {loading ? "Verifying..." : "Verify & Login"}
                  {!loading && <ArrowRight className="w-5 h-5 ml-2" />}
                </Button>
             </form>
             )}
          </div>

          <div className="mt-8 text-center text-left">
            <p className="text-sm text-teal-100/60 font-medium">
              Already a member?{" "}
              <Link href="/login" className="text-emerald-400 hover:text-emerald-300 transition-colors font-semibold">
                Sign In
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
