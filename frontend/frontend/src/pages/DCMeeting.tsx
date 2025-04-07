import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { getStoredMeetings, getPdfUrl, DCMeeting as DCMeetingType, saveMeeting, updateMeetingStatus } from '@/lib/dcMeetingUtils';
import PendingApprovals from '@/components/dc-meeting/PendingApprovals';
import MeetingHistory from '@/components/dc-meeting/MeetingHistory';
import ModificationDialog from '@/components/dc-meeting/ModificationDialog';
import ModificationDetailsDialog from '@/components/dc-meeting/ModificationDetailsDialog';
import UploadDialog from '@/components/dc-meeting/UploadDialog';
import PdfViewerDialog from '@/components/dc-meeting/PdfViewerDialog';
import FilesList from '@/components/dc-meeting/FilesList';
import { Skeleton } from "@/components/ui/skeleton";

const DCMeeting = () => {
  const { userRole, userName, userId } = useAuth();
  const { toast } = useToast();
  const [meetings, setMeetings] = useState<DCMeetingType[]>([]);
  const [selectedMeeting, setSelectedMeeting] = useState<string | null>(null);
  const [modificationNote, setModificationNote] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [isPdfViewerOpen, setIsPdfViewerOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<DCMeetingType | null>(null);
  const [isModificationDetailsOpen, setIsModificationDetailsOpen] = useState(false);
  const [modificationDetails, setModificationDetails] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const loadMeetings = async () => {
      setIsLoading(true);
      try {
        const data = await getStoredMeetings();
        setMeetings(data);
      } catch (error) {
        console.error('Error loading meetings:', error);
        toast({
          title: "Error",
          description: "Failed to load meeting data",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadMeetings();
  }, [toast]);
  
  const handleDownload = (meetingId: string) => {
    const meeting = meetings.find(m => m.id === meetingId);
    if (!meeting) return;
    
    let pdfUrl = meeting.fileData;
    if (!pdfUrl) {
      pdfUrl = getPdfUrl(meeting);
    }
    
    const a = document.createElement('a');
    a.href = pdfUrl;
    a.download = meeting.minutes;
    a.target = '_blank';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    
    toast({
      title: "Downloaded",
      description: `Meeting minutes "${meeting.minutes}" downloaded successfully`,
    });
  };

  const handleViewPdf = (meetingId: string) => {
    const meeting = meetings.find(m => m.id === meetingId);
    if (!meeting) return;
    
    setSelectedFile(meeting);
    setIsPdfViewerOpen(true);
  };

  const handleApprove = async (meetingId: string) => {
    setIsLoading(true);
    try {
      const success = await updateMeetingStatus(meetingId, 'Approved');
      
      if (success) {
        setMeetings(meetings.map(meeting => 
          meeting.id === meetingId ? { ...meeting, status: 'Approved' } : meeting
        ));
        
        toast({
          title: "Approved",
          description: "DC Meeting has been approved",
          variant: "default", 
        });
      } else {
        throw new Error('Failed to update meeting status');
      }
    } catch (error) {
      console.error('Error approving meeting:', error);
      toast({
        title: "Error",
        description: "Failed to approve the meeting",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRequestModification = async () => {
    if (!modificationNote.trim()) {
      toast({
        title: "Error",
        description: "Please provide modification details",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    try {
      if (!selectedMeeting) throw new Error('No meeting selected');
      
      const success = await updateMeetingStatus(
        selectedMeeting, 
        'Needs Modification', 
        modificationNote
      );
      
      if (success) {
        setMeetings(meetings.map(meeting => 
          meeting.id === selectedMeeting ? { 
            ...meeting, 
            status: 'Needs Modification',
            modificationNote: modificationNote 
          } : meeting
        ));
        
        setIsDialogOpen(false);
        setModificationNote('');
        
        toast({
          title: "Modification Requested",
          description: "Request for modification sent",
          variant: "destructive",
        });
      } else {
        throw new Error('Failed to update meeting status');
      }
    } catch (error) {
      console.error('Error requesting modification:', error);
      toast({
        title: "Error",
        description: "Failed to request modification",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const openModificationDialog = (meetingId: string) => {
    setSelectedMeeting(meetingId);
    setIsDialogOpen(true);
  };

  const viewModificationDetails = (meetingId: string) => {
    const meeting = meetings.find(m => m.id === meetingId);
    if (meeting && meeting.modificationNote) {
      setModificationDetails(meeting.modificationNote);
      setIsModificationDetailsOpen(true);
    } else {
      toast({
        title: "No details available",
        description: "No modification details were provided.",
        variant: "destructive",
      });
    }
  };

  const handleFileSelect = async (file: File): Promise<boolean> => {
    if (!userName || !userId) {
      toast({
        title: "Error",
        description: "User information not available",
        variant: "destructive",
      });
      return false;
    }
    
    setIsLoading(true);
    
    try {
      const success = await saveMeeting({
        studentName: userName,
        studentId: userId,
        file: file,
        date: new Date().toISOString().split('T')[0]
      });
      
      if (success) {
        const updatedMeetings = await getStoredMeetings();
        setMeetings(updatedMeetings);
        
        setIsUploadDialogOpen(false);
        
        toast({
          title: "Minutes Uploaded",
          description: "DC Meeting minutes uploaded successfully and sent to supervisor for approval",
        });
        return true;
      } else {
        throw new Error('Failed to save meeting');
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      toast({
        title: "Upload Failed",
        description: "Failed to upload meeting minutes",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const isSupervisor = userRole === 'supervisor';
  const isStudent = userRole === 'student' || userRole === null;

  const filteredMeetings = isSupervisor 
    ? meetings
    : meetings.filter(meeting => meeting.studentName === userName);

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen bg-blue-50 p-8">
        <div className="mb-8">
          <div className="bg-blue-600 text-white p-6 rounded-lg mb-8">
            <h1 className="text-2xl font-bold">Loading DC Meetings...</h1>
          </div>
        </div>
        
        <div className="space-y-8">
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden mb-8">
            <div className="p-5 border-b border-gray-100">
              <Skeleton className="h-8 w-40" />
            </div>
            <div className="p-5">
              <div className="space-y-4">
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-24 w-full" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-gray-100">
              <Skeleton className="h-8 w-40" />
            </div>
            <div className="p-5">
              <Skeleton className="h-12 w-full" />
              <div className="mt-4 space-y-4">
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-16 w-full" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-blue-50">
      <div className="p-8">
        {isSupervisor && (
          <div className="mb-8">
            <div className="bg-blue-600 text-white p-6 rounded-lg mb-8">
              <h1 className="text-2xl font-bold">PhD Supervisor Dashboard</h1>
            </div>
          </div>
        )}
        
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">DC Meetings</h1>
          <p className="text-gray-500">View and manage Doctoral Committee meetings</p>
        </div>

        {isSupervisor && (
          <PendingApprovals 
            meetings={meetings}
            onViewPdf={handleViewPdf}
            onDownload={handleDownload}
            onApprove={handleApprove}
            onRequestModification={openModificationDialog}
          />
        )}
        
        {isStudent && (
          <div className="mb-8">
            <Button 
              onClick={() => setIsUploadDialogOpen(true)}
              className="flex items-center gap-2"
            >
              <Upload className="w-4 h-4" />
              Upload DC Meeting Minutes
            </Button>
          </div>
        )}
        
        <div className="space-y-8">
          <MeetingHistory 
            meetings={filteredMeetings}
            isSupervisor={isSupervisor}
            onViewPdf={handleViewPdf}
            onDownload={handleDownload}
            onApprove={handleApprove}
            onRequestModification={openModificationDialog}
            onViewModificationDetails={viewModificationDetails}
          />
          
          <FilesList />
        </div>
      </div>
      
      <ModificationDialog 
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        modificationNote={modificationNote}
        setModificationNote={setModificationNote}
        onRequestModification={handleRequestModification}
      />

      <ModificationDetailsDialog 
        isOpen={isModificationDetailsOpen}
        onOpenChange={setIsModificationDetailsOpen}
        modificationDetails={modificationDetails}
      />

      <UploadDialog 
        isOpen={isUploadDialogOpen}
        onOpenChange={setIsUploadDialogOpen}
        onFileSelect={handleFileSelect}
      />

      <PdfViewerDialog 
        isOpen={isPdfViewerOpen}
        onOpenChange={setIsPdfViewerOpen}
        selectedFile={selectedFile}
        onDownload={handleDownload}
      />
    </div>
  );
};

export default DCMeeting;
