"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { BookOpen, LogOut, MessageSquare, Settings, UploadCloud, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  if (!mounted) return null;

  return (
    <div className="flex h-screen w-full bg-[#0a0f1c] text-slate-100 overflow-hidden">
      {/* Premium background effects */}
      <div className="absolute top-0 inset-x-0 h-[500px] bg-gradient-to-b from-blue-900/10 to-transparent pointer-events-none" />
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-900/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-900/10 blur-[120px] pointer-events-none" />

      {/* Sidebar */}
      <aside className="w-72 border-r border-white/5 bg-black/20 backdrop-blur-3xl flex flex-col transition-all z-20 shadow-2xl relative">
        <div className="absolute top-0 right-0 w-[1px] h-full bg-gradient-to-b from-transparent via-blue-500/20 to-transparent" />
        
        <div className="h-24 flex items-center px-8">
          <motion.div 
            whileHover={{ scale: 1.05, rotate: 5 }} 
            className="p-2.5 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl mr-3 shadow-lg shadow-blue-500/20 border border-white/10"
          >
            <BookOpen className="w-6 h-6 text-white" />
          </motion.div>
          <span className="font-extrabold text-2xl tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-white/70">Context-AI</span>
        </div>
        
        <nav className="flex-1 py-8 px-4 space-y-2 relative z-10">
          <Link href="/dashboard" className="block relative">
             <div className={`group flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-300 relative z-10 ${pathname === '/dashboard' ? 'text-white' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}>
                {pathname === '/dashboard' && (
                  <motion.div layoutId="sidebar-active" className="absolute inset-0 bg-blue-500/10 border border-blue-400/20 rounded-xl z-0 shadow-inner shadow-blue-500/10" />
                )}
                <MessageSquare className={`w-5 h-5 relative z-10 transition-colors ${pathname === '/dashboard' ? 'text-blue-400' : 'group-hover:text-blue-400'}`} />
                <span className="font-medium relative z-10">Chats</span>
             </div>
          </Link>

          <Link href="/dashboard/documents" className="block relative">
             <div className={`group flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-300 relative z-10 ${pathname === '/dashboard/documents' ? 'text-white' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}>
                {pathname === '/dashboard/documents' && (
                  <motion.div layoutId="sidebar-active" className="absolute inset-0 bg-blue-500/10 border border-blue-400/20 rounded-xl z-0 shadow-inner shadow-blue-500/10" />
                )}
                <UploadCloud className={`w-5 h-5 relative z-10 transition-colors ${pathname === '/dashboard/documents' ? 'text-blue-400' : 'group-hover:text-blue-400'}`} />
                <span className="font-medium relative z-10">Documents</span>
             </div>
          </Link>

          <Link href="/dashboard/settings" className="block relative">
             <div className={`group flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-300 relative z-10 ${pathname === '/dashboard/settings' ? 'text-white' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}>
                {pathname === '/dashboard/settings' && (
                  <motion.div layoutId="sidebar-active" className="absolute inset-0 bg-blue-500/10 border border-blue-400/20 rounded-xl z-0 shadow-inner shadow-blue-500/10" />
                )}
                <Settings className={`w-5 h-5 relative z-10 transition-colors ${pathname === '/dashboard/settings' ? 'text-blue-400' : 'group-hover:text-blue-400'}`} />
                <span className="font-medium relative z-10">Settings</span>
             </div>
          </Link>
        </nav>

        <div className="p-6 relative z-10 pb-8">
          <div className="mb-6 p-5 rounded-2xl bg-gradient-to-br from-blue-900/40 to-indigo-900/20 border border-blue-500/20 backdrop-blur-md relative overflow-hidden group hover:border-blue-400/40 hover:shadow-lg hover:shadow-blue-900/20 transition-all duration-500">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl transform translate-x-10 -translate-y-10 group-hover:bg-blue-400/20 transition-colors" />
            <div className="flex items-center gap-2 mb-2 relative z-10">
              <Sparkles className="w-4 h-4 text-blue-400" />
              <span className="text-sm font-semibold tracking-wide text-white">PRO TIER</span>
            </div>
            <p className="text-xs text-blue-200/60 relative z-10 leading-relaxed">Enjoy limitless document parsing and priority RAG routing.</p>
          </div>

          <Button 
            variant="ghost" 
            className="w-full h-12 justify-start text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all font-medium" 
            onClick={handleLogout}
          >
            <LogOut className="w-5 h-5 mr-3" />
            Sign Out
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col relative z-20 h-full overflow-hidden shadow-[-20px_0_40px_-5px_rgba(0,0,0,0.3)] bg-[#0f1525]">
        {children}
      </main>
    </div>
  );
}
