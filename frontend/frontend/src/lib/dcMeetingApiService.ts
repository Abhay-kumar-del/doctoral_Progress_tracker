
import { toast } from '@/hooks/use-toast';

// Base API URL - should be configured from environment in a real app
const API_BASE_URL = 'http://localhost:8080/api';

/**
 * Type definition for a DC Meeting
 */
export interface DCMeeting {
  id: string;
  studentName: string;
  studentId: string;
  minutes: string;
  date: string;
  status: string;
  modificationNote?: string;
  fileData?: string;
}

/**
 * Fetches all DC meetings
 */
export const getAllMeetings = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/dc-meetings`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        // Add authentication headers if needed
      }
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Error fetching meetings:', errorData);
      
      toast({
        title: "Error",
        description: "Failed to fetch meetings: " + (errorData.message || response.statusText),
        variant: "destructive",
      });
      
      return { 
        data: null, 
        error: { message: `Failed to fetch meetings: ${errorData.message || response.statusText}` } 
      };
    }
    
    const data = await response.json();
    return { data, error: null };
  } catch (err: any) {
    console.error('Unexpected error in getAllMeetings:', err);
    return { 
      data: null, 
      error: { message: 'An unexpected error occurred while fetching meetings' } 
    };
  }
};

/**
 * Fetches meetings for a specific student
 */
export const getStudentMeetings = async (studentId: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/dc-meetings/student/${studentId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        // Add authentication headers if needed
      }
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Error fetching student meetings:', errorData);
      
      toast({
        title: "Error",
        description: "Failed to fetch meetings: " + (errorData.message || response.statusText),
        variant: "destructive",
      });
      
      return { 
        data: null, 
        error: { message: `Failed to fetch meetings: ${errorData.message || response.statusText}` } 
      };
    }
    
    const data = await response.json();
    return { data, error: null };
  } catch (err: any) {
    console.error('Unexpected error in getStudentMeetings:', err);
    return { 
      data: null, 
      error: { message: 'An unexpected error occurred while fetching student meetings' } 
    };
  }
};

/**
 * Uploads a new DC meeting
 */
export const uploadMeeting = async (formData: FormData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/dc-meetings`, {
      method: 'POST',
      // No Content-Type header as FormData sets its own boundary
      body: formData
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Error uploading meeting:', errorData);
      
      toast({
        title: "Error",
        description: "Failed to upload meeting: " + (errorData.message || response.statusText),
        variant: "destructive",
      });
      
      return { 
        data: null, 
        error: { message: `Failed to upload meeting: ${errorData.message || response.statusText}` } 
      };
    }
    
    const data = await response.json();
    return { data, error: null };
  } catch (err: any) {
    console.error('Unexpected error in uploadMeeting:', err);
    return { 
      data: null, 
      error: { message: 'An unexpected error occurred while uploading meeting' } 
    };
  }
};

/**
 * Updates the status of a DC meeting
 */
export const updateMeetingStatus = async (
  meetingId: string,
  status: string,
  modificationNote?: string
) => {
  try {
    const payload = {
      status,
      ...(modificationNote && { modificationNote })
    };
    
    const response = await fetch(`${API_BASE_URL}/dc-meetings/${meetingId}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        // Add authentication headers if needed
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Error updating meeting status:', errorData);
      
      toast({
        title: "Error",
        description: "Failed to update meeting status: " + (errorData.message || response.statusText),
        variant: "destructive",
      });
      
      return { 
        success: false, 
        error: { message: `Failed to update meeting status: ${errorData.message || response.statusText}` } 
      };
    }
    
    return { success: true, error: null };
  } catch (err: any) {
    console.error('Unexpected error in updateMeetingStatus:', err);
    return { 
      success: false, 
      error: { message: 'An unexpected error occurred while updating meeting status' } 
    };
  }
};

/**
 * Downloads a meeting file
 */
export const downloadMeetingFile = async (fileId: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/dc-meetings/file/${fileId}`, {
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
    console.error('Unexpected error in downloadMeetingFile:', err);
    return { 
      data: null, 
      error: { message: 'An unexpected error occurred while downloading file' } 
    };
  }
};
