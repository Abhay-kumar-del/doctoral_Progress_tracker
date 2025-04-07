
import { supabase } from '@/integrations/supabase/client';
import { v4 as uuidv4 } from 'uuid';

export type DCMeeting = {
  id: string;
  date: string;
  status: 'Pending Approval' | 'Approved' | 'Needs Modification';
  minutes: string;
  studentName: string;
  fileData?: string;
  modificationNote?: string;
};

export const getStoredMeetings = async (): Promise<DCMeeting[]> => {
  try {
    const { data, error } = await supabase
      .from('dc_meetings')
      .select('*')
      .order('date', { ascending: false });
      
    if (error) {
      console.error('Error fetching DC meetings:', error);
      return [];
    }
    
    // Transform from database format to component format with proper type casting
    return data.map(meeting => ({
      id: meeting.id,
      date: meeting.date,
      status: meeting.status as 'Pending Approval' | 'Approved' | 'Needs Modification',
      minutes: meeting.minutes_file_name,
      studentName: meeting.student_name,
      fileData: meeting.minutes_file_url,
      modificationNote: meeting.modification_note || undefined
    }));
  } catch (error) {
    console.error('Error in getStoredMeetings:', error);
    return [];
  }
};

export const saveMeeting = async (meeting: {
  studentName: string;
  studentId: string;
  file: File;
  date: string;
}): Promise<boolean> => {
  try {
    // Check if file exists
    if (!meeting.file) {
      console.error('No file provided for upload');
      return false;
    }

    // 1. Upload file to Supabase Storage
    const fileExt = meeting.file.name.split('.').pop();
    const fileName = `${uuidv4()}.${fileExt}`;
    // Store files directly in the files bucket root instead of a subfolder
    const filePath = `${fileName}`;
    
    console.log('Upload attempt details:');
    console.log('- File name:', meeting.file.name);
    console.log('- File size:', meeting.file.size);
    console.log('- File type:', meeting.file.type);
    console.log('- Target bucket:', 'files');
    console.log('- Target path:', filePath);
    
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('files')
      .upload(filePath, meeting.file, {
        cacheControl: '3600',
        upsert: true // Allow overwriting
      });
      
    if (uploadError) {
      console.error('Error uploading file:', uploadError);
      return false;
    }
    
    // 2. Get public URL for the uploaded file
    const { data: urlData } = await supabase.storage
      .from('files')
      .getPublicUrl(filePath);
      
    const fileUrl = urlData?.publicUrl;
    
    if (!fileUrl) {
      console.error('Failed to get public URL for file');
      return false;
    }
    
    console.log('File uploaded successfully, public URL:', fileUrl);
    
    // 3. Save meeting record in database
    const { error: dbError } = await supabase
      .from('dc_meetings')
      .insert({
        student_id: meeting.studentId,
        student_name: meeting.studentName,
        date: meeting.date,
        status: 'Pending Approval',
        minutes_file_name: meeting.file.name,
        minutes_file_url: fileUrl
      });
      
    if (dbError) {
      console.error('Error saving DC meeting to database:', dbError);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error in saveMeeting:', error);
    return false;
  }
};

export const updateMeetingStatus = async (
  meetingId: string, 
  status: 'Approved' | 'Needs Modification', 
  modificationNote?: string
): Promise<boolean> => {
  try {
    const updateData: any = {
      status: status,
      updated_at: new Date().toISOString()
    };
    
    if (modificationNote) {
      updateData.modification_note = modificationNote;
    }
    
    const { error } = await supabase
      .from('dc_meetings')
      .update(updateData)
      .eq('id', meetingId);
      
    if (error) {
      console.error('Error updating DC meeting status:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error in updateMeetingStatus:', error);
    return false;
  }
};

export const getPdfUrl = (meeting: any): string => {
  if (meeting.fileData) {
    return meeting.fileData;
  }
  
  // Fallback to sample PDFs if no file data
  const samplePDFs: Record<string, string> = {
    'meeting_minutes_1.pdf': 'https://www.africau.edu/images/default/sample.pdf',
    'meeting_minutes_2.pdf': 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    'meeting_minutes_3.pdf': 'https://www.africau.edu/images/default/sample.pdf',
    'meeting_minutes_4.pdf': 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
  };
  
  return samplePDFs[meeting.minutes] || 'https://www.africau.edu/images/default/sample.pdf';
};
