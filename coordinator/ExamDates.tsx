
import React, { useState } from 'react';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

const CoordinatorExamDates = () => {
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newExam, setNewExam] = useState({
    course: "",
    date: "",
    time: "",
    venue: ""
  });
  
  const [examDates, setExamDates] = useState([
    {
      id: 1,
      course: "Advanced Algorithms",
      date: "2024-04-15",
      time: "10:00 AM",
      venue: "Main Examination Hall"
    },
    {
      id: 2,
      course: "Machine Learning",
      date: "2024-04-20",
      time: "2:00 PM",
      venue: "Computer Science Department"
    }
  ]);

  const handleAnnounceExam = () => {
    setIsDialogOpen(true);
    setNewExam({
      course: "",
      date: "",
      time: "",
      venue: ""
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setNewExam(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const handleSubmitExam = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate inputs
    if (!newExam.course || !newExam.date || !newExam.time || !newExam.venue) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields.",
        variant: "destructive"
      });
      return;
    }
    
    // Add new exam to the list
    const newExamEntry = {
      id: examDates.length + 1,
      course: newExam.course,
      date: newExam.date,
      time: newExam.time,
      venue: newExam.venue
    };
    
    setExamDates([...examDates, newExamEntry]);
    setIsDialogOpen(false);
    
    toast({
      title: "Exam Announced",
      description: "The exam has been announced successfully.",
    });
  };

  return (
    <div className="bg-[#f8fafc]">
      <header className="py-4 px-8 bg-blue-600 text-white">
        <h1 className="text-2xl font-medium">PhD Coordinator Dashboard</h1>
      </header>
      
      <div className="p-6">
        <div className="mb-6 flex overflow-x-auto gap-8 pb-2">
          <a href="/coordinator/publications" className="text-gray-500 hover:text-blue-600">Research Publications</a>
          <a href="/coordinator/exam-results" className="text-gray-500 hover:text-blue-600">Exam Results</a>
          <a href="/coordinator/swayam-courses" className="text-gray-500 hover:text-blue-600">SWAYAM Courses</a>
          <a href="/coordinator/exam-dates" className="text-blue-600 border-b-2 border-blue-600 pb-2 font-medium">Exam Dates</a>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Exam Schedule Management</h2>
            <Button onClick={handleAnnounceExam}>
              Announce Exam Dates
            </Button>
          </div>
          
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Course</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Time</TableHead>
                <TableHead>Venue</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {examDates.map((exam) => (
                <TableRow key={exam.id}>
                  <TableCell>{exam.course}</TableCell>
                  <TableCell>{exam.date}</TableCell>
                  <TableCell>{exam.time}</TableCell>
                  <TableCell>{exam.venue}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Add Exam Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Announce New Exam</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmitExam}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="course" className="text-right">Course</Label>
                <Input 
                  id="course" 
                  className="col-span-3" 
                  value={newExam.course}
                  onChange={handleInputChange}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="date" className="text-right">Date</Label>
                <Input 
                  id="date" 
                  type="date" 
                  className="col-span-3" 
                  value={newExam.date}
                  onChange={handleInputChange}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="time" className="text-right">Time</Label>
                <Input 
                  id="time" 
                  type="time" 
                  className="col-span-3" 
                  value={newExam.time}
                  onChange={handleInputChange}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="venue" className="text-right">Venue</Label>
                <Input 
                  id="venue" 
                  className="col-span-3" 
                  value={newExam.venue}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">Announce Exam</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CoordinatorExamDates;
