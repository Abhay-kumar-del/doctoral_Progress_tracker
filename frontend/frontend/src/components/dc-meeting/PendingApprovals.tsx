
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Download, Check, X } from "lucide-react";
import { DCMeeting } from '@/lib/dcMeetingUtils';

interface PendingApprovalsProps {
  meetings: DCMeeting[];
  onViewPdf: (meetingId: string) => void;
  onDownload: (meetingId: string) => void;
  onApprove: (meetingId: string) => void;
  onRequestModification: (meetingId: string) => void;
}

const PendingApprovals: React.FC<PendingApprovalsProps> = ({ 
  meetings, 
  onViewPdf, 
  onDownload, 
  onApprove, 
  onRequestModification 
}) => {
  const pendingMeetings = meetings.filter(meeting => meeting.status === 'Pending Approval');

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden mb-8">
      <div className="p-5 border-b border-gray-100">
        <h2 className="text-xl font-semibold">Pending Approvals</h2>
      </div>
      <div className="p-5">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {pendingMeetings.map(meeting => (
            <Card key={meeting.id} className="overflow-hidden">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">{meeting.studentName}</CardTitle>
                <div className="text-sm text-gray-500">{meeting.date}</div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center mb-3">
                  <FileText className="mr-2 h-5 w-5 text-blue-500" />
                  <span className="text-sm truncate">{meeting.minutes}</span>
                </div>
                <div className="flex gap-2 mt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    className="inline-flex items-center"
                    onClick={() => onViewPdf(meeting.id)}
                  >
                    <FileText className="w-4 h-4 mr-1" />
                    View
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="inline-flex items-center"
                    onClick={() => onDownload(meeting.id)}
                  >
                    <Download className="w-4 h-4 mr-1" />
                    Download
                  </Button>
                </div>
                <div className="flex gap-2 mt-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="flex-1 bg-green-50 text-green-600 border-green-200 hover:bg-green-100"
                    onClick={() => onApprove(meeting.id)}
                  >
                    <Check className="w-4 h-4 mr-1" />
                    Approve
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="flex-1 bg-red-50 text-red-600 border-red-200 hover:bg-red-100"
                    onClick={() => onRequestModification(meeting.id)}
                  >
                    <X className="w-4 h-4 mr-1" />
                    Reject
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
          {pendingMeetings.length === 0 && (
            <p className="text-gray-500 col-span-full p-4">No pending approvals</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default PendingApprovals;
