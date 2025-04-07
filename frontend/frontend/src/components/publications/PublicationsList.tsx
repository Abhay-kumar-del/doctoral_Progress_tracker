
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Download, ExternalLink, Check, X } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from '@/contexts/AuthContext';
import StatusBadge from '@/components/StatusBadge';

const PublicationsList = () => {
  const [publications, setPublications] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const { userRole } = useAuth();
  const isSupervisor = userRole === 'supervisor';

  useEffect(() => {
    loadPublications();
  }, []);

  const loadPublications = async () => {
    setIsLoading(true);
    try {
      // Get all files with the 'publication-' prefix
      const { data, error } = await supabase.storage.from('files').list('', {
        search: 'publication-'
      });
      
      if (error) {
        console.error('Error loading publications:', error);
        toast({
          title: "Error",
          description: "Failed to load publications from storage",
          variant: "destructive",
        });
        return;
      }
      
      // Process publication metadata
      const processedPublications = data.map(file => {
        // Parse the filename to extract metadata
        // Format: publication-{title}-{venue}-{validated}.pdf
        const nameParts = file.name.replace('publication-', '').split('-');
        const validated = nameParts[nameParts.length - 1].split('.')[0] === 'validated';
        const venue = nameParts[nameParts.length - 2];
        const title = nameParts.slice(0, nameParts.length - 2).join('-');
        
        return {
          ...file,
          title: decodeURIComponent(title.replace(/-/g, ' ')),
          venue: decodeURIComponent(venue.replace(/-/g, ' ')),
          validated,
          status: validated ? 'Published' : 'Under Review'
        };
      });
      
      // Sort publications by created_at in descending order (newest first)
      const sortedPublications = processedPublications.sort((a, b) => {
        return new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime();
      });
      
      setPublications(sortedPublications);
    } catch (error) {
      console.error('Error in loadPublications:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred while loading publications",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewPublication = (fileName: string) => {
    const { data } = supabase.storage.from('files').getPublicUrl(fileName);
    if (data.publicUrl) {
      window.open(data.publicUrl, '_blank');
    }
  };

  const handleDownloadPublication = (fileName: string) => {
    const { data } = supabase.storage.from('files').getPublicUrl(fileName);
    if (data.publicUrl) {
      const a = document.createElement('a');
      a.href = data.publicUrl;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      
      toast({
        title: "Download Started",
        description: `${fileName} is being downloaded`,
      });
    }
  };

  const handleValidatePublication = async (publication: any) => {
    try {
      // First download the original file
      const { data: fileData, error: fileError } = await supabase.storage
        .from('files')
        .download(publication.name);
        
      if (fileError || !fileData) {
        throw new Error('Failed to download file for validation');
      }
      
      // Create a new filename with validated status
      const originalNameParts = publication.name.split('-');
      const extension = originalNameParts[originalNameParts.length - 1].split('.')[1];
      
      // Replace 'unvalidated' with 'validated' or add 'validated'
      let newFileName = publication.name.replace(`.${extension}`, `-validated.${extension}`);
      if (newFileName === publication.name) {
        // If replacement didn't happen, manually construct the new name
        const nameParts = publication.name.split('.');
        newFileName = `${nameParts[0]}-validated.${nameParts[1]}`;
      }
      
      // Upload the same file with the new validated filename
      const { error: uploadError } = await supabase.storage
        .from('files')
        .upload(newFileName, fileData, {
          contentType: 'application/pdf',
          upsert: true
        });
        
      if (uploadError) {
        throw new Error('Failed to upload validated file');
      }
      
      // Delete the original file
      const { error: deleteError } = await supabase.storage
        .from('files')
        .remove([publication.name]);
        
      if (deleteError) {
        console.warn('Warning: Failed to delete original file after validation');
      }
      
      // Update local state
      setPublications(publications.map(pub => 
        pub.name === publication.name 
          ? { ...pub, name: newFileName, validated: true, status: 'Published' } 
          : pub
      ));
      
      toast({
        title: "Publication Validated",
        description: "The publication has been successfully validated",
      });
      
      // Reload publications to ensure we have the latest data
      loadPublications();
      
    } catch (error) {
      console.error('Error in handleValidatePublication:', error);
      toast({
        title: "Error",
        description: "Failed to validate publication",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Publications</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Publications</CardTitle>
        <Button variant="outline" size="sm" onClick={loadPublications}>Refresh</Button>
      </CardHeader>
      <CardContent>
        {publications.length > 0 ? (
          <div className="space-y-2">
            {publications.map((publication) => (
              <div 
                key={publication.id} 
                className="flex items-center justify-between p-3 border rounded-md hover:bg-gray-50"
              >
                <div className="flex items-center">
                  <FileText className="h-5 w-5 text-blue-500 mr-2" />
                  <div>
                    <p className="font-medium">{publication.title}</p>
                    <div className="flex items-center space-x-2 text-xs text-gray-500">
                      <span>{publication.venue}</span>
                      <span>•</span>
                      <span>{new Date(publication.created_at).toLocaleDateString()}</span>
                      <span>•</span>
                      <StatusBadge status={publication.status} />
                      {publication.validated && (
                        <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-green-100 text-green-700">
                          Validated
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleViewPublication(publication.name)}
                  >
                    <ExternalLink className="h-4 w-4 mr-1" />
                    View
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleDownloadPublication(publication.name)}
                  >
                    <Download className="h-4 w-4 mr-1" />
                    Download
                  </Button>
                  {isSupervisor && !publication.validated && (
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="bg-green-50 text-green-600 border-green-200 hover:bg-green-100"
                      onClick={() => handleValidatePublication(publication)}
                    >
                      <Check className="h-4 w-4 mr-1" />
                      Validate
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 my-8">No publications uploaded yet</p>
        )}
      </CardContent>
    </Card>
  );
};

export default PublicationsList;
