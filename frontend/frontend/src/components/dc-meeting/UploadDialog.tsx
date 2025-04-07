
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import FileUpload from "@/components/FileUpload";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface UploadDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onFileSelect: (file: File) => Promise<void | boolean>; // Updated to allow void or boolean return type
}

const UploadDialog: React.FC<UploadDialogProps> = ({
  isOpen,
  onOpenChange,
  onFileSelect
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
  };

  const handleUpload = async () => {
    if (selectedFile) {
      setIsUploading(true);
      try {
        toast({
          title: "Uploading file",
          description: "Please wait while we upload your file...",
        });
        
        const result = await onFileSelect(selectedFile);
        // Reset the file selection
        setSelectedFile(null);
        
        const success = result !== false; // Consider anything that's not explicitly false as success
        
        if (!success) {
          toast({
            title: "Upload failed",
            description: "There was an error uploading your file. Please try again.",
            variant: "destructive",
          });
        } else {
          toast({
            title: "Upload successful",
            description: "Your file has been uploaded successfully.",
          });
        }
      } catch (error) {
        console.error("Error during upload:", error);
        toast({
          title: "Upload error",
          description: "An unexpected error occurred during upload.",
          variant: "destructive",
        });
      } finally {
        setIsUploading(false);
      }
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Upload DC Meeting Minutes</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <FileUpload 
            title="Click to upload DC meeting minutes"
            description="Upload PDF file of your DC meeting minutes"
            acceptedFileTypes=".pdf"
            onFileSelect={handleFileSelect}
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isUploading}>Cancel</Button>
          <Button 
            onClick={handleUpload}
            disabled={!selectedFile || isUploading}
          >
            {isUploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Uploading...
              </>
            ) : (
              'Upload'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UploadDialog;
