import React, { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import { Upload, FileCheck, User, Settings } from 'lucide-react';
import Sidebar from '@/components/Sidebar';
import InfoCard from '@/components/InfoCard';
import { useAuth } from '@/contexts/AuthContext';

const DCMeeting = () => {
  const [file, setFile] = useState<File | null>(null);
  const { toast } = useToast();
  const { userName } = useAuth();
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      toast({
        title: "File selected",
        description: `${e.target.files[0].name} has been selected.`,
      });
    }
  };
  
  const handleUpload = () => {
    if (file) {
      // In a real application, you would handle the file upload to a server here
      toast({
        title: "Upload successful",
        description: `${file.name} has been uploaded.`,
      });
      setFile(null);
    } else {
      toast({
        title: "No file selected",
        description: "Please select a file to upload.",
        variant: "destructive",
      });
    }
  };
  
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };
  
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
      toast({
        title: "File selected",
        description: `${e.dataTransfer.files[0].name} has been selected.`,
      });
    }
  };

  return (
    <div className="flex min-h-screen bg-[#f8fafc]">
      <Sidebar userName={userName || 'Guest'} />
      
      <main className="flex-1 transition-all">
        <header className="py-4 px-8 bg-white border-b border-gray-100 flex justify-between items-center">
          <h1 className="text-2xl font-medium text-gray-900">DC Meeting</h1>
          <div className="flex items-center gap-3">
            <button className="p-2 rounded-full hover:bg-gray-100 transition-all">
              <User className="w-5 h-5 text-gray-600" />
            </button>
            <button className="p-2 rounded-full hover:bg-gray-100 transition-all">
              <Settings className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </header>
        
        <div className="p-8">
          <div className="grid grid-cols-1 gap-6">
            <InfoCard title="Upload DC Meeting Minutes" className="mb-6">
              <div 
                className="border-2 border-dashed border-blue-300 rounded-lg p-8 text-center cursor-pointer hover:bg-blue-50 transition-colors"
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onClick={() => document.getElementById('file-upload')?.click()}
              >
                <input 
                  id="file-upload" 
                  type="file" 
                  className="hidden" 
                  onChange={handleFileChange} 
                  accept=".pdf,.doc,.docx"
                />
                <Upload className="w-12 h-12 text-blue-500 mx-auto mb-2" />
                <p className="text-blue-600 font-medium mb-1">
                  {file ? file.name : "Click to upload DC Meeting Minutes"}
                </p>
                <p className="text-gray-500 text-sm">
                  {file ? `${(file.size / 1024 / 1024).toFixed(2)} MB` : "or drag and drop files here"}
                </p>
                
                {file && (
                  <button 
                    className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleUpload();
                    }}
                  >
                    Upload File
                  </button>
                )}
              </div>
            </InfoCard>
            
            <InfoCard title="Previous DC Meetings">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 border border-gray-100 rounded-lg bg-white hover:shadow-sm transition-all">
                  <div className="flex items-center gap-3">
                    <FileCheck className="w-6 h-6 text-blue-600" />
                    <div>
                      <p className="font-medium text-gray-900">DC Meeting - First Year</p>
                      <p className="text-sm text-gray-500">2025-02-10</p>
                    </div>
                  </div>
                  <span className="px-2.5 py-0.5 text-xs font-medium rounded-full bg-green-100 text-green-700">
                    Approved
                  </span>
                </div>
                
                <div className="flex items-center justify-between p-3 border border-gray-100 rounded-lg bg-white hover:shadow-sm transition-all">
                  <div className="flex items-center gap-3">
                    <FileCheck className="w-6 h-6 text-blue-600" />
                    <div>
                      <p className="font-medium text-gray-900">DC Meeting - Progress Report</p>
                      <p className="text-sm text-gray-500">2024-09-15</p>
                    </div>
                  </div>
                  <span className="px-2.5 py-0.5 text-xs font-medium rounded-full bg-yellow-100 text-yellow-700">
                    Pending
                  </span>
                </div>
              </div>
            </InfoCard>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DCMeeting;
