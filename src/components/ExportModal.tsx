import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExport: (format: string) => void;
}

const exportFormats = [
  // Design Software
  'Adobe ASE',
  'Adobe ACO',
  'Figma JSON',
  'Sketch Palette',
  'GIMP GPL',
  'CorelDRAW CPL',
  'Procreate',
  'Adobe Illustrator AI',
  // Web Development
  'CSS Custom Properties',
  'SCSS/SASS Variables',
  'Tailwind CSS Config',
  'Bootstrap Theme',
  'Material Design JSON',
  'CSS Classes',
  // Programming & API
  'JSON Object',
  'JavaScript Array',
  'Python Dictionary',
  'XML Format',
  // Print & Production
  'Pantone Color List',
  'CMYK Values CSV',
  'LAB Color Values',
  'Print-Ready PDF',
  // Data & Documentation
  'Excel Spreadsheet',
  'CSV Data',
  'Plain Text List',
  // Image Exports
  'PNG Image',
  'JPEG Image',
  'SVG Image',
];

const ExportModal: React.FC<ExportModalProps> = ({ isOpen, onClose, onExport }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] glass-card animate-fade-in">
        <DialogHeader>
          <DialogTitle className="text-primary text-xl font-bold">Export Your Palette</DialogTitle>
          <DialogDescription className="text-muted-foreground text-sm mt-2">
            Export to any tool, any workflow, any industry - we speak every designer's language.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="w-full">
                Select Export Format
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-[calc(100%-2rem)] max-h-60 overflow-y-auto">
              {exportFormats.map((format) => (
                <DropdownMenuItem key={format} onClick={() => onExport(format)}>
                  {format}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <Button onClick={onClose} className="w-full">Close</Button>
      </DialogContent>
    </Dialog>
  );
};

export default ExportModal; 