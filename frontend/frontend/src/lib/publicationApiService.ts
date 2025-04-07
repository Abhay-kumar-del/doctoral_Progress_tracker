
import { toast } from '@/hooks/use-toast';

// Base API URL - should be configured from environment in a real app
const API_BASE_URL = 'http://localhost:8080/api';

/**
 * Type definition for a Publication
 */
export interface Publication {
  id: string;
  title: string;
  venue: string;
  authors: string;
  studentName: string;
  studentId: string;
  status: string;
  date: string;
  fileUrl?: string;
}

/**
 * Fetches all publications
 */
export const getAllPublications = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/publications`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        // Add authentication headers if needed
      }
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Error fetching publications:', errorData);
      
      toast({
        title: "Error",
        description: "Failed to fetch publications: " + (errorData.message || response.statusText),
        variant: "destructive",
      });
      
      return { 
        data: null, 
        error: { message: `Failed to fetch publications: ${errorData.message || response.statusText}` } 
      };
    }
    
    const data = await response.json();
    return { data, error: null };
  } catch (err: any) {
    console.error('Unexpected error in getAllPublications:', err);
    return { 
      data: null, 
      error: { message: 'An unexpected error occurred while fetching publications' } 
    };
  }
};

/**
 * Fetches publications for a specific student
 */
export const getStudentPublications = async (studentId: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/publications/student/${studentId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        // Add authentication headers if needed
      }
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Error fetching student publications:', errorData);
      
      toast({
        title: "Error",
        description: "Failed to fetch publications: " + (errorData.message || response.statusText),
        variant: "destructive",
      });
      
      return { 
        data: null, 
        error: { message: `Failed to fetch publications: ${errorData.message || response.statusText}` } 
      };
    }
    
    const data = await response.json();
    return { data, error: null };
  } catch (err: any) {
    console.error('Unexpected error in getStudentPublications:', err);
    return { 
      data: null, 
      error: { message: 'An unexpected error occurred while fetching student publications' } 
    };
  }
};

/**
 * Uploads a new publication
 */
export const uploadPublication = async (formData: FormData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/publications`, {
      method: 'POST',
      // No Content-Type header as FormData sets its own boundary
      body: formData
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Error uploading publication:', errorData);
      
      toast({
        title: "Error",
        description: "Failed to upload publication: " + (errorData.message || response.statusText),
        variant: "destructive",
      });
      
      return { 
        data: null, 
        error: { message: `Failed to upload publication: ${errorData.message || response.statusText}` } 
      };
    }
    
    const data = await response.json();
    return { data, error: null };
  } catch (err: any) {
    console.error('Unexpected error in uploadPublication:', err);
    return { 
      data: null, 
      error: { message: 'An unexpected error occurred while uploading publication' } 
    };
  }
};

/**
 * Updates a publication's validation status
 */
export const validatePublication = async (publicationId: string, validated: boolean) => {
  try {
    const response = await fetch(`${API_BASE_URL}/publications/${publicationId}/validate`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        // Add authentication headers if needed
      },
      body: JSON.stringify({ validated })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Error validating publication:', errorData);
      
      toast({
        title: "Error",
        description: "Failed to validate publication: " + (errorData.message || response.statusText),
        variant: "destructive",
      });
      
      return { 
        success: false, 
        error: { message: `Failed to validate publication: ${errorData.message || response.statusText}` } 
      };
    }
    
    return { success: true, error: null };
  } catch (err: any) {
    console.error('Unexpected error in validatePublication:', err);
    return { 
      success: false, 
      error: { message: 'An unexpected error occurred while validating publication' } 
    };
  }
};

/**
 * Downloads a publication file
 */
export const downloadPublicationFile = async (fileId: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/publications/file/${fileId}`, {
      method: 'GET',
      headers: {
        // Add authentication headers if needed
      }
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Error downloading file:', errorData);
      
      toast({
        title: "Error",
        description: "Failed to download file: " + (errorData.message || response.statusText),
        variant: "destructive",
      });
      
      return { 
        data: null, 
        error: { message: `Failed to download file: ${errorData.message || response.statusText}` } 
      };
    }
    
    const blob = await response.blob();
    const fileUrl = URL.createObjectURL(blob);
    return { data: { url: fileUrl }, error: null };
  } catch (err: any) {
    console.error('Unexpected error in downloadPublicationFile:', err);
    return { 
      data: null, 
      error: { message: 'An unexpected error occurred while downloading file' } 
    };
  }
};
