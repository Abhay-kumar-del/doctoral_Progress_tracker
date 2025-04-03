
import React, { useState, useEffect } from 'react';
import { Search, Plus } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";

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
  const [searchQuery, setSearchQuery] = useState('');
  const [availableCourses, setAvailableCourses] = useState<Course[]>([]);
  const [registeredCourses, setRegisteredCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  // Fallback courses data - always ensure we have something to display
  const fallbackAvailableCourses: Course[] = [
    { id: '1', name: 'Advanced Machine Learning', provider: 'NPTEL', duration: '12 weeks' },
    { id: '2', name: 'Data Science Fundamentals', provider: 'SWAYAM', duration: '10 weeks' },
    { id: '3', name: 'Research Methodology', provider: 'IGNOU', duration: '8 weeks' },
    { id: '4', name: 'Artificial Intelligence and Ethics', provider: 'SWAYAM', duration: '6 weeks' },
    { id: '5', name: 'Deep Learning for Computer Vision', provider: 'NPTEL', duration: '8 weeks' },
  ];
  
  const fallbackRegisteredCourses: Course[] = [
    { id: '1', name: 'Advanced Machine Learning', provider: 'NPTEL', duration: '12 weeks', isRegistered: true, status: 'Registered' },
  ];

  // Fetch available courses
  useEffect(() => {
    const fetchAvailableCourses = async () => {
      try {
        setLoading(true);
        // Simulate API call delay
        setTimeout(() => {
          setAvailableCourses(fallbackAvailableCourses);
          setLoading(false);
        }, 1000);
      } catch (err) {
        console.error('Error fetching available courses:', err);
        setAvailableCourses(fallbackAvailableCourses);
        setLoading(false);
      }
    };

    fetchAvailableCourses();
  }, []);

  // Fetch registered courses
  useEffect(() => {
    const fetchRegisteredCourses = async () => {
      try {
        // Simulate API call
        setTimeout(() => {
          setRegisteredCourses(fallbackRegisteredCourses);
        }, 800);
      } catch (err) {
        console.error('Error fetching registered courses:', err);
        setRegisteredCourses(fallbackRegisteredCourses);
      }
    };

    fetchRegisteredCourses();
  }, []);

  const handleRegister = (course: Course) => {
    // Check if course is already registered
    if (registeredCourses.some(c => c.id === course.id)) {
      toast({
        title: "Already Registered",
        description: `You are already registered for ${course.name}`,
        variant: "destructive",
      });
      return;
    }

    // Add course to registered courses with registered status
    const newRegisteredCourse: Course = { 
      ...course, 
      isRegistered: true, 
      status: 'Registered'
    };
    
    setRegisteredCourses([...registeredCourses, newRegisteredCourse]);

    toast({
      title: "Registration Successful",
      description: `You have successfully registered for ${course.name}.`,
    });
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
                      <div className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs">
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
