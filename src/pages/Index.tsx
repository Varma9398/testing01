import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Palette, Upload, Download, Save } from 'lucide-react';
import { Link } from 'react-router-dom';
import ImageUpload from '@/components/ImageUpload';
import PaletteDisplay from '@/components/PaletteDisplay';
import HarmonyGenerator from '@/components/HarmonyGenerator';
import SavedPalettes from '@/components/SavedPalettes';
import AllPalettesDisplay from '@/components/AllPalettesDisplay';
import ImageHistory from '@/components/ImageHistory';
import WelcomePopup from '@/components/WelcomePopup';
import { ColorInfo, ColorPalette, extractColorsFromImage, extractAllColorPalettes, clearAllPalettes, savePalette, getSavedPalettes } from '@/utils/colorUtils';
import { ImageHistoryItem, saveImageToHistory, getImageHistory, removeImageFromHistory } from '@/utils/imageHistoryUtils';

const Index = () => {
  const [extractedColors, setExtractedColors] = useState<ColorInfo[]>([]);
  const [allPalettes, setAllPalettes] = useState<{
    dominant: ColorInfo[];
    vibrant: ColorInfo[];
    muted: ColorInfo[];
    light: ColorInfo[];
    dark: ColorInfo[];
  }>({
    dominant: [],
    vibrant: [],
    muted: [],
    light: [],
    dark: []
  });
  const [currentPalette, setCurrentPalette] = useState<ColorInfo[]>([]);
  const [currentHarmony, setCurrentHarmony] = useState<string>('extracted');
  const [hasImage, setHasImage] = useState(false);
  const [imageHistory, setImageHistory] = useState<ImageHistoryItem[]>([]);
  const [currentDisplayedImageId, setCurrentDisplayedImageId] = useState<string | null>(null);
  const [showWelcomePopup, setShowWelcomePopup] = useState(false);
  const [savedPalettes, setSavedPalettes] = useState<ColorPalette[]>([]);

  // Check if user is new on component mount
  useEffect(() => {
    setShowWelcomePopup(true);
  }, []);

  // Load image history and saved palettes on component mount
  useEffect(() => {
    const history = getImageHistory();
    setImageHistory(history);
    console.log('Initial image history loaded:', history);

    const palettes = getSavedPalettes();
    setSavedPalettes(palettes);
    console.log('Initial saved palettes loaded:', palettes);
  }, []);

  // Synchronize saved palettes with localStorage whenever savedPalettes state changes
  useEffect(() => {
    localStorage.setItem('savedPalettes', JSON.stringify(savedPalettes));
  }, [savedPalettes]);

  const handleImageUpload = (imageData: ImageData, fileName: string, base64Data: string) => {
    console.log('Image uploaded, extracting colors...'); // Debug log
    const colors = extractColorsFromImage(imageData);
    const palettes = extractAllColorPalettes(imageData);
    
    setExtractedColors(colors);
    setAllPalettes(palettes);
    setCurrentPalette(palettes.dominant);
    setCurrentHarmony('dominant');
    setHasImage(true);
    
    // Save to history
    const dominantColors = palettes.dominant.map(color => color.hex);
    const historyItem = saveImageToHistory(
      fileName,
      Object.keys(palettes).length,
      dominantColors,
      base64Data
    );
    setImageHistory(prev => {
      const newHistory = [historyItem, ...prev];
      console.log('Image history after upload:', newHistory);
      return newHistory;
    });
    setCurrentDisplayedImageId(historyItem.id);
    console.log('Current displayed image ID after upload:', historyItem.id);
    
    console.log('Colors extracted:', colors.length); // Debug log
    console.log('Palettes extracted:', palettes); // Debug log
  };

  const handleImageChange = (file: File | null) => {
    if (!file) {
      setExtractedColors([]);
      setAllPalettes({
        dominant: [],
        vibrant: [],
        muted: [],
        light: [],
        dark: []
      });
      setCurrentPalette([]);
      setHasImage(false);
      setCurrentDisplayedImageId(null);
      console.log('Image cleared, current displayed ID set to null.');
    }
  };

  const handleHistoryImageSelect = (imageId: string) => {
    console.log('Attempting to select image from history with ID:', imageId);
    const selectedImage = imageHistory.find(item => item.id === imageId);
    if (selectedImage) {
      console.log('Image found in history:', selectedImage.name);
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0);
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const colors = extractColorsFromImage(imageData);
          const palettes = extractAllColorPalettes(imageData);
          
          setExtractedColors(colors);
          setAllPalettes(palettes);
          setCurrentPalette(palettes.dominant);
          setCurrentHarmony('dominant');
          setHasImage(true);
          setCurrentDisplayedImageId(selectedImage.id);
          console.log('Successfully loaded and re-processed image from history.');
          console.log('Current displayed image ID after history selection:', selectedImage.id);
        }
      };
      img.src = selectedImage.imageData;
    } else {
      console.log('Image with ID', imageId, 'not found in history.');
    }
  };

  const handleDeleteImage = (imageId: string) => {
    console.log('Attempting to delete image with ID:', imageId);
    removeImageFromHistory(imageId);
    const updatedHistory = getImageHistory();
    setImageHistory(updatedHistory); // Refresh history after deletion
    console.log('Image history after deletion:', updatedHistory);

    if (currentDisplayedImageId === imageId) {
      console.log('Deleted image was currently displayed. Clearing current palette.');
      setExtractedColors([]);
      setAllPalettes({
        dominant: [], vibrant: [], muted: [], light: [], dark: []
      });
      setCurrentPalette([]);
      setHasImage(false);
      setCurrentDisplayedImageId(null);
    }
  };

  const handleClearSavedPalettes = () => {
    clearAllPalettes();
    setSavedPalettes([]); // Update local state after clearing
    console.log('All saved palettes cleared.');
  };

  const handleHarmonyGenerated = (colors: ColorInfo[], harmony: string) => {
    console.log('Harmony generated:', harmony, colors.length); // Debug log
    setCurrentPalette(colors);
    setCurrentHarmony(harmony);
  };

  const handlePaletteLoad = (colors: ColorInfo[], harmony: string) => {
    console.log('Palette loaded:', harmony, colors.length); // Debug log
    setCurrentPalette(colors);
    setCurrentHarmony(harmony);
  };

  const handlePaletteSelect = (colors: ColorInfo[], type: string) => {
    console.log('Palette selected:', type, colors.length); // Debug log
    setCurrentPalette(colors);
    setCurrentHarmony(type);
  };

  const handlePaletteSave = (palette: ColorPalette) => {
    // Instead of calling savePalette directly here, update the state
    setSavedPalettes(prevPalettes => {
      const existingIndex = prevPalettes.findIndex(p => p.id === palette.id);
      if (existingIndex > -1) {
        // Update existing palette
        const updated = [...prevPalettes];
        updated[existingIndex] = palette;
        return updated;
      } else {
        // Add new palette to the beginning
        return [palette, ...prevPalettes];
      }
    });
    console.log('Palette saved successfully (via state update):', palette.name); // Debug log
  };

  return (
    <div className="min-h-screen gradient-bg p-4">
      {/* Welcome Popup */}
      <WelcomePopup 
        isOpen={showWelcomePopup} 
        onClose={() => setShowWelcomePopup(false)} 
      />

      {/* Header */}
      <header className="max-w-7xl mx-auto mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center glass-card">
              <Palette className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Smart Palette Pro
              </h1>
              <p className="text-muted-foreground">Professional Color Palette Generator</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Top row - Tools (Image Upload and Image History) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ImageUpload onImageUpload={handleImageUpload} onImageChange={handleImageChange} />
          <ImageHistory
            key={JSON.stringify(imageHistory)}
            history={imageHistory}
            onSelectImage={handleHistoryImageSelect}
            onDeleteImage={handleDeleteImage}
            currentDisplayedImageId={currentDisplayedImageId}
          />
        </div>

        {/* All Palettes Display - Shows when image is uploaded */}
        {hasImage && (
          <AllPalettesDisplay 
            palettes={allPalettes} 
            onPaletteSelect={handlePaletteSelect}
          />
        )}

        {/* Middle row (Current Palette and Harmony Generator) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Current Palette Display */}
          <PaletteDisplay 
            colors={currentPalette}
            harmony={currentHarmony}
            onSave={handlePaletteSave}
          />

          {/* Harmony Generator */}
          <HarmonyGenerator 
            baseColor={extractedColors[0] || null} 
            onHarmonyGenerated={handleHarmonyGenerated}
          />
        </div>

        {/* Saved Palettes moved here (bottom) */}
        <SavedPalettes 
          palettes={savedPalettes}
          onPaletteLoad={handlePaletteLoad} 
          onClearPalettes={handleClearSavedPalettes}
          onDeletePalette={(id) => setSavedPalettes(prev => prev.filter(p => p.id !== id))}
        />
      </div>

      {/* Footer */}
      <footer className="max-w-7xl mx-auto mt-12 pt-8 border-t border-border/20">
        <div className="text-center text-sm text-muted-foreground">
          <p className="text-lg font-semibold">
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Smart Palette Pro</span>
            {' '} - Export to any tool, any workflow, any industry - we speak every designer's language.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
