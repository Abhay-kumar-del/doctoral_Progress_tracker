
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Upload, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import PublicationUploadDialog from '@/components/publications/PublicationUploadDialog';
import PublicationsList from '@/components/publications/PublicationsList';

const Publications = () => {
  const { userRole } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const isSupervisor = userRole === 'supervisor';

  const handlePublicationUploaded = () => {
    toast({
      title: "Publication Added",
      description: "Your publication has been added successfully",
    });
  };

  const handleBackToDashboard = () => {
    if (isSupervisor) {
      navigate('/supervisor');
    } else {
      navigate('/');
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-blue-50">
      <div className="p-8">
        {isSupervisor && (
          <div className="mb-8">
            <div className="bg-blue-600 text-white p-6 rounded-lg mb-8">
              <h1 className="text-2xl font-bold">PhD Supervisor Dashboard</h1>
            </div>
          </div>
        )}
        
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Publications</h1>
            <p className="text-gray-500">View and manage your research publications</p>
          </div>
          <Button 
            variant="default" 
            onClick={handleBackToDashboard}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Button>
        </div>

        {isSupervisor && (
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden mb-8">
            <div className="p-5 border-b border-gray-100">
              <h2 className="text-xl font-semibold">Abhay Kumar - Student Details</h2>
            </div>
          </div>
        )}

        {!isSupervisor && (
          <div className="mb-8">
            <Button 
              onClick={() => setIsUploadDialogOpen(true)}
              className="flex items-center gap-2"
            >
              <Upload className="w-4 h-4" />
              Add New Publication
            </Button>
          </div>
        )}
        
        <PublicationsList />
      </div>

      {/* Upload Publication Dialog */}
      <PublicationUploadDialog 
        isOpen={isUploadDialogOpen} 
        onOpenChange={setIsUploadDialogOpen}
        onSuccess={handlePublicationUploaded}
      />
    </div>
  );
};

export default Publications;
