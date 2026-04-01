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
import { BookOpen, ArrowRight, Loader2, KeyRound } from "lucide-react";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [step, setStep] = useState<"email" | "reset">("email");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleRequestOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await axios.post((process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000") + "/api/v1/auth/forgot-password", { email });
      toast.success("If registered, a password reset code was sent.");
      setStep("reset");
    } catch (err: any) {
      setError(err.response?.data?.detail || "Failed to process request.");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await axios.post((process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000") + "/api/v1/auth/reset-password", {
        email,
        otp,
        new_password: newPassword
      });
      toast.success("Password reset successfully! You can now log in.");
      router.push("/login");
    } catch (err: any) {
      setError(err.response?.data?.detail || "Invalid or expired OTP.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-[#030712] relative overflow-hidden items-center justify-center">
      {/* Background Orbs */}
      <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full bg-pink-900/20 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] rounded-full bg-rose-900/20 blur-[120px] pointer-events-none" />

      <div className="w-full max-w-md p-8 relative z-10">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4 }}>
          
          <div className="flex items-center gap-3 justify-center mb-10">
            <div className="p-3 bg-gradient-to-br from-pink-500 to-rose-600 rounded-2xl shadow-lg shadow-pink-500/20 border border-white/10">
              <KeyRound className="w-6 h-6 text-white" />
            </div>
          </div>

          <div className="mb-10 text-center">
            <h2 className="text-3xl font-bold text-white mb-2 tracking-tight">
              {step === "email" ? "Reset Password" : "Enter Reset Code"}
            </h2>
            <p className="text-pink-200/60">
              {step === "email" ? "Enter your email to receive a recovery code." : `We sent a 6-digit code to ${email}`}
            </p>
          </div>

          <div className="bg-white/[0.03] border border-white/5 p-8 sm:p-10 rounded-[2rem] shadow-2xl backdrop-blur-xl relative overflow-hidden">
             <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-pink-500/50 to-transparent" />
             
             {step === "email" ? (
             <form onSubmit={handleRequestOTP} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-slate-300 text-sm font-medium">Email Address</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    required 
                    className="bg-black/20 border-white/10 text-white placeholder:text-slate-600 h-14 px-4 rounded-xl focus-visible:ring-pink-500/50 transition-all font-medium"
                    placeholder="you@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                
                {error && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm font-medium flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
                    {error}
                  </motion.div>
                )}

                <Button type="submit" className="w-full bg-gradient-to-br from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-white h-14 rounded-xl shadow-[0_0_20px_rgba(244,63,94,0.2)] transition-all font-semibold text-base mt-2" disabled={loading}>
                  {loading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : null}
                  {loading ? "Sending..." : "Send Verification Code"}
                  {!loading && <ArrowRight className="w-5 h-5 ml-2" />}
                </Button>
             </form>
             ) : (
             <form onSubmit={handleResetPassword} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="otp" className="text-slate-300 text-sm font-medium">Reset Code</Label>
                  <Input 
                    id="otp" 
                    type="text" 
                    required 
                    maxLength={6}
                    className="bg-black/20 border-white/10 text-white placeholder:text-slate-600 h-14 px-4 rounded-xl focus-visible:ring-pink-500/50 transition-all font-medium text-center text-2xl tracking-[0.5em]"
                    placeholder="••••••"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                  />
                </div>
                
                <div className="space-y-2 pt-2">
                  <Label htmlFor="password" className="text-slate-300 text-sm font-medium">New Password</Label>
                  <Input 
                    id="password" 
                    type="password" 
                    required 
                    className="bg-black/20 border-white/10 text-white focus-visible:ring-pink-500/50 h-14 px-4 rounded-xl transition-all font-medium"
                    placeholder="••••••••"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                </div>
                
                {error && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm font-medium flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
                    {error}
                  </motion.div>
                )}

                <Button type="submit" className="w-full bg-gradient-to-bl from-pink-500 to-rose-600 hover:from-pink-400 hover:to-rose-500 text-white h-14 rounded-xl shadow-[0_0_20px_rgba(244,63,94,0.2)] transition-all font-semibold text-base mt-2" disabled={loading || otp.length < 6}>
                  {loading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : null}
                  {loading ? "Resetting..." : "Save New Password"}
                  {!loading && <ArrowRight className="w-5 h-5 ml-2" />}
                </Button>
             </form>
             )}
          </div>

          <div className="mt-8 text-center">
            <p className="text-sm text-pink-200/60 font-medium">
              Remember your password?{" "}
              <Link href="/login" className="text-pink-400 hover:text-pink-300 transition-colors font-semibold">
                Back to Login
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
