
import React, { useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Download, Trash2, FileText, ExternalLink } from "lucide-react";
import { getAllStoredFiles, deleteStoredFile } from '@/lib/fileStorage';

const StoredFiles = () => {
  const { toast } = useToast();
  const [files, setFiles] = useState<Record<string, { data: string, dateAdded: string }>>({});
  const [selectedFile, setSelectedFile] = useState<{ name: string, data: string } | null>(null);
  const [isPdfViewerOpen, setIsPdfViewerOpen] = useState(false);
  const [fileToDelete, setFileToDelete] = useState<string | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  useEffect(() => {
    loadFiles();
  }, []);

  const loadFiles = () => {
    const storedFiles = getAllStoredFiles();
    setFiles(storedFiles);
  };

  const handleViewFile = (fileName: string, fileData: string) => {
    setSelectedFile({ name: fileName, data: fileData });
    setIsPdfViewerOpen(true);
  };

  const handleDownload = (fileName: string, fileData: string) => {
    // Create a link element
    const a = document.createElement('a');
    a.href = fileData;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    
    toast({
      title: "Downloaded",
      description: `File "${fileName}" downloaded successfully`,
    });
  };

  const confirmDelete = (fileName: string) => {
    setFileToDelete(fileName);
    setIsDeleteDialogOpen(true);
  };

  const handleDelete = () => {
    if (fileToDelete) {
      const success = deleteStoredFile(fileToDelete);
      if (success) {
        loadFiles();
        toast({
          title: "File Deleted",
          description: `File "${fileToDelete}" has been deleted successfully`,
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to delete the file",
          variant: "destructive",
        });
      }
    }
    setIsDeleteDialogOpen(false);
    setFileToDelete(null);
  };

  const getFileType = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    if (['jpg', 'jpeg', 'png', 'gif', 'bmp', 'svg'].includes(extension || '')) {
      return 'image';
    } else if (['pdf'].includes(extension || '')) {
      return 'pdf';
    } else if (['doc', 'docx'].includes(extension || '')) {
      return 'document';
    } else {
      return 'other';
    }
  };

  const formatFileSize = (base64String: string) => {
    // Estimate file size based on base64 string length
    // base64 adds ~33% to the size
    const sizeInBytes = Math.ceil((base64String.length * 3) / 4);
    if (sizeInBytes < 1024) {
      return `${sizeInBytes} B`;
    } else if (sizeInBytes < 1024 * 1024) {
      return `${(sizeInBytes / 1024).toFixed(2)} KB`;
    } else {
      return `${(sizeInBytes / (1024 * 1024)).toFixed(2)} MB`;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  const fileEntries = Object.entries(files);

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Stored Files</h1>
        <p className="text-gray-500">View and manage files stored in local storage</p>
      </div>

      {fileEntries.length === 0 ? (
        <div className="text-center p-12 bg-gray-50 rounded-lg border border-dashed border-gray-300">
          <FileText className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <h3 className="text-lg font-medium text-gray-900 mb-1">No Files Found</h3>
          <p className="text-gray-500">
            You haven't uploaded any files yet. Files uploaded via the application will appear here.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {fileEntries.map(([fileName, fileInfo]) => (
            <Card key={fileName} className="overflow-hidden">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg truncate" title={fileName}>
                  {fileName}
                </CardTitle>
                <div className="text-sm text-gray-500">
                  {formatDate(fileInfo.dateAdded)}
                </div>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="flex flex-col gap-1">
                  <div className="text-sm text-gray-600">
                    Size: {formatFileSize(fileInfo.data)}
                  </div>
                  <div className="text-sm text-gray-600">
                    Type: {getFileType(fileName)}
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="inline-flex items-center"
                  onClick={() => handleViewFile(fileName, fileInfo.data)}
                >
                  <FileText className="w-4 h-4 mr-1" />
                  View
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="inline-flex items-center"
                  onClick={() => handleDownload(fileName, fileInfo.data)}
                >
                  <Download className="w-4 h-4 mr-1" />
                  Download
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="inline-flex items-center text-red-600 hover:text-red-700"
                  onClick={() => confirmDelete(fileName)}
                >
                  <Trash2 className="w-4 h-4 mr-1" />
                  Delete
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={isPdfViewerOpen} onOpenChange={setIsPdfViewerOpen}>
        <DialogContent className="sm:max-w-[800px] max-h-[80vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle>File Preview</DialogTitle>
          </DialogHeader>
          <div className="py-4 flex flex-col items-center justify-center">
            {selectedFile && (
              <div className="w-full h-full">
                <div className="border rounded p-2 bg-gray-50 h-[60vh] flex flex-col">
                  <div className="flex justify-between items-center mb-2 p-2 border-b">
                    <h3 className="text-md font-medium">{selectedFile.name}</h3>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => window.open(selectedFile.data, '_blank')}
                      >
                        <ExternalLink className="w-4 h-4 mr-1" />
                        Open in New Tab
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDownload(selectedFile.name, selectedFile.data)}
                      >
                        <Download className="w-4 h-4 mr-1" />
                        Download
                      </Button>
                    </div>
                  </div>
                  
                  <div className="flex-1 overflow-auto">
                    {getFileType(selectedFile.name) === 'image' ? (
                      <img 
                        src={selectedFile.data} 
                        alt={selectedFile.name}
                        className="max-w-full max-h-full object-contain mx-auto"
                      />
                    ) : (
                      <iframe 
                        src={selectedFile.data}
                        className="w-full h-full border-0" 
                        title="File Viewer"
                      />
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsPdfViewerOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the file 
              "{fileToDelete}" from your local storage.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setIsDeleteDialogOpen(false)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default StoredFiles;
