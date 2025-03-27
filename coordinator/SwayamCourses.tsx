
import React, { useState } from 'react';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Check, X, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface Student {
  id: number;
  name: string;
  status: "Pending" | "Approved" | "Rejected";
}

interface Course {
  id: number;
  name: string;
  students: Student[];
}

const CoordinatorSwayamCourses = () => {
  const { toast } = useToast();
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [courseName, setCourseName] = useState("");
  const [courseProvider, setCourseProvider] = useState("");
  const [courseDescription, setCourseDescription] = useState("");
  
  const [courses, setCourses] = useState<Course[]>([
    {
      id: 1,
      name: "Introduction to Data Science - NPTEL",
      students: [
        { id: 1, name: "Abhay Kumar", status: "Pending" },
        { id: 2, name: "Robins", status: "Pending" }
      ]
    },
    {
      id: 2,
      name: "Advanced Machine Learning - SWAYAM",
      students: [
        { id: 3, name: "Adarsh Kharwar", status: "Pending" }
      ]
    }
  ]);

  const handleApprove = (courseId: number, studentId: number) => {
    setCourses(prevCourses => 
      prevCourses.map(course => {
        if (course.id === courseId) {
          return {
            ...course,
            students: course.students.map(student => 
              student.id === studentId 
                ? { ...student, status: "Approved" }
                : student
            )
          };
        }
        return course;
      })
    );
    
    toast({
      title: "Registration Approved",
      description: "The student registration has been approved.",
    });
  };

  const handleReject = (courseId: number, studentId: number) => {
    setCourses(prevCourses => 
      prevCourses.map(course => {
        if (course.id === courseId) {
          return {
            ...course,
            students: course.students.map(student => 
              student.id === studentId 
                ? { ...student, status: "Rejected" }
                : student
            )
          };
        }
        return course;
      })
    );
    
    toast({
      title: "Registration Rejected",
      description: "The student registration has been rejected.",
    });
  };

  const handleUploadCourse = () => {
    if (!courseName.trim() || !courseProvider.trim()) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    // Generate a new unique ID
    const newId = Math.max(0, ...courses.map(c => c.id)) + 1;
    
    // Create new course
    const newCourse: Course = {
      id: newId,
      name: `${courseName} - ${courseProvider}`,
      students: []
    };
    
    // Add to courses list
    setCourses(prevCourses => [...prevCourses, newCourse]);
    
    // Reset form
    setCourseName("");
    setCourseProvider("");
    setCourseDescription("");
    
    // Close dialog
    setIsUploadDialogOpen(false);
    
    toast({
      title: "Course Added",
      description: "The course has been successfully added.",
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
          <a href="/coordinator/swayam-courses" className="text-blue-600 border-b-2 border-blue-600 pb-2 font-medium">SWAYAM Courses</a>
          <a href="/coordinator/exam-dates" className="text-gray-500 hover:text-blue-600">Exam Dates</a>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">SWAYAM Courses Management</h2>
            
            <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-1 h-4 w-4" /> Upload Course
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Upload New Course</DialogTitle>
                  <DialogDescription>
                    Add a new SWAYAM course for students to register.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">
                      Course Name*
                    </Label>
                    <Input
                      id="name"
                      value={courseName}
                      onChange={(e) => setCourseName(e.target.value)}
                      className="col-span-3"
                      placeholder="e.g. Advanced Machine Learning"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="provider" className="text-right">
                      Provider*
                    </Label>
                    <Input
                      id="provider"
                      value={courseProvider}
                      onChange={(e) => setCourseProvider(e.target.value)}
                      className="col-span-3"
                      placeholder="e.g. NPTEL or SWAYAM"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="description" className="text-right">
                      Description
                    </Label>
                    <Textarea
                      id="description"
                      value={courseDescription}
                      onChange={(e) => setCourseDescription(e.target.value)}
                      className="col-span-3"
                      placeholder="Course description (optional)"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit" onClick={handleUploadCourse}>Add Course</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
          
          {courses.map((course) => (
            <div key={course.id} className="mb-8 bg-blue-50 rounded-lg p-4">
              <h3 className="text-lg font-medium mb-4">{course.name}</h3>
              
              {course.students.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Student Name</TableHead>
                      <TableHead>Registration Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {course.students.map((student) => (
                      <TableRow key={student.id}>
                        <TableCell>{student.name}</TableCell>
                        <TableCell>
                          <span 
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              student.status === 'Approved' 
                                ? 'bg-green-100 text-green-700' 
                                : student.status === 'Rejected'
                                  ? 'bg-red-100 text-red-700'
                                  : 'bg-yellow-100 text-yellow-700'
                            }`}
                          >
                            {student.status}
                          </span>
                        </TableCell>
                        <TableCell className="flex justify-end gap-2">
                          {student.status === 'Pending' && (
                            <>
                              <Button 
                                variant="outline" 
                                size="sm"
                                className="bg-green-50 text-green-600 hover:bg-green-100 border-green-200"
                                onClick={() => handleApprove(course.id, student.id)}
                              >
                                <Check className="mr-1 h-4 w-4" /> Approve
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm"
                                className="bg-red-50 text-red-600 hover:bg-red-100 border-red-200"
                                onClick={() => handleReject(course.id, student.id)}
                              >
                                <X className="mr-1 h-4 w-4" /> Reject
                              </Button>
                            </>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <p className="text-gray-500 text-center py-4">No student registrations yet.</p>
              )}
            </div>
          ))}
          
          {courses.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <p>No courses available. Upload a course to get started.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CoordinatorSwayamCourses;
