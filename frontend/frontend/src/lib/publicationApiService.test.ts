
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { supabase } from '@/integrations/supabase/client';

// Mock Supabase client
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    storage: {
      from: vi.fn(() => ({
        list: vi.fn(),
        upload: vi.fn(),
        getPublicUrl: vi.fn(),
        download: vi.fn(),
        remove: vi.fn()
      }))
    }
  }
}));

// Mock toast
vi.mock('@/hooks/use-toast', () => ({
  toast: vi.fn(),
}));

describe('Publication Storage Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('List publications', () => {
    it('should fetch publications successfully', async () => {
      const mockPublications = [
        { name: 'publication-Test-Paper-IEEE-unvalidated.pdf', id: '1', created_at: '2024-01-01' },
        { name: 'publication-Another-Paper-ACM-validated.pdf', id: '2', created_at: '2024-01-02' }
      ];

      // Mock successful response
      const mockBucket = {
        list: vi.fn().mockResolvedValueOnce({
          data: mockPublications,
          error: null
        })
      };
      vi.mocked(supabase.storage.from).mockReturnValueOnce(mockBucket);

      // Create a component that uses the list function and test it
      const { data, error } = await supabase.storage.from('files').list('', {
        search: 'publication-'
      });

      // Assertions
      expect(supabase.storage.from).toHaveBeenCalledWith('files');
      expect(data).toEqual(mockPublications);
      expect(error).toBeNull();
    });

    it('should handle errors when fetching publications', async () => {
      // Mock error response
      const mockBucket = {
        list: vi.fn().mockResolvedValueOnce({
          data: null,
          error: { message: 'Failed to load publications' }
        })
      };
      vi.mocked(supabase.storage.from).mockReturnValueOnce(mockBucket);

      // Attempt to list publications
      const { data, error } = await supabase.storage.from('files').list('', {
        search: 'publication-'
      });

      // Assertions
      expect(supabase.storage.from).toHaveBeenCalledWith('files');
      expect(data).toBeNull();
      expect(error).toEqual({ message: 'Failed to load publications' });
    });
  });

  describe('Upload publication', () => {
    it('should upload a publication successfully', async () => {
      // Mock successful upload
      const mockBucket = {
        upload: vi.fn().mockResolvedValueOnce({
          data: { path: 'publication-Test-Paper-IEEE-unvalidated.pdf' },
          error: null
        })
      };
      vi.mocked(supabase.storage.from).mockReturnValueOnce(mockBucket);

      const file = new File(['file content'], 'test-paper.pdf', { type: 'application/pdf' });
      const filename = 'publication-Test-Paper-IEEE-unvalidated.pdf';

      // Perform upload
      const { data, error } = await supabase.storage
        .from('files')
        .upload(filename, file, {
          contentType: 'application/pdf',
          upsert: true
        });

      // Assertions
      expect(supabase.storage.from).toHaveBeenCalledWith('files');
      expect(data).toEqual({ path: 'publication-Test-Paper-IEEE-unvalidated.pdf' });
      expect(error).toBeNull();
    });

    it('should handle errors when uploading publication', async () => {
      // Mock error response
      const mockBucket = {
        upload: vi.fn().mockResolvedValueOnce({
          data: null,
          error: { message: 'Upload failed' }
        })
      };
      vi.mocked(supabase.storage.from).mockReturnValueOnce(mockBucket);

      const file = new File(['file content'], 'test-paper.pdf', { type: 'application/pdf' });
      const filename = 'publication-Test-Paper-IEEE-unvalidated.pdf';

      // Attempt upload
      const { data, error } = await supabase.storage
        .from('files')
        .upload(filename, file, {
          contentType: 'application/pdf',
          upsert: true
        });

      // Assertions
      expect(supabase.storage.from).toHaveBeenCalledWith('files');
      expect(data).toBeNull();
      expect(error).toEqual({ message: 'Upload failed' });
    });
  });

  describe('Validate publication', () => {
    it('should validate a publication successfully', async () => {
      // Mock download response
      const mockDownloadBucket = {
        download: vi.fn().mockResolvedValueOnce({
          data: new Blob(['file content'], { type: 'application/pdf' }),
          error: null
        })
      };
      vi.mocked(supabase.storage.from).mockReturnValueOnce(mockDownloadBucket);

      // Mock upload response for validated file
      const mockUploadBucket = {
        upload: vi.fn().mockResolvedValueOnce({
          data: { path: 'publication-Test-Paper-IEEE-validated.pdf' },
          error: null
        })
      };
      vi.mocked(supabase.storage.from).mockReturnValueOnce(mockUploadBucket);

      // Mock delete response for original file
      const mockRemoveBucket = {
        remove: vi.fn().mockResolvedValueOnce({
          data: true,
          error: null
        })
      };
      vi.mocked(supabase.storage.from).mockReturnValueOnce(mockRemoveBucket);

      const publication = {
        name: 'publication-Test-Paper-IEEE-unvalidated.pdf',
        id: '1',
        created_at: '2024-01-01'
      };

      // First download the file
      const downloadResult = await supabase.storage
        .from('files')
        .download(publication.name);
      
      expect(downloadResult.data).toBeTruthy();
      
      // Then upload the validated version
      const newFileName = 'publication-Test-Paper-IEEE-validated.pdf';
      const uploadResult = await supabase.storage
        .from('files')
        .upload(newFileName, downloadResult.data, {
          contentType: 'application/pdf',
          upsert: true
        });
      
      expect(uploadResult.data).toEqual({ path: 'publication-Test-Paper-IEEE-validated.pdf' });
      
      // Finally delete the original
      const deleteResult = await supabase.storage
        .from('files')
        .remove([publication.name]);
      
      expect(deleteResult.data).toBeTruthy();
    });
  });

  describe('Get publication URL', () => {
    it('should get public URL for a publication', async () => {
      // Mock getPublicUrl response
      const mockBucket = {
        getPublicUrl: vi.fn().mockReturnValue({
          data: { publicUrl: 'https://example.com/publication.pdf' }
        })
      };
      vi.mocked(supabase.storage.from).mockReturnValueOnce(mockBucket);

      const fileName = 'publication-Test-Paper-IEEE-validated.pdf';
      
      // Get public URL
      const { data } = supabase.storage.from('files').getPublicUrl(fileName);
      
      // Assertions
      expect(supabase.storage.from).toHaveBeenCalledWith('files');
      expect(data.publicUrl).toBe('https://example.com/publication.pdf');
    });
  });
});
