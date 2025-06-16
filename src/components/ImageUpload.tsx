import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload } from 'lucide-react';

interface ImageUploadProps {
  onImageUpload: (imageData: ImageData, fileName: string, base64Data: string) => void;
  onImageChange: (file: File | null) => void;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ onImageUpload, onImageChange }) => {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    onImageChange(null); // Clear current image display if multiple images are dropped
    acceptedFiles.forEach(file => {
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const img = new Image();
          img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d');
            if (ctx) {
              ctx.drawImage(img, 0, 0);
              const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
              onImageUpload(imageData, file.name, e.target?.result as string);
            }
          };
          img.src = e.target?.result as string;
        };
        reader.readAsDataURL(file);
      }
    });
  }, [onImageUpload, onImageChange]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp']
    },
    maxFiles: null, // Allow multiple files
    maxSize: 150 * 1024 * 1024 // 150 MB
  });

  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Upload Image</CardTitle>
      </CardHeader>
      <CardContent>
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
            isDragActive ? 'border-primary bg-primary/5' : 'border-border/30 hover:border-primary/30'
          }`}
        >
          <input {...getInputProps()} />
          <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
          {isDragActive ? (
            <p className="text-primary">Drop the image here...</p>
          ) : (
            <div>
              <p className="mb-2">Drag & drop an image here, or click to select</p>
              <p className="text-sm text-muted-foreground">
                Supports PNG, JPG, JPEG, WEBP, and more
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ImageUpload;
