"use client";

import { useState } from "react";
import { FileText, UploadCloud, Search, Trash2, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function DocumentsPage() {
  const [documents, setDocuments] = useState([
    { id: 1, name: "Node.js Guide.pdf", size: "2.4 MB", date: "Oct 24, 2026", status: "processed" },
    { id: 2, name: "Project Architecture.pdf", size: "1.1 MB", date: "Oct 22, 2026", status: "processed" },
    { id: 3, name: "Financial Report Q3.pdf", size: "4.8 MB", date: "Oct 15, 2026", status: "processing" },
  ]);

  const handleDelete = (id: number) => {
    setDocuments(documents.filter(doc => doc.id !== id));
  };

  return (
    <div className="flex flex-col h-full bg-slate-950 p-6 overflow-y-auto w-full">
      <div className="max-w-5xl w-full mx-auto space-y-8 pb-10">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Documents</h1>
            <p className="text-slate-400">Manage your uploaded PDFs and files context.</p>
          </div>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white">
            <UploadCloud className="w-4 h-4 mr-2" />
            Upload New Document
          </Button>
        </div>

        <div className="bg-slate-900/50 border border-slate-800 rounded-xl glass overflow-hidden flex flex-col w-full">
          <div className="p-4 border-b border-slate-800 flex justify-between items-center gap-4 bg-slate-900/80">
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <Input 
                placeholder="Search documents..." 
                className="w-full bg-slate-800/50 border-slate-700 pl-10 text-white placeholder:text-slate-500 focus-visible:ring-blue-500/50" 
              />
            </div>
          </div>
          
          <div className="overflow-x-auto w-full">
            <table className="w-full text-left border-collapse min-w-[600px]">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-900/40 text-slate-400 text-sm">
                  <th className="p-4 font-medium">Name</th>
                  <th className="p-4 font-medium">Size</th>
                  <th className="p-4 font-medium">Date Uploaded</th>
                  <th className="p-4 font-medium">Status</th>
                  <th className="p-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="text-slate-300 text-sm">
                {documents.map((doc) => (
                  <tr key={doc.id} className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors group">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded bg-blue-500/10 flex items-center justify-center text-blue-400">
                          <FileText className="w-4 h-4" />
                        </div>
                        <span className="font-medium text-slate-200">{doc.name}</span>
                      </div>
                    </td>
                    <td className="p-4 text-slate-500">{doc.size}</td>
                    <td className="p-4 text-slate-500">{doc.date}</td>
                    <td className="p-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        doc.status === 'processed' 
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                          : 'bg-amber-500/10 text-amber-400 border border-amber-500/20 animate-pulse'
                      }`}>
                        {doc.status === 'processed' ? 'Ready' : 'Processing...'}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button onClick={() => handleDelete(doc.id)} variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-red-400 hover:bg-red-500/10">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {documents.length === 0 && (
            <div className="p-12 text-center flex flex-col items-center">
              <FileText className="w-12 h-12 text-slate-600 mb-4" />
              <h3 className="text-lg font-medium text-slate-300">No documents yet</h3>
              <p className="text-slate-500 mt-2 max-w-sm">Upload your first PDF to start chatting and extracting insights from it.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
