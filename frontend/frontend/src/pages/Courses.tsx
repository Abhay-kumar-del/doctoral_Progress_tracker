
import React, { useState, useEffect } from 'react';
import { Search, Plus, ArrowLeft } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

interface Course {
  id: string;
  name: string;
  provider: string;
  duration: string;
  isRegistered?: boolean;
  status?: "Pending" | "Approved" | "Rejected" | "Registered";
}

const Courses: React.FC = () => {
  const { toast } = useToast();
  const { userId } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [availableCourses, setAvailableCourses] = useState<Course[]>([]);
  const [registeredCourses, setRegisteredCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  const handleBackToDashboard = () => {
    navigate('/');
  };
  
  // Fetch available courses
  useEffect(() => {
    const fetchAvailableCourses = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('swayam_courses')
          .select('*');
        
        if (error) {
          console.error('Error fetching courses:', error);
          setLoading(false);
          return;
        }
        
        setAvailableCourses(data || []);
        setLoading(false);
      } catch (err) {
        console.error('Error in courses fetch:', err);
        setLoading(false);
      }
    };

    fetchAvailableCourses();
  }, []);

  // Fetch registered courses
  useEffect(() => {
    const fetchRegisteredCourses = async () => {
      if (!userId) return;
      
      try {
        const { data, error } = await supabase
          .from('student_courses')
          .select(`
            id,
            status,
            swayam_courses (
              id,
              name,
              provider,
              duration
            )
          `)
          .eq('student_id', userId);
        
        if (error) {
          console.error('Error fetching registered courses:', error);
          return;
        }
        
        if (data) {
          const mappedCourses: Course[] = data.map(item => ({
            id: item.swayam_courses.id,
            name: item.swayam_courses.name,
            provider: item.swayam_courses.provider,
            duration: item.swayam_courses.duration,
            isRegistered: true,
            status: item.status as "Pending" | "Approved" | "Rejected" | "Registered"
          }));
          
          setRegisteredCourses(mappedCourses);
        }
      } catch (err) {
        console.error('Error in registered courses fetch:', err);
      }
    };

    fetchRegisteredCourses();
  }, [userId]);

  const handleRegister = async (course: Course) => {
    if (!userId) {
      toast({
        title: "Authentication Required",
        description: "Please login to register for courses",
        variant: "destructive",
      });
      return;
    }

    // Check if course is already registered
    if (registeredCourses.some(c => c.id === course.id)) {
      toast({
        title: "Already Registered",
        description: `You are already registered for ${course.name}`,
        variant: "destructive",
      });
      return;
    }

    try {
      // Add to Supabase
      const { error } = await supabase.from('student_courses').insert({
        course_id: course.id,
        student_id: userId,
        status: 'Pending' // Initial status is pending until coordinator approves
      });

      if (error) {
        console.error('Error registering for course:', error);
        toast({
          title: "Registration Failed",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      // Add to local state
      const newRegisteredCourse: Course = { 
        ...course, 
        isRegistered: true, 
        status: 'Pending'
      };
      
      setRegisteredCourses([...registeredCourses, newRegisteredCourse]);

      toast({
        title: "Registration Submitted",
        description: `Your registration for ${course.name} is pending approval.`,
      });
    } catch (err) {
      console.error('Error in course registration:', err);
      toast({
        title: "Registration Failed",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    }
  };

  // Filter courses based on search query
  const filteredCourses = availableCourses.filter(course =>
    course.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    course.provider.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Loading skeletons for better UX
  const renderSkeletons = () => (
    <>
      {[1, 2, 3].map((i) => (
        <div key={i} className="p-4 mb-3 border rounded-lg">
          <div className="flex justify-between items-start">
            <div className="w-3/4">
              <Skeleton className="h-5 w-full mb-2" />
              <Skeleton className="h-4 w-1/2" />
            </div>
            <Skeleton className="h-8 w-24 rounded-lg" />
          </div>
        </div>
      ))}
    </>
  );

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 p-6">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Courses</h1>
        <Button 
          variant="default" 
          onClick={handleBackToDashboard}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Button>
      </div>
      
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Available SWAYAM Courses */}
        <div className="w-full lg:w-1/2">
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="p-4 border-b">
              <h2 className="text-lg font-medium flex items-center gap-2">
                <div className="w-4 h-4 border border-gray-400 rounded"></div>
                Available SWAYAM Courses
              </h2>
            </div>
            
            {/* Search input */}
            <div className="p-4">
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Search courses"
                  className="pl-10 pr-4 py-2"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              </div>
            </div>
            
            {/* Course listing */}
            <div className="p-4">
              {loading ? (
                renderSkeletons()
              ) : filteredCourses.length === 0 ? (
                <p className="text-center text-gray-500 py-4">No courses match your search</p>
              ) : (
                filteredCourses.map((course) => (
                  <div key={course.id} className="p-4 mb-3 border rounded-lg">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium">{course.name}</h3>
                        <p className="text-sm text-gray-500">{course.provider} | {course.duration}</p>
                      </div>
                      <button
                        onClick={() => handleRegister(course)}
                        className="flex items-center gap-1 px-3 py-1 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600"
                      >
                        <Plus className="w-4 h-4" />
                        Register
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
        
        {/* Registered Courses */}
        <div className="w-full lg:w-1/2">
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="p-4 border-b">
              <h2 className="text-lg font-medium">Registered Courses</h2>
            </div>
            
            {/* Registered course listing */}
            <div className="p-4">
              {loading ? (
                renderSkeletons()
              ) : registeredCourses.length === 0 ? (
                <p className="text-center text-gray-500 py-4">No registered courses</p>
              ) : (
                registeredCourses.map((course) => (
                  <div key={course.id} className="p-4 mb-3 border rounded-lg">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-medium">{course.name}</h3>
                        <p className="text-sm text-gray-500">{course.provider}</p>
                      </div>
                      <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                        course.status === 'Approved' ? 'bg-green-100 text-green-800' : 
                        course.status === 'Rejected' ? 'bg-red-100 text-red-800' : 
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {course.status}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Courses;
