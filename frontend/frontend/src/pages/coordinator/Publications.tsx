
import React from 'react';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const CoordinatorPublications = () => {
  const navigate = useNavigate();
  const publications = [
    {
      id: 1,
      student: "Abhay Kumar",
      title: "Advanced Machine Learning Techniques",
      venue: "IEEE Conference",
      status: "Published",
      date: "2024-02-15"
    },
    {
      id: 2,
      student: "Abhay Kumar",
      title: "Data Privacy Frameworks",
      venue: "ACM Journal",
      status: "Under Review",
      date: "2024-03-01"
    },
    {
      id: 3,
      student: "Adarsh Kharwar",
      title: "Quantum Computing Algorithms",
      venue: "Nature Physics",
      status: "Submitted",
      date: "2024-02-20"
    }
  ];

  const handleBackToDashboard = () => {
    navigate('/coordinator');
  };

  return (
    <div className="bg-[#f8fafc]">
      <header className="py-4 px-8 bg-blue-600 text-white">
        <h1 className="text-2xl font-medium">PhD Coordinator Dashboard</h1>
      </header>
      
      <div className="p-6">
        <div className="mb-4 flex justify-between items-center">
          <div className="mb-6 flex overflow-x-auto gap-8 pb-2">
            <a href="/coordinator/publications" className="text-blue-600 border-b-2 border-blue-600 pb-2 font-medium">Research Publications</a>
            <a href="/coordinator/exam-results" className="text-gray-500 hover:text-blue-600">Exam Results</a>
            <a href="/coordinator/swayam-courses" className="text-gray-500 hover:text-blue-600">SWAYAM Courses</a>
            <a href="/coordinator/exam-dates" className="text-gray-500 hover:text-blue-600">Exam Dates</a>
          </div>
          
          <Button 
            variant="outline" 
            onClick={handleBackToDashboard}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Button>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
          <h2 className="text-xl font-semibold mb-6">Student Research Publications</h2>
          
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student</TableHead>
                <TableHead>Publication Title</TableHead>
                <TableHead>Venue</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {publications.map((pub) => (
                <TableRow key={pub.id}>
                  <TableCell>{pub.student}</TableCell>
                  <TableCell>{pub.title}</TableCell>
                  <TableCell>{pub.venue}</TableCell>
                  <TableCell>{pub.status}</TableCell>
                  <TableCell>{pub.date}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default CoordinatorPublications;
