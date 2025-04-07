
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Download, ExternalLink, Trash2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";

const FilesList = () => {
  const [files, setFiles] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadFiles();
  }, []);

  const loadFiles = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.storage.from('files').list();
      
      if (error) {
        console.error('Error loading files:', error);
        toast({
          title: "Error",
          description: "Failed to load files from storage",
          variant: "destructive",
        });
        return;
      }
      
      // Sort files by created_at in descending order (newest first)
      const sortedFiles = data.sort((a, b) => {
        return new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime();
      });
      
      setFiles(sortedFiles);
    } catch (error) {
      console.error('Error in loadFiles:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred while loading files",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewFile = (fileName: string) => {
    const { data } = supabase.storage.from('files').getPublicUrl(fileName);
    if (data.publicUrl) {
      window.open(data.publicUrl, '_blank');
    }
  };

  const handleDownloadFile = (fileName: string) => {
    const { data } = supabase.storage.from('files').getPublicUrl(fileName);
    if (data.publicUrl) {
      const a = document.createElement('a');
      a.href = data.publicUrl;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      
      toast({
        title: "Download Started",
        description: `${fileName} is being downloaded`,
      });
    }
  };

  const handleDeleteFile = async (fileName: string) => {
    try {
      const { error } = await supabase.storage.from('files').remove([fileName]);
      
      if (error) {
        console.error('Error deleting file:', error);
        toast({
          title: "Error",
          description: "Failed to delete file",
          variant: "destructive",
        });
        return;
      }
      
      // Remove the file from the local state
      setFiles(files.filter(file => file.name !== fileName));
      
      toast({
        title: "Success",
        description: "File deleted successfully",
      });
    } catch (error) {
      console.error('Error in handleDeleteFile:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred while deleting file",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Uploaded Files</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Uploaded Files</CardTitle>
        <Button variant="outline" size="sm" onClick={loadFiles}>Refresh</Button>
      </CardHeader>
      <CardContent>
        {files.length > 0 ? (
          <div className="space-y-2">
            {files.map((file) => (
              <div 
                key={file.id} 
                className="flex items-center justify-between p-3 border rounded-md hover:bg-gray-50"
              >
                <div className="flex items-center">
                  <FileText className="h-5 w-5 text-blue-500 mr-2" />
                  <div>
                    <p className="font-medium">{file.name}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(file.created_at).toLocaleString()} · 
                      {(file.metadata?.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleViewFile(file.name)}
                  >
                    <ExternalLink className="h-4 w-4 mr-1" />
                    View
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleDownloadFile(file.name)}
                  >
                    <Download className="h-4 w-4 mr-1" />
                    Download
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="text-red-500 hover:bg-red-50"
                    onClick={() => handleDeleteFile(file.name)}
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Delete
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 my-8">No files uploaded yet</p>
        )}
      </CardContent>
    </Card>
  );
};

export default FilesList;
