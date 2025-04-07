
import { toast } from '@/hooks/use-toast';

// Base API URL - should be configured from environment in a real app
const API_BASE_URL = 'http://localhost:8080/api';

/**
 * Service functions for interacting with Spring Boot API that handle specific
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
    
    const response = await fetch(`${API_BASE_URL}/swayam-courses`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Add authentication headers if needed
        // 'Authorization': `Bearer ${authToken}`
      },
      body: JSON.stringify(courseData)
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Error adding course:', errorData);
      
      toast({
        title: "Error",
        description: "Failed to add course: " + (errorData.message || response.statusText),
        variant: "destructive",
      });
      
      return { 
        data: null, 
        error: { message: `Failed to add course: ${errorData.message || response.statusText}` } 
      };
    }
    
    const data = await response.json();
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
    const response = await fetch(`${API_BASE_URL}/swayam-courses/${courseId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        // Add authentication headers if needed
      },
      body: JSON.stringify(courseData)
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Error updating course:', errorData);
      
      toast({
        title: "Error",
        description: "Failed to update course: " + (errorData.message || response.statusText),
        variant: "destructive",
      });
      
      return { 
        data: null, 
        error: { message: `Failed to update course: ${errorData.message || response.statusText}` } 
      };
    }
    
    const data = await response.json();
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
    const checkResponse = await fetch(`${API_BASE_URL}/student-courses/check/${courseId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        // Add authentication headers if needed
      }
    });

    if (!checkResponse.ok) {
      const errorData = await checkResponse.json();
      console.error('Error checking course usage:', errorData);
      return { 
        success: false, 
        error: { message: 'Could not verify if course is in use' } 
      };
    }

    const usageData = await checkResponse.json();
    if (usageData && usageData.length > 0) {
      return { 
        success: false, 
        error: { message: 'This course is registered by students and cannot be deleted' } 
      };
    }

    // If not in use, proceed with deletion
    const deleteResponse = await fetch(`${API_BASE_URL}/swayam-courses/${courseId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        // Add authentication headers if needed
      }
    });

    if (!deleteResponse.ok) {
      const errorData = await deleteResponse.json();
      console.error('Error deleting course:', errorData);
      
      toast({
        title: "Error",
        description: "Failed to delete course: " + (errorData.message || deleteResponse.statusText),
        variant: "destructive",
      });
      
      return { 
        success: false, 
        error: { message: `Failed to delete course: ${errorData.message || deleteResponse.statusText}` } 
      };
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
