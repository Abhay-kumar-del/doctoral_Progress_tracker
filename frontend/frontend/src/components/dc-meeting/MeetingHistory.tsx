
import React from 'react';
import { Button } from "@/components/ui/button";
import { FileText, Download, Check, X, Info } from "lucide-react";
import StatusBadge from '@/components/StatusBadge';
import { DCMeeting } from '@/lib/dcMeetingUtils';

interface MeetingHistoryProps {
  meetings: DCMeeting[];
  isSupervisor: boolean;
  onViewPdf: (meetingId: string) => void;
  onDownload: (meetingId: string) => void;
  onApprove: (meetingId: string) => void;
  onRequestModification: (meetingId: string) => void;
  onViewModificationDetails: (meetingId: string) => void;
}

const MeetingHistory: React.FC<MeetingHistoryProps> = ({ 
  meetings, 
  isSupervisor, 
  onViewPdf, 
  onDownload, 
  onApprove, 
  onRequestModification,
  onViewModificationDetails
}) => {
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="p-5 border-b border-gray-100">
        <h2 className="text-xl font-semibold">Meeting History</h2>
      </div>
      
      <div className="p-5">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4 font-medium text-gray-700">Date</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Status</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">File</th>
                <th className="text-right py-3 px-4 font-medium text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {meetings.map((meeting) => (
                <tr key={meeting.id} className="border-b last:border-0">
                  <td className="py-3 px-4">{meeting.date}</td>
                  <td className="py-3 px-4">
                    <StatusBadge status={meeting.status} />
                    {meeting.status === 'Needs Modification' && (
                      <button
                        onClick={() => onViewModificationDetails(meeting.id)}
                        className="ml-2 text-blue-500 hover:text-blue-700 inline-flex items-center"
                      >
                        <Info className="w-4 h-4" />
                      </button>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center">
                      <FileText className="mr-2 h-4 w-4 text-blue-500" />
                      <span className="text-sm">{meeting.minutes}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      className="mr-2 inline-flex items-center"
                      onClick={() => onViewPdf(meeting.id)}
                    >
                      <FileText className="w-4 h-4 mr-1" />
                      View
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="mr-2 inline-flex items-center"
                      onClick={() => onDownload(meeting.id)}
                    >
                      <Download className="w-4 h-4 mr-1" />
                      Download
                    </Button>
                    
                    {isSupervisor && meeting.status === 'Pending Approval' && (
                      <>
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="mr-2 bg-green-50 text-green-600 border-green-200 hover:bg-green-100"
                          onClick={() => onApprove(meeting.id)}
                        >
                          <Check className="w-4 h-4 mr-1" />
                          Approve
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="bg-red-50 text-red-600 border-red-200 hover:bg-red-100"
                          onClick={() => onRequestModification(meeting.id)}
                        >
                          <X className="w-4 h-4 mr-1" />
                          Reject
                        </Button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
              {meetings.length === 0 && (
                <tr>
                  <td colSpan={4} className="py-6 text-center text-gray-500">
                    No meeting records found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default MeetingHistory;
