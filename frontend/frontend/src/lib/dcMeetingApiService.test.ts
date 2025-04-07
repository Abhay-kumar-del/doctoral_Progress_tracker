
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getAllMeetings, getStudentMeetings, uploadMeeting, updateMeetingStatus, downloadMeetingFile } from './dcMeetingApiService';

// Mock fetch API
global.fetch = vi.fn();

// Mock URL.createObjectURL
global.URL.createObjectURL = vi.fn().mockImplementation((blob) => `blob-url-${blob}`);

// Mock toast
vi.mock('@/hooks/use-toast', () => ({
  toast: vi.fn(),
}));

describe('DC Meeting API Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset the fetch mock before each test
    vi.mocked(fetch).mockReset();
  });

  describe('getAllMeetings', () => {
    it('should fetch all meetings successfully', async () => {
      // Mock successful API response
      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => ([
          { id: '1', studentName: 'John Doe', date: '2024-04-01', status: 'Pending Approval' },
          { id: '2', studentName: 'Jane Smith', date: '2024-03-15', status: 'Approved' }
        ]),
      } as Response);

      const result = await getAllMeetings();
      
      // Check if fetch was called with the right arguments
      expect(fetch).toHaveBeenCalledWith(
        'http://localhost:8080/api/dc-meetings',
        expect.objectContaining({
          method: 'GET',
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
          })
        })
      );
      
      expect(result.data).toHaveLength(2);
      expect(result.error).toBeNull();
    });

    it('should handle API errors when fetching meetings', async () => {
      // Mock API error response
      vi.mocked(fetch).mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
        json: async () => ({ message: 'Server error' }),
      } as Response);

      const result = await getAllMeetings();
      
      expect(result.data).toBeNull();
      expect(result.error).toEqual(expect.objectContaining({
        message: expect.stringContaining('Failed to fetch meetings')
      }));
    });
  });

  describe('getStudentMeetings', () => {
    it('should fetch student meetings successfully', async () => {
      // Mock successful API response
      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => ([
          { id: '1', studentName: 'John Doe', date: '2024-04-01', status: 'Pending Approval' }
        ]),
      } as Response);

      const studentId = 'student-123';
      const result = await getStudentMeetings(studentId);
      
      // Check if fetch was called with the right arguments
      expect(fetch).toHaveBeenCalledWith(
        `http://localhost:8080/api/dc-meetings/student/${studentId}`,
        expect.objectContaining({
          method: 'GET',
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
          })
        })
      );
      
      expect(result.data).toHaveLength(1);
      expect(result.error).toBeNull();
    });
  });

  describe('uploadMeeting', () => {
    it('should upload a meeting successfully', async () => {
      // Mock successful API response
      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ id: 'meeting-123', studentName: 'John Doe', status: 'Pending Approval' }),
      } as Response);

      const formData = new FormData();
      formData.append('studentName', 'John Doe');
      formData.append('date', '2024-04-01');
      formData.append('file', new File(['file content'], 'meeting.pdf', { type: 'application/pdf' }));

      const result = await uploadMeeting(formData);
      
      // Check if fetch was called with the right arguments
      expect(fetch).toHaveBeenCalledWith(
        'http://localhost:8080/api/dc-meetings',
        expect.objectContaining({
          method: 'POST',
          body: formData
        })
      );
      
      expect(result.data).toEqual(expect.objectContaining({
        id: 'meeting-123',
        studentName: 'John Doe'
      }));
      expect(result.error).toBeNull();
    });
  });

  describe('updateMeetingStatus', () => {
    it('should update meeting status successfully', async () => {
      // Mock successful API response
      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => ({}),
      } as Response);

      const meetingId = 'meeting-123';
      const status = 'Approved';
      
      const result = await updateMeetingStatus(meetingId, status);
      
      // Check if fetch was called with the right arguments
      expect(fetch).toHaveBeenCalledWith(
        `http://localhost:8080/api/dc-meetings/${meetingId}/status`,
        expect.objectContaining({
          method: 'PUT',
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
          }),
          body: JSON.stringify({ status })
        })
      );
      
      expect(result.success).toBe(true);
      expect(result.error).toBeNull();
    });

    it('should include modification note when provided', async () => {
      // Mock successful API response
      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => ({}),
      } as Response);

      const meetingId = 'meeting-123';
      const status = 'Needs Modification';
      const modificationNote = 'Please add more details';
      
      await updateMeetingStatus(meetingId, status, modificationNote);
      
      // Check if fetch includes the modification note
      expect(fetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          body: JSON.stringify({ status, modificationNote })
        })
      );
    });
  });

  describe('downloadMeetingFile', () => {
    it('should download a meeting file successfully', async () => {
      // Create a mock blob
      const mockBlob = new Blob(['file content'], { type: 'application/pdf' });
      
      // Mock successful API response
      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        blob: async () => mockBlob,
      } as Response);

      const fileId = 'file-123';
      const result = await downloadMeetingFile(fileId);
      
      // Check if fetch was called with the right arguments
      expect(fetch).toHaveBeenCalledWith(
        `http://localhost:8080/api/dc-meetings/file/${fileId}`,
        expect.objectContaining({
          method: 'GET'
        })
      );
      
      expect(URL.createObjectURL).toHaveBeenCalledWith(mockBlob);
      expect(result.data).toEqual({ url: `blob-url-${mockBlob}` });
      expect(result.error).toBeNull();
    });
  });
});
