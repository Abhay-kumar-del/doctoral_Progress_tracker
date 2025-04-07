
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { addSwayamCourse, updateSwayamCourse, deleteSwayamCourse } from './supabaseService';
import { supabase } from '@/integrations/supabase/client';

// Mock Supabase client
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: vi.fn(() => ({
      insert: vi.fn(() => ({
        select: vi.fn(() => Promise.resolve({ data: [{ id: '123' }], error: null }))
      })),
      update: vi.fn(() => ({
        eq: vi.fn(() => ({
          select: vi.fn(() => Promise.resolve({ data: [{ id: '123' }], error: null }))
        }))
      })),
      delete: vi.fn(() => ({
        eq: vi.fn(() => Promise.resolve({ error: null }))
      })),
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          limit: vi.fn(() => Promise.resolve({ data: [], error: null }))
        }))
      }))
    }))
  }
}));

// Mock toast
vi.mock('@/hooks/use-toast', () => ({
  toast: vi.fn(),
}));

describe('Supabase Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('addSwayamCourse', () => {
    it('should add a new course successfully', async () => {
      const courseData = {
        name: 'Test Course',
        provider: 'Test Provider',
        duration: '10 weeks',
        description: 'Test description'
      };

      const result = await addSwayamCourse(courseData);
      
      expect(supabase.from).toHaveBeenCalledWith('swayam_courses');
      expect(result.data).toEqual([{ id: '123' }]);
      expect(result.error).toBeNull();
    });

    it('should handle database errors when adding course', async () => {
      // Mock Supabase error response
      vi.mocked(supabase.from).mockReturnValueOnce({
        insert: vi.fn(() => ({
          select: vi.fn(() => Promise.resolve({
            data: null,
            error: { message: 'Insert failed' }
          }))
        })),
        update: vi.fn(),
        delete: vi.fn(),
        select: vi.fn()
      });

      const courseData = {
        name: 'Test Course',
        provider: 'Test Provider',
        duration: '10 weeks'
      };

      const result = await addSwayamCourse(courseData);
      
      expect(supabase.from).toHaveBeenCalledWith('swayam_courses');
      expect(result.data).toBeNull();
      expect(result.error).toEqual({ message: 'Insert failed' });
    });
  });

  describe('updateSwayamCourse', () => {
    it('should update a course successfully', async () => {
      const courseId = '123';
      const courseData = {
        name: 'Updated Course',
        provider: 'Updated Provider'
      };

      const result = await updateSwayamCourse(courseId, courseData);
      
      expect(supabase.from).toHaveBeenCalledWith('swayam_courses');
      expect(result.data).toEqual([{ id: '123' }]);
      expect(result.error).toBeNull();
    });

    it('should handle database errors when updating course', async () => {
      // Mock Supabase error response
      vi.mocked(supabase.from).mockReturnValueOnce({
        insert: vi.fn(),
        update: vi.fn(() => ({
          eq: vi.fn(() => ({
            select: vi.fn(() => Promise.resolve({
              data: null,
              error: { message: 'Update failed' }
            }))
          }))
        })),
        delete: vi.fn(),
        select: vi.fn()
      });

      const courseId = '123';
      const courseData = {
        name: 'Updated Course'
      };

      const result = await updateSwayamCourse(courseId, courseData);
      
      expect(supabase.from).toHaveBeenCalledWith('swayam_courses');
      expect(result.data).toBeNull();
      expect(result.error).toEqual({ message: 'Update failed' });
    });
  });

  describe('deleteSwayamCourse', () => {
    it('should delete a course successfully when not in use', async () => {
      const courseId = '123';

      const result = await deleteSwayamCourse(courseId);
      
      expect(supabase.from).toHaveBeenCalledWith('student_courses');
      expect(supabase.from).toHaveBeenCalledWith('swayam_courses');
      expect(result.success).toBe(true);
      expect(result.error).toBeNull();
    });

    it('should prevent deletion when course is in use by students', async () => {
      // Mock Supabase response for course in use
      vi.mocked(supabase.from).mockReturnValueOnce({
        insert: vi.fn(),
        update: vi.fn(),
        delete: vi.fn(),
        select: vi.fn(() => ({
          eq: vi.fn(() => ({
            limit: vi.fn(() => Promise.resolve({
              data: [{ id: 'registration-1' }],
              error: null
            }))
          }))
        }))
      });

      const courseId = '123';

      const result = await deleteSwayamCourse(courseId);
      
      expect(supabase.from).toHaveBeenCalledWith('student_courses');
      expect(result.success).toBe(false);
      expect(result.error).toEqual({ 
        message: 'This course is registered by students and cannot be deleted' 
      });
    });

    it('should handle database errors during check if course is in use', async () => {
      // Mock Supabase error response for checking usage
      vi.mocked(supabase.from).mockReturnValueOnce({
        insert: vi.fn(),
        update: vi.fn(),
        delete: vi.fn(),
        select: vi.fn(() => ({
          eq: vi.fn(() => ({
            limit: vi.fn(() => Promise.resolve({
              data: null,
              error: { message: 'Database error' }
            }))
          }))
        }))
      });

      const courseId = '123';

      const result = await deleteSwayamCourse(courseId);
      
      expect(supabase.from).toHaveBeenCalledWith('student_courses');
      expect(result.success).toBe(false);
      expect(result.error).toEqual({ 
        message: 'Could not verify if course is in use' 
      });
    });

    it('should handle database errors during course deletion', async () => {
      // Mock successful check that course is not in use
      vi.mocked(supabase.from).mockReturnValueOnce({
        insert: vi.fn(),
        update: vi.fn(),
        delete: vi.fn(),
        select: vi.fn(() => ({
          eq: vi.fn(() => ({
            limit: vi.fn(() => Promise.resolve({
              data: [],
              error: null
            }))
          }))
        }))
      });

      // Mock error during deletion
      vi.mocked(supabase.from).mockReturnValueOnce({
        insert: vi.fn(),
        update: vi.fn(),
        delete: vi.fn(() => ({
          eq: vi.fn(() => Promise.resolve({
            error: { message: 'Delete failed' }
          }))
        })),
        select: vi.fn()
      });

      const courseId = '123';

      const result = await deleteSwayamCourse(courseId);
      
      expect(supabase.from).toHaveBeenCalledWith('student_courses');
      expect(supabase.from).toHaveBeenCalledWith('swayam_courses');
      expect(result.success).toBe(false);
      expect(result.error).toEqual({ message: 'Delete failed' });
    });
  });
});
