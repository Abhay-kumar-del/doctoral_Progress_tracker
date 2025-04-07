
import React, { useState } from 'react';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const CoordinatorExamResults = () => {
  const { toast } = useToast();
  
  const students = [
    {
      id: 1,
      name: "Abhay Kumar",
      term: "Spring 2024",
      courses: [
        { code: "CS501", name: "Advanced Algorithms", grade: "A", status: "Published" },
        { code: "CS502", name: "Machine Learning", grade: "A-", status: "Published" }
      ]
    },
    {
      id: 2,
      name: "Adarsh Kharwar",
      term: "Spring 2024",
      courses: [
        { code: "CS501", name: "Advanced Algorithms", grade: "B+", status: "Draft" }
      ]
    }
  ];

  const handlePublishResults = (studentId: number) => {
    toast({
      title: "Results Published",
      description: "The exam results have been published successfully.",
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
          <a href="/coordinator/exam-results" className="text-blue-600 border-b-2 border-blue-600 pb-2 font-medium">Exam Results</a>
          <a href="/coordinator/swayam-courses" className="text-gray-500 hover:text-blue-600">SWAYAM Courses</a>
          <a href="/coordinator/exam-dates" className="text-gray-500 hover:text-blue-600">Exam Dates</a>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
          <h2 className="text-xl font-semibold mb-6">Exam Results Management</h2>
          
          {students.map((student) => (
            <div key={student.id} className="mb-8 bg-blue-50 rounded-lg p-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">{student.name} - {student.term}</h3>
                <Button onClick={() => handlePublishResults(student.id)}>
                  Publish Results
                </Button>
              </div>
              
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Course Code</TableHead>
                    <TableHead>Course Name</TableHead>
                    <TableHead>Grade</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {student.courses.map((course, idx) => (
                    <TableRow key={idx}>
                      <TableCell>{course.code}</TableCell>
                      <TableCell>{course.name}</TableCell>
                      <TableCell>{course.grade}</TableCell>
                      <TableCell>{course.status}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CoordinatorExamResults;
