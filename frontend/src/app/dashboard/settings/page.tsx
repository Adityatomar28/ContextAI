"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Save, User, Bell, Shield, Eye, EyeOff } from "lucide-react";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function SettingsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  
  // Profile
  const [userEmail, setUserEmail] = useState("");
  const [displayName, setDisplayName] = useState("Aditya User");

  // Notifications
  const [docsNotif, setDocsNotif] = useState(true);
  const [updatesNotif, setUpdatesNotif] = useState(false);
  const [securityNotif, setSecurityNotif] = useState(true);

  // Passwords
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          router.push("/login");
          return;
        }
        const res = await axios.get((process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000") + "/api/v1/auth/me", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setUserEmail(res.data.email);
        // If your backend returns name, you can set it here too
      } catch (error) {
        console.error("Failed to fetch user", error);
      }
    };
    fetchUser();
  }, [router]);

  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast("Profile updated successfully.");
    }, 800);
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword || !newPassword) {
      toast("Please enter both current and new passwords.");
      return;
    }
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      await axios.post((process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000") + "/api/v1/auth/change-password", {
        current_password: currentPassword,
        new_password: newPassword
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast("Password updated successfully.");
      setCurrentPassword("");
      setNewPassword("");
    } catch (err: any) {
      toast(err.response?.data?.detail || "Failed to update password.");
    } finally {
      setLoading(false);
    }
  };

  const handleNotificationsSave = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast("Notification preferences saved.");
    }, 800);
  };

  return (
    <div className="flex flex-col h-full bg-slate-950 p-6 overflow-y-auto w-full">
      <div className="max-w-4xl w-full mx-auto space-y-8 pb-10">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Settings</h1>
          <p className="text-slate-400">Manage your account preferences and security.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-[250px_1fr] gap-8">
          <nav className="space-y-2">
            {[
              { id: 'profile', icon: User, label: 'Profile' },
              { id: 'security', icon: Shield, label: 'Security' },
              { id: 'notifications', icon: Bell, label: 'Notifications' },
            ].map((item) => (
              <button 
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className="w-full flex items-center gap-3 px-3 py-2 text-left text-sm font-medium rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
                style={{ backgroundColor: activeTab === item.id ? 'rgba(30, 41, 59, 0.8)' : 'transparent', color: activeTab === item.id ? 'white' : '' }}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </button>
            ))}
          </nav>

          <div className="space-y-6">
            {activeTab === 'profile' && (
              <>
                <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 glass">
                  <h2 className="text-xl font-semibold text-white mb-6">Profile Information</h2>
                  <form onSubmit={handleProfileSave} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-slate-300">Display Name</Label>
                      <Input id="name" value={displayName} onChange={(e) => setDisplayName(e.target.value)} className="bg-slate-800/50 border-slate-700 text-white focus-visible:ring-blue-500/50" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-slate-300">Email Address</Label>
                      <Input id="email" type="email" value={userEmail || "Loading..."} disabled className="bg-slate-800/20 border-slate-700/50 text-slate-500" />
                      <p className="text-xs text-slate-500 mt-1">Contact support to change your email address.</p>
                    </div>
                    <div className="pt-4 flex justify-end">
                      <Button type="submit" disabled={loading} className="bg-blue-600 hover:bg-blue-700 text-white">
                        <Save className="w-4 h-4 mr-2" />
                        {loading ? "Saving..." : "Save Changes"}
                      </Button>
                    </div>
                  </form>
                </div>
                
                <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 glass">
                  <h2 className="text-xl font-semibold text-white mb-2">Danger Zone</h2>
                  <p className="text-sm text-slate-400 mb-6">Irreversible and destructive actions.</p>
                  <Button variant="destructive" className="bg-red-900/50 text-red-200 border border-red-900/50 hover:bg-red-900 hover:text-white">
                    Delete Account
                  </Button>
                </div>
              </>
            )}

            {activeTab === 'security' && (
              <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 glass">
                <h2 className="text-xl font-semibold text-white mb-6">Security Settings</h2>
                <form onSubmit={handlePasswordChange} className="space-y-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label className="text-slate-300">Current Password</Label>
                      <div className="relative">
                        <Input 
                          type={showPassword ? "text" : "password"} 
                          placeholder="••••••••" 
                          value={currentPassword}
                          onChange={(e) => setCurrentPassword(e.target.value)}
                          className="bg-slate-800/50 border-slate-700 text-white focus-visible:ring-blue-500/50 pr-10" 
                        />
                        <button 
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-slate-300">New Password</Label>
                      <div className="relative">
                        <Input 
                          type={showNewPassword ? "text" : "password"} 
                          placeholder="••••••••" 
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          className="bg-slate-800/50 border-slate-700 text-white focus-visible:ring-blue-500/50 pr-10" 
                        />
                        <button 
                          type="button"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                        >
                          {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="border-t border-slate-800 pt-6">
                    <h3 className="text-lg font-medium text-white mb-4">Two-Factor Authentication</h3>
                    <p className="text-sm text-slate-400 mb-4">Add an extra layer of security to your account.</p>
                    <Button type="button" variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-800">
                      Enable 2FA
                    </Button>
                  </div>
                  <div className="pt-4 flex justify-end">
                    <Button type="submit" disabled={loading} className="bg-blue-600 hover:bg-blue-700 text-white">
                      <Shield className="w-4 h-4 mr-2" />
                      {loading ? "Updating..." : "Update Security"}
                    </Button>
                  </div>
                </form>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 glass">
                <h2 className="text-xl font-semibold text-white mb-6">Notification Preferences</h2>
                <form onSubmit={handleNotificationsSave} className="space-y-6">
                  <div className="space-y-4">
                    
                    <div className="flex items-start justify-between p-4 border border-slate-800 rounded-lg bg-slate-800/10 hover:bg-slate-800/30 transition-colors">
                      <div className="space-y-1">
                        <p className="font-medium text-slate-200">Document Processing</p>
                        <p className="text-sm text-slate-400">Get notified when your large PDFs finish processing.</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer mt-1">
                        <input type="checkbox" className="sr-only peer" checked={docsNotif} onChange={(e) => setDocsNotif(e.target.checked)} />
                        <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>

                    <div className="flex items-start justify-between p-4 border border-slate-800 rounded-lg bg-slate-800/10 hover:bg-slate-800/30 transition-colors">
                      <div className="space-y-1">
                        <p className="font-medium text-slate-200">Product Updates</p>
                        <p className="text-sm text-slate-400">Receive emails about new features and improvements.</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer mt-1">
                        <input type="checkbox" className="sr-only peer" checked={updatesNotif} onChange={(e) => setUpdatesNotif(e.target.checked)} />
                        <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>

                    <div className="flex items-start justify-between p-4 border border-slate-800 rounded-lg bg-slate-800/10 hover:bg-slate-800/30 transition-colors">
                      <div className="space-y-1">
                        <p className="font-medium text-slate-200">Security Alerts</p>
                        <p className="text-sm text-slate-400">Important notifications about your account security.</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer mt-1">
                        <input type="checkbox" className="sr-only peer" checked={securityNotif} onChange={(e) => setSecurityNotif(e.target.checked)} />
                        <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>

                  </div>
                  <div className="pt-4 flex justify-end">
                    <Button type="submit" disabled={loading} className="bg-blue-600 hover:bg-blue-700 text-white">
                      <Save className="w-4 h-4 mr-2" />
                      Save Preferences
                    </Button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
