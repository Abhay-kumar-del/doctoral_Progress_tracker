
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { getStoredMeetings, saveMeeting, updateMeetingStatus, DCMeeting } from './dcMeetingUtils';
import { supabase } from '@/integrations/supabase/client';

// Mock Supabase client
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        order: vi.fn(() => Promise.resolve({ data: [], error: null }))
      })),
      insert: vi.fn(() => Promise.resolve({ data: null, error: null })),
      update: vi.fn(() => ({
        eq: vi.fn(() => Promise.resolve({ data: null, error: null }))
      }))
    })),
    storage: {
      from: vi.fn(() => ({
        upload: vi.fn(),
        getPublicUrl: vi.fn(),
        download: vi.fn(),
        remove: vi.fn()
      }))
    }
  }
}));

// Mock UUID
vi.mock('uuid', () => ({
  v4: vi.fn(() => 'mock-uuid')
}));

describe('DC Meeting Utils', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getStoredMeetings', () => {
    it('should fetch meetings successfully', async () => {
      const mockMeetings = [
        {
          id: '1',
          date: '2024-04-01',
          status: 'Pending Approval',
          minutes_file_name: 'meeting_minutes_1.pdf',
          student_name: 'John Doe',
          minutes_file_url: 'https://example.com/file1.pdf'
        },
        {
          id: '2',
          date: '2024-03-01',
          status: 'Approved',
          minutes_file_name: 'meeting_minutes_2.pdf',
          student_name: 'Jane Smith',
          minutes_file_url: 'https://example.com/file2.pdf'
        }
      ];

      // Mock Supabase response
      vi.mocked(supabase.from).mockReturnValueOnce({
        select: vi.fn(() => ({
          order: vi.fn(() => Promise.resolve({
            data: mockMeetings,
            error: null
          }))
        })),
        insert: vi.fn(),
        update: vi.fn()
      });

      const result = await getStoredMeetings();

      // Assertions
      expect(supabase.from).toHaveBeenCalledWith('dc_meetings');
      expect(result).toHaveLength(2);
      expect(result[0].id).toBe('1');
      expect(result[0].status).toBe('Pending Approval');
      expect(result[1].id).toBe('2');
      expect(result[1].status).toBe('Approved');
    });

    it('should handle errors when fetching meetings', async () => {
      // Mock Supabase error response
      vi.mocked(supabase.from).mockReturnValueOnce({
        select: vi.fn(() => ({
          order: vi.fn(() => Promise.resolve({
            data: null,
            error: { message: 'Failed to fetch meetings' }
          }))
        })),
        insert: vi.fn(),
        update: vi.fn()
      });

      const result = await getStoredMeetings();

      // Assertions
      expect(supabase.from).toHaveBeenCalledWith('dc_meetings');
      expect(result).toEqual([]);
    });
  });

  describe('saveMeeting', () => {
    it('should save a meeting successfully', async () => {
      // Mock storage upload
      const mockStorageBucket = {
        upload: vi.fn().mockResolvedValueOnce({
          data: { path: 'mock-uuid.pdf' },
          error: null
        }),
        getPublicUrl: vi.fn().mockReturnValue({
          data: { publicUrl: 'https://example.com/mock-uuid.pdf' }
        })
      };
      vi.mocked(supabase.storage.from).mockReturnValueOnce(mockStorageBucket);

      // Mock database insert
      vi.mocked(supabase.from).mockReturnValueOnce({
        select: vi.fn(),
        insert: vi.fn().mockResolvedValueOnce({
          data: { id: 'new-meeting-id' },
          error: null
        }),
        update: vi.fn()
      });

      const meetingData = {
        studentName: 'John Doe',
        studentId: 'student-123',
        file: new File(['file content'], 'minutes.pdf', { type: 'application/pdf' }),
        date: '2024-04-01'
      };

      const result = await saveMeeting(meetingData);

      // Assertions
      expect(supabase.storage.from).toHaveBeenCalledWith('files');
      expect(supabase.from).toHaveBeenCalledWith('dc_meetings');
      expect(result).toBe(true);
    });

    it('should handle errors during file upload', async () => {
      // Mock storage upload error
      const mockStorageBucket = {
        upload: vi.fn().mockResolvedValueOnce({
          data: null,
          error: { message: 'Upload failed' }
        })
      };
      vi.mocked(supabase.storage.from).mockReturnValueOnce(mockStorageBucket);

      const meetingData = {
        studentName: 'John Doe',
        studentId: 'student-123',
        file: new File(['file content'], 'minutes.pdf', { type: 'application/pdf' }),
        date: '2024-04-01'
      };

      const result = await saveMeeting(meetingData);

      // Assertions
      expect(supabase.storage.from).toHaveBeenCalledWith('files');
      expect(result).toBe(false);
    });

    it('should handle errors during database insert', async () => {
      // Mock storage upload success
      const mockUploadBucket = {
        upload: vi.fn().mockResolvedValueOnce({
          data: { path: 'mock-uuid.pdf' },
          error: null
        }),
        getPublicUrl: vi.fn().mockReturnValue({
          data: { publicUrl: 'https://example.com/mock-uuid.pdf' }
        })
      };
      vi.mocked(supabase.storage.from).mockReturnValueOnce(mockUploadBucket);

      // Mock database insert error
      vi.mocked(supabase.from).mockReturnValueOnce({
        select: vi.fn(),
        insert: vi.fn().mockResolvedValueOnce({
          data: null,
          error: { message: 'Insert failed' }
        }),
        update: vi.fn()
      });

      const meetingData = {
        studentName: 'John Doe',
        studentId: 'student-123',
        file: new File(['file content'], 'minutes.pdf', { type: 'application/pdf' }),
        date: '2024-04-01'
      };

      const result = await saveMeeting(meetingData);

      // Assertions
      expect(supabase.storage.from).toHaveBeenCalledWith('files');
      expect(supabase.from).toHaveBeenCalledWith('dc_meetings');
      expect(result).toBe(false);
    });
  });

  describe('updateMeetingStatus', () => {
    it('should update meeting status successfully', async () => {
      // Mock Supabase update response
      vi.mocked(supabase.from).mockReturnValueOnce({
        select: vi.fn(),
        insert: vi.fn(),
        update: vi.fn(() => ({
          eq: vi.fn(() => Promise.resolve({
            data: { id: 'meeting-123', status: 'Approved' },
            error: null
          }))
        }))
      });

      const result = await updateMeetingStatus('meeting-123', 'Approved');

      // Assertions
      expect(supabase.from).toHaveBeenCalledWith('dc_meetings');
      expect(result).toBe(true);
    });

    it('should include modification note when provided', async () => {
      // Mock Supabase update response
      vi.mocked(supabase.from).mockReturnValueOnce({
        select: vi.fn(),
        insert: vi.fn(),
        update: vi.fn(() => ({
          eq: vi.fn(() => Promise.resolve({
            data: { 
              id: 'meeting-123', 
              status: 'Needs Modification',
              modification_note: 'Please add more details' 
            },
            error: null
          }))
        }))
      });

      const result = await updateMeetingStatus(
        'meeting-123', 
        'Needs Modification', 
        'Please add more details'
      );

      // Assertions
      expect(supabase.from).toHaveBeenCalledWith('dc_meetings');
      expect(result).toBe(true);
    });

    it('should handle errors during status update', async () => {
      // Mock Supabase update error
      vi.mocked(supabase.from).mockReturnValueOnce({
        select: vi.fn(),
        insert: vi.fn(),
        update: vi.fn(() => ({
          eq: vi.fn(() => Promise.resolve({
            data: null,
            error: { message: 'Update failed' }
          }))
        }))
      });

      const result = await updateMeetingStatus('meeting-123', 'Approved');

      // Assertions
      expect(supabase.from).toHaveBeenCalledWith('dc_meetings');
      expect(result).toBe(false);
    });
  });
});
