import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { format } from 'date-fns';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ImageHistoryItem {
  id: string;
  name: string;
  timestamp: Date;
  paletteCount: number;
  dominantColors: string[];
  imageData: string;
}

interface ImageHistoryProps {
  history: ImageHistoryItem[];
  onSelectImage: (imageId: string) => void;
  onDeleteImage: (imageId: string) => void;
  currentDisplayedImageId: string | null;
}

const ImageHistory: React.FC<ImageHistoryProps> = ({ history, onSelectImage, onDeleteImage, currentDisplayedImageId }) => {
  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Uploaded Images</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] overflow-y-auto pr-4">
          {history.length === 0 ? (
            <p className="text-muted-foreground text-center py-4 w-full">No images uploaded yet</p>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 pr-2">
              {history.map((item) => {
                const isCurrent = item.id === currentDisplayedImageId;
                const imageSizeClass = isCurrent ? 'w-full h-40' : 'w-full h-28';
                const textSizeClass = isCurrent ? 'text-base' : 'text-sm';
                const containerPaddingClass = isCurrent ? 'p-4' : 'p-2';

                return (
                  <div
                    key={item.id}
                    className={`relative rounded-lg border border-border/30 hover:border-primary/30 cursor-pointer transition-all duration-300 flex-shrink-0 ${containerPaddingClass} ${isCurrent ? 'bg-primary/10 border-primary ring-2 ring-primary ring-offset-0 shadow-lg shadow-primary/50' : ''}`}
                  >
                    <div
                      className="absolute top-1 right-1 z-10"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteImage(item.id);
                      }}
                    >
                      <Button variant="ghost" size="icon" className="w-5 h-5 rounded-full bg-background/70 hover:bg-background/90 text-foreground p-0.5">
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                    <img
                      src={item.imageData}
                      alt={item.name}
                      className={`${imageSizeClass} object-cover rounded-md mb-2`}
                      onClick={() => onSelectImage(item.id)}
                    />
                    <div className="flex flex-col items-center" onClick={() => onSelectImage(item.id)}>
                      <h3 className={`font-medium truncate text-center ${textSizeClass} w-full`}>{item.name}</h3>
                      <div className="flex gap-1 mt-1">
                        {item.dominantColors.slice(0, 3).map((color, index) => (
                          <div
                            key={index}
                            className="w-4 h-4 rounded-full border border-border/30"
                            style={{ backgroundColor: color }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default ImageHistory; 