
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

/**
 * Service functions for interacting with Supabase that handle specific
 * use cases and permissions requirements
 */

/**
 * Adds a new SWAYAM course as a coordinator
 */
export const addSwayamCourse = async (courseData: {
  name: string;
  provider: string;
  duration: string;
  description?: string;
}) => {
  try {
    console.log('Adding SWAYAM course:', courseData);
    
    const { data, error } = await supabase
      .from('swayam_courses')
      .insert(courseData)
      .select();

    if (error) {
      console.error('Error adding course:', error);
      
      toast({
        title: "Error",
        description: "Failed to add course: " + error.message,
        variant: "destructive",
      });
      
      return { data: null, error };
    }
    
    return { data, error: null };
  } catch (err: any) {
    console.error('Unexpected error in addSwayamCourse:', err);
    return { 
      data: null, 
      error: { message: 'An unexpected error occurred' } 
    };
  }
};

/**
 * Updates a SWAYAM course as a coordinator
 */
export const updateSwayamCourse = async (
  courseId: string,
  courseData: {
    name?: string;
    provider?: string;
    duration?: string;
    description?: string;
  }
) => {
  try {
    const { data, error } = await supabase
      .from('swayam_courses')
      .update(courseData)
      .eq('id', courseId)
      .select();

    if (error) {
      console.error('Error updating course:', error);
      
      toast({
        title: "Error",
        description: "Failed to update course: " + error.message,
        variant: "destructive",
      });
      
      return { data: null, error };
    }
    
    return { data, error: null };
  } catch (err: any) {
    console.error('Unexpected error in updateSwayamCourse:', err);
    return { 
      data: null, 
      error: { message: 'An unexpected error occurred' } 
    };
  }
};

/**
 * Deletes a SWAYAM course as a coordinator
 */
export const deleteSwayamCourse = async (courseId: string) => {
  try {
    // First check if the course is in use
    const { data: usageData, error: usageError } = await supabase
      .from('student_courses')
      .select('id')
      .eq('course_id', courseId)
      .limit(1);

    if (usageError) {
      console.error('Error checking course usage:', usageError);
      return { 
        success: false, 
        error: { message: 'Could not verify if course is in use' } 
      };
    }

    if (usageData && usageData.length > 0) {
      return { 
        success: false, 
        error: { message: 'This course is registered by students and cannot be deleted' } 
      };
    }

    // If not in use, proceed with deletion
    const { error } = await supabase
      .from('swayam_courses')
      .delete()
      .eq('id', courseId);

    if (error) {
      console.error('Error deleting course:', error);
      
      toast({
        title: "Error",
        description: "Failed to delete course: " + error.message,
        variant: "destructive",
      });
      
      return { success: false, error };
    }
    
    return { success: true, error: null };
  } catch (err: any) {
    console.error('Unexpected error in deleteSwayamCourse:', err);
    return { 
      success: false, 
      error: { message: 'An unexpected error occurred' } 
    };
  }
};
