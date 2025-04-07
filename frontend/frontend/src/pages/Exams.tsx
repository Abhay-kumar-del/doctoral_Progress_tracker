
import React, { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import { useAuth } from '@/contexts/AuthContext';
import StatusBadge from '@/components/StatusBadge';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Check, X } from "lucide-react";

interface Exam {
  id: string;
  name: string;
  date: string;
  status: string;
}

// Shared data between student and supervisor views
const mockExamRequests = [
  { id: '1', name: 'Comprehensive Exam', date: '2024-02-25', status: 'Passed' },
  { id: '2', name: 'Advanced Algorithms', date: '2024-03-10', status: 'Pending' },
  { id: '3', name: 'Machine Learning', date: '2024-02-25', status: 'Pending' },
];

const Exams: React.FC = () => {
  const { userName, userRole } = useAuth();
  const { toast } = useToast();
  const [examRequests, setExamRequests] = useState<Exam[]>(mockExamRequests);
  const [open, setOpen] = useState(false);
  const [newRequest, setNewRequest] = useState({
    examName: '',
    examDate: '',
    reason: ''
  });

  const handleSubmitRequest = () => {
    if (!newRequest.examName || !newRequest.examDate || !newRequest.reason) {
      toast({
        title: "Error",
        description: "Please fill all fields",
        variant: "destructive",
      });
      return;
    }

    const newExam: Exam = {
      id: Date.now().toString(),
      name: newRequest.examName,
      date: newRequest.examDate,
      status: 'Pending'
    };

    setExamRequests([...examRequests, newExam]);
    setOpen(false);
    setNewRequest({ examName: '', examDate: '', reason: '' });

    toast({
      title: "Request Submitted",
      description: "Your re-examination request has been submitted successfully",
    });
  };

  const handleApprove = (id: string) => {
    setExamRequests(examRequests.map(exam => 
      exam.id === id ? { ...exam, status: 'Approved' } : exam
    ));
    
    toast({
      title: "Request Approved",
      description: "The re-examination request has been approved",
    });
  };

  const handleReject = (id: string) => {
    setExamRequests(examRequests.map(exam => 
      exam.id === id ? { ...exam, status: 'Rejected' } : exam
    ));
    
    toast({
      title: "Request Rejected",
      description: "The re-examination request has been rejected",
      variant: "destructive",
    });
  };

  const isSupervisor = userRole === 'supervisor';

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
          <h1 className="text-2xl font-bold text-gray-900">Exams</h1>
          <p className="text-gray-500">View and manage examination requests</p>
        </div>

        {isSupervisor && (
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden mb-8">
            <div className="p-5 border-b border-gray-100">
              <h2 className="text-xl font-semibold">Abhay Kumar - Student Details</h2>
            </div>
          </div>
        )}
        
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-gray-100">
            <h2 className="text-xl font-semibold">Exam Requests</h2>
          </div>
          
          <div className="p-5">
            {userRole !== 'supervisor' && (
              <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                  <Button className="w-full mb-6 bg-blue-500 hover:bg-blue-600">
                    Request Re-examination
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Request Re-examination</DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="examName">Exam Name</Label>
                      <Input 
                        id="examName" 
                        value={newRequest.examName}
                        onChange={(e) => setNewRequest({...newRequest, examName: e.target.value})}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="examDate">Preferred Date</Label>
                      <Input 
                        id="examDate" 
                        type="date"
                        value={newRequest.examDate}
                        onChange={(e) => setNewRequest({...newRequest, examDate: e.target.value})}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="reason">Reason for Re-examination</Label>
                      <textarea 
                        id="reason"
                        className="min-h-[100px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        value={newRequest.reason}
                        onChange={(e) => setNewRequest({...newRequest, reason: e.target.value})}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button onClick={handleSubmitRequest}>Submit Request</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            )}

            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Date</th>
                  {isSupervisor && (
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Student</th>
                  )}
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Course</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Status</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {examRequests.filter(exam => exam.status === 'Pending' || exam.status === 'Passed' || userRole !== 'supervisor').map((exam) => (
                  <tr key={exam.id} className="border-b last:border-0">
                    <td className="py-3 px-4">{exam.date}</td>
                    {isSupervisor && (
                      <td className="py-3 px-4">Abhay Kumar</td>
                    )}
                    <td className="py-3 px-4">{exam.name}</td>
                    <td className="py-3 px-4">
                      <StatusBadge status={exam.status} />
                    </td>
                    <td className="py-3 px-4 text-right">
                      {isSupervisor && exam.status === 'Pending' && (
                        <div className="flex justify-end gap-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="bg-green-50 text-green-600 border-green-200 hover:bg-green-100"
                            onClick={() => handleApprove(exam.id)}
                          >
                            <Check className="w-4 h-4 mr-1" />
                            Approve
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="bg-red-50 text-red-600 border-red-200 hover:bg-red-100"
                            onClick={() => handleReject(exam.id)}
                          >
                            <X className="w-4 h-4 mr-1" />
                            Reject
                          </Button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Exams;
