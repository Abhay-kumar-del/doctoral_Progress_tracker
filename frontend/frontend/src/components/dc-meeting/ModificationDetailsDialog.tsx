
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface ModificationDetailsDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  modificationDetails: string;
}

const ModificationDetailsDialog: React.FC<ModificationDetailsDialogProps> = ({
  isOpen,
  onOpenChange,
  modificationDetails
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Modification Details</DialogTitle>
          <DialogDescription>
            The following modifications have been requested by your supervisor:
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 px-2">
          <div className="bg-red-50 border border-red-100 rounded p-4 text-sm text-red-800">
            {modificationDetails}
          </div>
        </div>
        <DialogFooter>
          <Button onClick={() => onOpenChange(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ModificationDetailsDialog;
