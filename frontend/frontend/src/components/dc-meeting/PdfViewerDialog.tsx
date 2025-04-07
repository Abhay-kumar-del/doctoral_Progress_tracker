
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Download, ExternalLink, ArrowLeft } from "lucide-react";
import { DCMeeting, getPdfUrl } from '@/lib/dcMeetingUtils';

interface PdfViewerDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  selectedFile: DCMeeting | null;
  onDownload: (meetingId: string) => void;
}

const PdfViewerDialog: React.FC<PdfViewerDialogProps> = ({
  isOpen,
  onOpenChange,
  selectedFile,
  onDownload
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] max-h-[80vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle>Meeting Minutes Preview</DialogTitle>
        </DialogHeader>
        <div className="py-4 flex flex-col items-center justify-center">
          {selectedFile && (
            <div className="w-full h-full">
              <div className="border rounded p-2 bg-gray-50 h-[60vh] flex flex-col">
                <div className="flex justify-between items-center mb-2 p-2 border-b">
                  <h3 className="text-md font-medium">{selectedFile.minutes}</h3>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => window.open(getPdfUrl(selectedFile), '_blank')}
                    >
                      <ExternalLink className="w-4 h-4 mr-1" />
                      Open in New Tab
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onDownload(selectedFile.id)}
                    >
                      <Download className="w-4 h-4 mr-1" />
                      Download
                    </Button>
                  </div>
                </div>
                
                <div className="flex-1">
                  <iframe 
                    src={getPdfUrl(selectedFile)}
                    className="w-full h-full border-0" 
                    title="PDF Viewer"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
        <DialogFooter className="flex justify-between">
          <Button 
            variant="default" 
            onClick={() => onOpenChange(false)}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Button>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PdfViewerDialog;
