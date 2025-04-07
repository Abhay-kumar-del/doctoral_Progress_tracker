
import React, { useState } from 'react';
import { Upload } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

interface FileUploadProps {
  title: string;
  description?: string;
  onFileSelect?: (file: File) => void;
  acceptedFileTypes?: string;
  maxFileSizeMB?: number;
}

const FileUpload: React.FC<FileUploadProps> = ({
  title,
  description = "or drag and drop files here",
  onFileSelect,
  acceptedFileTypes = ".pdf,.doc,.docx",
  maxFileSizeMB = 5
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  
  const processFile = (file: File) => {
    // Check file size
    const fileSizeInMB = file.size / (1024 * 1024);
    if (fileSizeInMB > maxFileSizeMB) {
      toast({
        title: "File too large",
        description: `File exceeds the ${maxFileSizeMB}MB limit.`,
        variant: "destructive"
      });
      return;
    }
    
    // Store file details
    setFile(file);
    if (onFileSelect) {
      onFileSelect(file);
    }
    
    toast({
      title: "File selected",
      description: `${file.name} has been selected.`,
    });
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsLoading(true);
    try {
      if (e.target.files && e.target.files[0]) {
        processFile(e.target.files[0]);
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };
  
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    setIsLoading(true);
    try {
      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        processFile(e.dataTransfer.files[0]);
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  const uploadId = `file-upload-${Math.random().toString(36).substring(7)}`;
  
  return (
    <div 
      className="border-2 border-dashed border-blue-300 rounded-lg p-8 text-center cursor-pointer hover:bg-blue-50 transition-colors"
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onClick={() => document.getElementById(uploadId)?.click()}
    >
      <input 
        id={uploadId} 
        type="file" 
        className="hidden" 
        onChange={handleFileChange} 
        accept={acceptedFileTypes}
        disabled={isLoading}
      />
      <Upload className={`w-12 h-12 mx-auto mb-2 ${isLoading ? 'text-blue-300 animate-pulse' : 'text-blue-500'}`} />
      <p className="text-blue-600 font-medium mb-1">
        {file ? file.name : (isLoading ? "Processing..." : title)}
      </p>
      <p className="text-gray-500 text-sm">
        {file ? `${(file.size / 1024 / 1024).toFixed(2)} MB` : description}
      </p>
      {maxFileSizeMB && (
        <p className="text-gray-400 text-xs mt-2">
          Max file size: {maxFileSizeMB}MB
        </p>
      )}
    </div>
  );
};

export default FileUpload;
