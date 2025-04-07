import React, { useState, useEffect } from 'react';
import { PlusCircle, Search, Pencil, Trash, AlertCircle } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Skeleton } from "@/components/ui/skeleton";
import { addSwayamCourse, updateSwayamCourse, deleteSwayamCourse } from '@/lib/supabaseService';

interface Course {
  id: string;
  name: string;
  provider: string;
  duration: string;
  description: string;
  created_at: string;
}

const CoordinatorSwayamCourses: React.FC = () => {
  const { toast } = useToast();
  const { userId, userRole } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [courseModalOpen, setCourseModalOpen] = useState(false);
  const [currentCourse, setCurrentCourse] = useState<Partial<Course>>({
    name: '',
    provider: 'SWAYAM',
    duration: '',
    description: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [courseToDelete, setCourseToDelete] = useState<string | null>(null);

  useEffect(() => {
    fetchCourses();
  }, []);

  useEffect(() => {
    if (searchQuery) {
      const filtered = courses.filter(course => 
        course.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        course.provider.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredCourses(filtered);
    } else {
      setFilteredCourses(courses);
    }
  }, [searchQuery, courses]);

  const fetchCourses = async () => {
    setIsLoading(true);
    try {
      console.log('Fetching courses as', userRole);

      // Try to get all courses as coordinator
      const { data, error } = await supabase
        .from('swayam_courses')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (error) {
        console.error('Error fetching courses:', error);
        toast({
          title: "Error",
          description: "Could not fetch courses. " + error.message,
          variant: "destructive",
        });
        return;
      }
      
      setCourses(data || []);
      setFilteredCourses(data || []);
    } catch (err) {
      console.error('Error in fetchCourses:', err);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddCourse = async () => {
    try {
      if (!currentCourse.name || !currentCourse.provider || !currentCourse.duration) {
        toast({
          title: "Missing Information",
          description: "Please fill in all required fields",
          variant: "destructive",
        });
        return;
      }

      // For editing an existing course
      if (isEditing && currentCourse.id) {
        const { error } = await updateSwayamCourse(currentCourse.id, {
          name: currentCourse.name,
          provider: currentCourse.provider,
          duration: currentCourse.duration,
          description: currentCourse.description || ''
        });

        if (error) {
          toast({
            title: "Error",
            description: "Failed to update course: " + error.message,
            variant: "destructive",
          });
          return;
        }

        toast({
          title: "Success",
          description: "Course updated successfully",
        });
      } 
      // For adding a new course
      else {
        console.log('Adding new course:', currentCourse);
        const { error } = await addSwayamCourse({
          name: currentCourse.name,
          provider: currentCourse.provider,
          duration: currentCourse.duration,
          description: currentCourse.description || ''
        });

        if (error) {
          toast({
            title: "Error",
            description: "Failed to add course: " + error.message,
            variant: "destructive",
          });
          return;
        }

        toast({
          title: "Success",
          description: "Course added successfully",
        });
      }

      // Reset form and refresh courses
      setCurrentCourse({
        name: '',
        provider: 'SWAYAM',
        duration: '',
        description: ''
      });
      setCourseModalOpen(false);
      setIsEditing(false);
      fetchCourses();
    } catch (err) {
      console.error('Error in handleAddCourse:', err);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    }
  };

  const openEditModal = (course: Course) => {
    setCurrentCourse(course);
    setIsEditing(true);
    setCourseModalOpen(true);
  };

  const openDeleteConfirmation = (courseId: string) => {
    setCourseToDelete(courseId);
    setDeleteConfirmOpen(true);
  };

  const handleDeleteCourse = async () => {
    if (!courseToDelete) return;

    try {
      const { success, error } = await deleteSwayamCourse(courseToDelete);

      if (!success) {
        toast({
          title: "Error",
          description: error?.message || "Failed to delete course",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Success",
        description: "Course deleted successfully",
      });

      // Refresh course list
      fetchCourses();
    } catch (err) {
      console.error('Error in handleDeleteCourse:', err);
      toast({
        title: "Error",
        description: "An unexpected error occurred while deleting the course",
        variant: "destructive",
      });
    } finally {
      setDeleteConfirmOpen(false);
      setCourseToDelete(null);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setCurrentCourse(prev => ({ ...prev, [id]: value }));
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
        <div>
          <h1 className="text-2xl font-bold">SWAYAM Courses</h1>
          <p className="text-gray-500">Manage SWAYAM courses available for PhD students</p>
        </div>
        <Button 
          variant="default" 
          onClick={() => {
            setCurrentCourse({
              name: '',
              provider: 'SWAYAM',
              duration: '',
              description: ''
            });
            setIsEditing(false);
            setCourseModalOpen(true);
          }}
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          Upload Course
        </Button>
      </div>

      <div className="relative w-full md:w-1/3">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
        <Input
          placeholder="Search courses..."
          className="pl-9"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="border rounded-lg p-4 space-y-3">
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-4 w-1/3" />
              <Skeleton className="h-4 w-full" />
            </div>
          ))}
        </div>
      ) : filteredCourses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCourses.map((course) => (
            <div key={course.id} className="border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex justify-between">
                <h3 className="font-semibold text-lg">{course.name}</h3>
                <div className="flex space-x-2">
                  <button 
                    onClick={() => openEditModal(course)}
                    className="text-blue-500 hover:text-blue-700"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button 
                    onClick={() => openDeleteConfirmation(course.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <p className="text-sm text-gray-600">{course.provider}</p>
              <p className="text-sm text-gray-600">Duration: {course.duration}</p>
              {course.description && (
                <p className="text-sm text-gray-500 mt-2 line-clamp-2">{course.description}</p>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <AlertCircle className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-lg font-medium text-gray-900">No courses found</h3>
          <p className="mt-1 text-gray-500">
            {searchQuery 
              ? "No courses match your search criteria"
              : "Start by adding a new SWAYAM course"}
          </p>
        </div>
      )}

      {/* Course Add/Edit Modal */}
      <Dialog open={courseModalOpen} onOpenChange={setCourseModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{isEditing ? "Edit Course" : "Upload New Course"}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label htmlFor="name" className="text-sm font-medium">
                Course Name*
              </label>
              <Input
                id="name"
                value={currentCourse.name}
                onChange={handleInputChange}
                placeholder="Enter course name"
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="provider" className="text-sm font-medium">
                Provider*
              </label>
              <Input
                id="provider"
                value={currentCourse.provider}
                onChange={handleInputChange}
                placeholder="e.g., SWAYAM, Coursera"
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="duration" className="text-sm font-medium">
                Duration*
              </label>
              <Input
                id="duration"
                value={currentCourse.duration}
                onChange={handleInputChange}
                placeholder="e.g., 6 weeks, 3 months"
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="description" className="text-sm font-medium">
                Description
              </label>
              <textarea
                id="description"
                value={currentCourse.description}
                onChange={handleInputChange}
                className="min-h-[100px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                placeholder="Add course description (optional)"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCourseModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddCourse}>
              {isEditing ? "Save Changes" : "Add Course"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-gray-500">
              Are you sure you want to delete this course? This action cannot be undone.
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteConfirmOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteCourse}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CoordinatorSwayamCourses;
