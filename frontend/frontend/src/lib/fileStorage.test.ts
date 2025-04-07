
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { 
  getStoredFile, 
  getAllStoredFiles, 
  deleteStoredFile, 
  storeFile, 
  getTotalStorageSize, 
  formatFileSize,
  renameStoredFile
} from './fileStorage';

describe('File Storage Utilities', () => {
  const mockStoredFiles = {
    'document1.pdf': {
      data: 'base64encodedcontent',
      dateAdded: '2024-01-01T12:00:00Z'
    },
    'document2.doc': {
      data: 'anotherbase64encodedcontent',
      dateAdded: '2024-01-02T14:30:00Z'
    }
  };

  beforeEach(() => {
    // Mock localStorage
    const localStorageMock = (() => {
      let store: Record<string, string> = {};
      return {
        getItem: vi.fn((key) => store[key] || null),
        setItem: vi.fn((key, value) => {
          store[key] = value.toString();
        }),
        removeItem: vi.fn((key) => {
          delete store[key];
        }),
        clear: vi.fn(() => {
          store = {};
        })
      };
    })();
    
    Object.defineProperty(window, 'localStorage', {
      value: localStorageMock
    });
    
    // Set initial mock data
    window.localStorage.setItem('storedFiles', JSON.stringify(mockStoredFiles));
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('getStoredFile', () => {
    it('should retrieve a file by filename', () => {
      const file = getStoredFile('document1.pdf');
      
      expect(window.localStorage.getItem).toHaveBeenCalledWith('storedFiles');
      expect(file).toEqual({
        data: 'base64encodedcontent',
        dateAdded: '2024-01-01T12:00:00Z'
      });
    });

    it('should return null for non-existent file', () => {
      const file = getStoredFile('nonexistent.txt');
      
      expect(window.localStorage.getItem).toHaveBeenCalledWith('storedFiles');
      expect(file).toBeNull();
    });

    it('should handle localStorage errors', () => {
      // Simulate localStorage error
      vi.spyOn(window.localStorage, 'getItem').mockImplementationOnce(() => {
        throw new Error('localStorage error');
      });
      
      const file = getStoredFile('document1.pdf');
      
      expect(file).toBeNull();
    });
  });

  describe('getAllStoredFiles', () => {
    it('should retrieve all stored files', () => {
      const files = getAllStoredFiles();
      
      expect(window.localStorage.getItem).toHaveBeenCalledWith('storedFiles');
      expect(files).toEqual(mockStoredFiles);
    });

    it('should return empty object if no files are stored', () => {
      vi.spyOn(window.localStorage, 'getItem').mockReturnValueOnce(null);
      
      const files = getAllStoredFiles();
      
      expect(files).toEqual({});
    });

    it('should handle localStorage errors', () => {
      // Simulate localStorage error
      vi.spyOn(window.localStorage, 'getItem').mockImplementationOnce(() => {
        throw new Error('localStorage error');
      });
      
      const files = getAllStoredFiles();
      
      expect(files).toEqual({});
    });
  });

  describe('deleteStoredFile', () => {
    it('should delete a file by filename', () => {
      const result = deleteStoredFile('document1.pdf');
      
      // Get updated stored files from localStorage
      const updatedFiles = JSON.parse(window.localStorage.setItem.mock.calls[0][1]);
      
      expect(result).toBe(true);
      expect(updatedFiles).not.toHaveProperty('document1.pdf');
      expect(updatedFiles).toHaveProperty('document2.doc');
    });

    it('should return false if file does not exist', () => {
      const result = deleteStoredFile('nonexistent.txt');
      
      expect(result).toBe(false);
      expect(window.localStorage.setItem).not.toHaveBeenCalled();
    });
  });

  describe('storeFile', () => {
    it('should store a new file', () => {
      const result = storeFile('newfile.txt', 'newfilecontent');
      
      // Get updated stored files from localStorage
      const updatedFiles = JSON.parse(window.localStorage.setItem.mock.calls[0][1]);
      
      expect(result).toBe(true);
      expect(updatedFiles).toHaveProperty('newfile.txt');
      expect(updatedFiles['newfile.txt'].data).toBe('newfilecontent');
      expect(updatedFiles['newfile.txt']).toHaveProperty('dateAdded');
    });

    it('should overwrite existing file', () => {
      const result = storeFile('document1.pdf', 'updatedcontent');
      
      // Get updated stored files from localStorage
      const updatedFiles = JSON.parse(window.localStorage.setItem.mock.calls[0][1]);
      
      expect(result).toBe(true);
      expect(updatedFiles['document1.pdf'].data).toBe('updatedcontent');
    });
  });

  describe('getTotalStorageSize', () => {
    it('should calculate total storage size correctly', () => {
      // Mock base64 data lengths
      const mockFiles = {
        'file1.txt': { data: 'a'.repeat(100), dateAdded: '2024-01-01T12:00:00Z' },
        'file2.txt': { data: 'b'.repeat(200), dateAdded: '2024-01-02T12:00:00Z' }
      };
      
      window.localStorage.setItem('storedFiles', JSON.stringify(mockFiles));
      
      const size = getTotalStorageSize();
      
      // Base64: 4 chars = 3 bytes, so 300 chars = 225 bytes
      expect(size).toBe(225);
    });

    it('should return 0 if no files are stored', () => {
      window.localStorage.setItem('storedFiles', JSON.stringify({}));
      
      const size = getTotalStorageSize();
      
      expect(size).toBe(0);
    });
  });

  describe('formatFileSize', () => {
    it('should format bytes correctly', () => {
      expect(formatFileSize(100)).toBe('100 B');
      expect(formatFileSize(2048)).toBe('2.00 KB');
      expect(formatFileSize(2 * 1024 * 1024)).toBe('2.00 MB');
    });
  });

  describe('renameStoredFile', () => {
    it('should rename a file', () => {
      const result = renameStoredFile('document1.pdf', 'renamed.pdf');
      
      // Get updated stored files from localStorage
      const updatedFiles = JSON.parse(window.localStorage.setItem.mock.calls[0][1]);
      
      expect(result).toBe(true);
      expect(updatedFiles).not.toHaveProperty('document1.pdf');
      expect(updatedFiles).toHaveProperty('renamed.pdf');
      expect(updatedFiles['renamed.pdf'].data).toBe('base64encodedcontent');
    });

    it('should return false if original file does not exist', () => {
      const result = renameStoredFile('nonexistent.txt', 'renamed.txt');
      
      expect(result).toBe(false);
      expect(window.localStorage.setItem).not.toHaveBeenCalled();
    });
  });
});
