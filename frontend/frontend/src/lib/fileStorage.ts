
/**
 * Utility functions for working with files stored in localStorage
 */

// Retrieve a file from localStorage by filename
export const getStoredFile = (fileName: string): { data: string, dateAdded: string } | null => {
  try {
    const storedFiles = JSON.parse(localStorage.getItem('storedFiles') || '{}');
    return storedFiles[fileName] || null;
  } catch (error) {
    console.error("Error retrieving file from localStorage:", error);
    return null;
  }
};

// Get all stored files
export const getAllStoredFiles = (): Record<string, { data: string, dateAdded: string }> => {
  try {
    return JSON.parse(localStorage.getItem('storedFiles') || '{}');
  } catch (error) {
    console.error("Error retrieving files from localStorage:", error);
    return {};
  }
};

// Delete a file from localStorage
export const deleteStoredFile = (fileName: string): boolean => {
  try {
    const storedFiles = JSON.parse(localStorage.getItem('storedFiles') || '{}');
    if (storedFiles[fileName]) {
      delete storedFiles[fileName];
      localStorage.setItem('storedFiles', JSON.stringify(storedFiles));
      return true;
    }
    return false;
  } catch (error) {
    console.error("Error deleting file from localStorage:", error);
    return false;
  }
};

// Store a file in localStorage
export const storeFile = (fileName: string, fileData: string): boolean => {
  try {
    const storedFiles = JSON.parse(localStorage.getItem('storedFiles') || '{}');
    storedFiles[fileName] = {
      data: fileData,
      dateAdded: new Date().toISOString()
    };
    localStorage.setItem('storedFiles', JSON.stringify(storedFiles));
    return true;
  } catch (error) {
    console.error("Error storing file in localStorage:", error);
    return false;
  }
};

// Get the total size of all stored files (approximate size in bytes)
export const getTotalStorageSize = (): number => {
  try {
    const storedFiles = JSON.parse(localStorage.getItem('storedFiles') || '{}');
    let totalSize = 0;
    
    Object.values(storedFiles).forEach((fileInfo: any) => {
      // Approximate size of base64 data (4 characters in base64 = 3 bytes)
      const dataSize = Math.ceil((fileInfo.data.length * 3) / 4);
      totalSize += dataSize;
    });
    
    return totalSize;
  } catch (error) {
    console.error("Error calculating storage size:", error);
    return 0;
  }
};

// Format bytes to human-readable format
export const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) {
    return `${bytes} B`;
  } else if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(2)} KB`;
  } else {
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  }
};

// Rename a file in localStorage
export const renameStoredFile = (oldFileName: string, newFileName: string): boolean => {
  try {
    const storedFiles = JSON.parse(localStorage.getItem('storedFiles') || '{}');
    if (storedFiles[oldFileName]) {
      storedFiles[newFileName] = storedFiles[oldFileName];
      delete storedFiles[oldFileName];
      localStorage.setItem('storedFiles', JSON.stringify(storedFiles));
      return true;
    }
    return false;
  } catch (error) {
    console.error("Error renaming file in localStorage:", error);
    return false;
  }
};
