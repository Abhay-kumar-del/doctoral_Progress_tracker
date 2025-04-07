
import React, { useState, useEffect } from 'react';
import { Progress } from "@/components/ui/progress";
import { useNavigate } from "react-router-dom";
import { Download, Check, X, FileText, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import StatusBadge from '@/components/StatusBadge';
import { getStoredMeetings, updateMeetingStatus, getPdfUrl } from '@/lib/dcMeetingUtils';
import { Skeleton } from "@/components/ui/skeleton";

// Sample student data
const students = [
  { id: '1', name: 'Abhay Kumar', progress: 85 },
];

const SupervisorDashboard = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [selectedStudent, setSelectedStudent] = useState(students[0]);
  const [activeTab, setActiveTab] = useState('progress');
  const [pendingMeetings, setPendingMeetings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load meetings from Supabase on component mount
  useEffect(() => {
    const loadMeetings = async () => {
      setIsLoading(true);
      try {
        const meetings = await getStoredMeetings();
        // Filter for pending meetings
        const pendingOnly = meetings.filter(meeting => meeting.status === 'Pending Approval');
        setPendingMeetings(pendingOnly);
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

  const handleStudentClick = (student) => {
    setSelectedStudent(student);
  };

  const handleTabNavigate = (tab) => {
    setActiveTab(tab);
    if (tab === 'dcMeetings') {
      navigate('/supervisor/dc-meetings');
    } else if (tab === 'publications') {
      navigate('/supervisor/publications');
    } else if (tab === 'exams') {
      navigate('/supervisor/exams');
    }
  };

  const handleViewMeeting = () => {
    navigate('/supervisor/dc-meetings');
  };

  const handleDownload = (meetingId) => {
    const meeting = pendingMeetings.find(m => m.id === meetingId);
    if (!meeting) return;
    
    // Get PDF URL
    let pdfUrl = meeting.fileData;
    if (!pdfUrl) {
      pdfUrl = getPdfUrl(meeting);
    }
    
    // Create an anchor element and set the attributes
    const a = document.createElement('a');
    a.href = pdfUrl;
    a.download = meeting.minutes; // Filename for download
    a.target = '_blank'; // Open in new tab if download doesn't start
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    
    toast({
      title: "Downloaded",
      description: `${meeting.minutes} downloaded successfully`,
    });
  };

  const handleViewPdf = (meetingId) => {
    const meeting = pendingMeetings.find(m => m.id === meetingId);
    if (!meeting) return;
    
    // Get PDF URL
    let pdfUrl = meeting.fileData;
    if (!pdfUrl) {
      pdfUrl = getPdfUrl(meeting);
    }
    
    // Open in a new tab
    window.open(pdfUrl, '_blank');
  };

  const handleApprove = async (meetingId) => {
    setIsLoading(true);
    try {
      const success = await updateMeetingStatus(meetingId, 'Approved');
      
      if (success) {
        // Remove from pending meetings
        setPendingMeetings(pendingMeetings.filter(m => m.id !== meetingId));
        
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

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen bg-blue-50">
        <div className="p-8">
          <div className="mb-8">
            <div className="bg-blue-600 text-white p-6 rounded-lg mb-8">
              <h1 className="text-2xl font-bold">PhD Supervisor Dashboard</h1>
            </div>
          </div>

          <div className="space-y-6">
            <Card className="border-orange-200 bg-orange-50">
              <CardHeader>
                <CardTitle className="text-orange-800 flex items-center">
                  <Skeleton className="h-6 w-40" />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Skeleton className="h-24 w-full" />
                  <Skeleton className="h-24 w-full" />
                </div>
              </CardContent>
            </Card>
            
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-64 w-full" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-blue-50">
      <div className="p-8">
        <div className="mb-8">
          <div className="bg-blue-600 text-white p-6 rounded-lg mb-8">
            <h1 className="text-2xl font-bold">PhD Supervisor Dashboard</h1>
          </div>
        </div>

        <div className="space-y-6">
          {/* Pending Approvals Section */}
          {pendingMeetings.length > 0 && (
            <Card className="border-orange-200 bg-orange-50">
              <CardHeader>
                <CardTitle className="text-orange-800 flex items-center">
                  Pending Approvals
                  <span className="ml-2 px-2 py-0.5 text-xs bg-orange-200 text-orange-800 rounded-full">
                    {pendingMeetings.length}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {pendingMeetings.slice(0, 3).map((meeting) => (
                    <div key={meeting.id} className="flex items-center justify-between border-b border-orange-100 pb-3 last:border-0 last:pb-0">
                      <div className="flex items-center">
                        <FileText className="h-10 w-10 text-orange-600 p-2 bg-orange-100 rounded mr-3" />
                        <div>
                          <p className="font-medium">{meeting.studentName}</p>
                          <p className="text-sm text-gray-600">DC Meeting on {meeting.date}</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-blue-600 border-blue-200 hover:bg-blue-50"
                          onClick={() => handleViewPdf(meeting.id)}
                        >
                          <FileText className="w-4 h-4 mr-1" />
                          View
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-blue-600 border-blue-200 hover:bg-blue-50"
                          onClick={() => handleDownload(meeting.id)}
                        >
                          <Download className="w-4 h-4 mr-1" />
                          Download
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          className="text-orange-600 border-orange-200 hover:bg-orange-100"
                          onClick={handleViewMeeting}
                        >
                          Review
                        </Button>
                      </div>
                    </div>
                  ))}
                  {pendingMeetings.length > 3 && (
                    <Button
                      variant="link"
                      className="text-orange-600"
                      onClick={handleViewMeeting}
                    >
                      View all {pendingMeetings.length} pending approvals
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* My Students Section */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-gray-100">
              <h2 className="text-xl font-semibold">My Students</h2>
            </div>
            
            <div className="p-5">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Name</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Progress</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((student) => (
                    <tr 
                      key={student.id}
                      className={`border-b hover:bg-blue-50 cursor-pointer ${
                        selectedStudent.id === student.id ? 'bg-blue-50' : ''
                      }`}
                      onClick={() => handleStudentClick(student)}
                    >
                      <td className="py-3 px-4 font-medium">{student.name}</td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <Progress value={student.progress} className="h-2 w-full max-w-xs" />
                          <span className="text-sm font-medium">{student.progress}%</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Student Details Section */}
          {selectedStudent && (
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="p-5 border-b border-gray-100">
                <h2 className="text-xl font-semibold">{selectedStudent.name} - Student Details</h2>
              </div>
              
              <div className="p-5">
                <Tabs defaultValue="progress" value={activeTab} onValueChange={handleTabNavigate}>
                  <TabsList className="mb-6">
                    <TabsTrigger value="progress">Progress</TabsTrigger>
                    <TabsTrigger value="dcMeetings">DC Meetings</TabsTrigger>
                    <TabsTrigger value="publications">Publications</TabsTrigger>
                    <TabsTrigger value="exams">Exams</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="progress">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Card>
                        <CardHeader className="pb-3">
                          <CardTitle className="text-lg">Coursework Progress</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-xl font-semibold">{selectedStudent.progress}%</div>
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardHeader className="pb-3">
                          <CardTitle className="text-lg">Research Proposal</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-xl font-semibold text-green-600">Approved</div>
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardHeader className="pb-3">
                          <CardTitle className="text-lg">DC Meetings Completed</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-xl font-semibold">3</div>
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardHeader className="pb-3">
                          <CardTitle className="text-lg">Total Publications</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-xl font-semibold">2</div>
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SupervisorDashboard;
