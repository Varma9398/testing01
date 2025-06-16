import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Trash, Palette as PaletteIcon, Download, Clock } from 'lucide-react';
import { ColorInfo, ColorPalette, exportPalette } from '@/utils/colorUtils';
import { toast } from '@/hooks/use-toast';
import ColorSwatch from './ColorSwatch';

interface SavedPalettesProps {
  palettes: ColorPalette[];
  onPaletteLoad: (colors: ColorInfo[], harmony: string) => void;
  onClearPalettes: () => void;
  onDeletePalette: (id: string) => void;
}

const SavedPalettes: React.FC<SavedPalettesProps> = ({ palettes, onPaletteLoad, onClearPalettes, onDeletePalette }) => {
  const handleExport = (palette: ColorPalette, format: string = 'css') => {
    const exportedData = exportPalette(palette, format);
    
    Promise.resolve(exportedData).then(data => {
      let mimeType = 'text/plain';
      let filenameExtension = format.toLowerCase().replace(/\s/g, '-');

      if (format === 'Adobe ASE') {
        mimeType = 'application/octet-stream';
        filenameExtension = 'ase';
      } else if (format.includes('JSON')) {
        mimeType = 'application/json';
        filenameExtension = 'json';
      } else if (format.includes('CSS') || format.includes('SCSS') || format.includes('Tailwind') || format.includes('Bootstrap')) {
        mimeType = 'text/css';
        filenameExtension = format.toLowerCase().includes('scss') ? 'scss' : 'css';
        if (format.includes('Tailwind')) filenameExtension = 'js';
      } else if (format.includes('XML')) {
        mimeType = 'application/xml';
        filenameExtension = 'xml';
      } else if (format.includes('CSV') || format.includes('Excel')) {
        mimeType = 'text/csv';
        filenameExtension = 'csv';
      } else if (format.includes('JavaScript Array')) {
        mimeType = 'application/javascript';
        filenameExtension = 'js';
      } else if (format.includes('Python Dictionary')) {
        mimeType = 'text/x-python';
        filenameExtension = 'py';
      } else if (format.includes('GIMP GPL')) {
        mimeType = 'application/x-gimp-palette';
        filenameExtension = 'gpl';
      } else if (format.includes('Sketch Palette')) {
        mimeType = 'application/json';
        filenameExtension = 'sketchpalette';
      } else if (format.includes('Plain Text')) {
        mimeType = 'text/plain';
        filenameExtension = 'txt';
      } else if (format.includes('PNG Image')) {
        mimeType = 'image/png';
        filenameExtension = 'png';
      } else if (format.includes('JPEG Image')) {
        mimeType = 'image/jpeg';
        filenameExtension = 'jpeg';
      } else if (format.includes('SVG Image')) {
        mimeType = 'image/svg+xml';
        filenameExtension = 'svg';
      }
      
      const blob = new Blob([data], { type: mimeType });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${palette.name.replace(/\s+/g, '-').toLowerCase()}.${filenameExtension}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast({
        title: "Exported!",
        description: `Palette exported as ${format.toUpperCase()}`,
      });
    }).catch(error => {
      console.error('Export failed:', error);
      toast({
        title: "Export failed",
        description: `Failed to export palette as ${format}. Please try again.`, 
        variant: "destructive",
      });
    });
  };

  const handleLoad = (palette: ColorPalette) => {
    onPaletteLoad(palette.colors, palette.harmony);
    toast({
      title: "Loaded!",
      description: `${palette.name} loaded into editor`,
    });
  };

  const handleClearAll = () => {
    onClearPalettes();
  };

  const formatDateTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    });
  };

  if (palettes.length === 0) {
    return (
      <Card className="glass-card">
        <CardContent className="p-8 text-center">
          <PaletteIcon className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">No saved palettes yet</p>
          <p className="text-sm text-muted-foreground mt-2">
            Create and save your first palette to see it here
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="glass-card">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xl font-semibold">Saved Palettes</CardTitle>
        {palettes.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClearAll}
            className="text-red-500 hover:text-red-600"
          >
            <Trash className="w-4 h-4 mr-1" />
            Delete All
          </Button>
        )}
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[500px] pr-4">
          <div className="grid grid-cols-1 gap-3">
            {palettes.map((palette) => (
              <div
                key={palette.id}
                className="p-2 rounded-lg border border-border/30 hover:border-primary/30 cursor-pointer transition-colors"
                onClick={() => handleLoad(palette)}
              >
                <div className="flex justify-between items-center mb-1">
                  <div>
                    <h3 className="font-medium truncate text-base">{palette.name}</h3>
                    <div className="flex items-center text-xs text-muted-foreground mt-0.5">
                      <Clock className="w-3 h-3 mr-1" />
                      {formatDateTime(palette.createdAt)}
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleExport(palette);
                      }}
                      className="h-7 w-7 p-0"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeletePalette(palette.id);
                      }}
                      className="h-7 w-7 p-0 text-muted-foreground hover:text-foreground"
                    >
                      <Trash className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>
                <div className="flex gap-1">
                  {palette.colors.map((color, index) => (
                    <div
                      key={index}
                      className="w-5 h-5 rounded-full border border-border/30"
                      style={{ backgroundColor: color.hex }}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default SavedPalettes;
