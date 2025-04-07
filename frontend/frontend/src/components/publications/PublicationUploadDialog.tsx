
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import FileUpload from "@/components/FileUpload";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from '@/integrations/supabase/client';

interface PublicationUploadDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

const PublicationUploadDialog: React.FC<PublicationUploadDialogProps> = ({
  isOpen,
  onOpenChange,
  onSuccess
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [publicationData, setPublicationData] = useState({
    title: '',
    venue: '',
    authors: ''
  });
  const { toast } = useToast();

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setPublicationData({
      ...publicationData,
      [id]: value
    });
  };

  const handleUpload = async () => {
    if (!selectedFile || !publicationData.title || !publicationData.venue) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields and select a file",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    try {
      // Format the title and venue for filename
      const formattedTitle = encodeURIComponent(publicationData.title.replace(/\s+/g, '-'));
      const formattedVenue = encodeURIComponent(publicationData.venue.replace(/\s+/g, '-'));
      
      // Create a custom filename: publication-{title}-{venue}-unvalidated.pdf
      const fileExtension = selectedFile.name.split('.').pop() || 'pdf';
      const customFilename = `publication-${formattedTitle}-${formattedVenue}-unvalidated.${fileExtension}`;
      
      // Upload the file with the custom name
      const { error } = await supabase.storage
        .from('files')
        .upload(customFilename, selectedFile, {
          contentType: selectedFile.type,
          upsert: true
        });
      
      if (error) {
        throw error;
      }
      
      toast({
        title: "Upload successful",
        description: "Your publication has been uploaded successfully",
      });
      
      // Reset the form
      setSelectedFile(null);
      setPublicationData({
        title: '',
        venue: '',
        authors: ''
      });
      
      // Close the dialog
      onOpenChange(false);
      
      // Trigger refresh callback if provided
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error("Error during upload:", error);
      toast({
        title: "Upload failed",
        description: "There was an error uploading your publication",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Upload New Publication</DialogTitle>
        </DialogHeader>
        <div className="py-4 space-y-4">
          <div className="grid gap-2">
            <label htmlFor="title" className="text-sm font-medium">
              Publication Title*
            </label>
            <input
              id="title"
              value={publicationData.title}
              onChange={handleInputChange}
              className="rounded-md border border-input bg-background px-3 py-2 text-sm"
              placeholder="Enter publication title"
            />
          </div>
          
          <div className="grid gap-2">
            <label htmlFor="venue" className="text-sm font-medium">
              Publication Venue*
            </label>
            <input
              id="venue"
              value={publicationData.venue}
              onChange={handleInputChange}
              className="rounded-md border border-input bg-background px-3 py-2 text-sm"
              placeholder="Conference or journal name"
            />
          </div>
          
          <div className="grid gap-2">
            <label htmlFor="authors" className="text-sm font-medium">
              Authors
            </label>
            <input
              id="authors"
              value={publicationData.authors}
              onChange={handleInputChange}
              className="rounded-md border border-input bg-background px-3 py-2 text-sm"
              placeholder="List of authors (your name will be added automatically)"
            />
          </div>
          
          <FileUpload
            title="Upload Publication PDF"
            description="Upload your publication paper in PDF format"
            acceptedFileTypes=".pdf"
            onFileSelect={handleFileSelect}
          />
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isUploading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleUpload}
            disabled={!selectedFile || !publicationData.title || !publicationData.venue || isUploading}
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

export default PublicationUploadDialog;
