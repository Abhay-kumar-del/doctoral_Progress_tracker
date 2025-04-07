
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface ModificationDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  modificationNote: string;
  setModificationNote: (note: string) => void;
  onRequestModification: () => void;
}

const ModificationDialog: React.FC<ModificationDialogProps> = ({
  isOpen,
  onOpenChange,
  modificationNote,
  setModificationNote,
  onRequestModification
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Request Modification</DialogTitle>
          <DialogDescription>
            Please provide details about what needs to be modified in the meeting minutes.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <label htmlFor="notes" className="text-sm font-medium">Modification Notes</label>
            <textarea 
              id="notes"
              value={modificationNote}
              onChange={(e) => setModificationNote(e.target.value)}
              className="min-h-[100px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              placeholder="Please describe what needs to be modified..."
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={onRequestModification}>Send Request</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ModificationDialog;
