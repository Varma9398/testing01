import { v4 as uuidv4 } from 'uuid';

export interface ImageHistoryItem {
  id: string;
  name: string;
  timestamp: Date;
  paletteCount: number;
  dominantColors: string[];
  imageData: string; // Base64 encoded image data
}

const HISTORY_STORAGE_KEY = 'smart_palette_image_history';

export const saveImageToHistory = (
  name: string,
  paletteCount: number,
  dominantColors: string[],
  imageData: string
): ImageHistoryItem => {
  const history = getImageHistory();
  const newItem: ImageHistoryItem = {
    id: uuidv4(),
    name,
    timestamp: new Date(),
    paletteCount,
    dominantColors,
    imageData,
  };

  // Keep only the last 20 images
  const updatedHistory = [newItem, ...history].slice(0, 20);
  localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(updatedHistory));
  return newItem;
};

export const getImageHistory = (): ImageHistoryItem[] => {
  const history = localStorage.getItem(HISTORY_STORAGE_KEY);
  if (!history) return [];
  
  try {
    const parsedHistory = JSON.parse(history);
    // Convert string timestamps back to Date objects
    return parsedHistory.map((item: any) => ({
      ...item,
      timestamp: new Date(item.timestamp),
    }));
  } catch (error) {
    console.error('Error parsing image history:', error);
    return [];
  }
};

export const removeImageFromHistory = (id: string): void => {
  const history = getImageHistory();
  const updatedHistory = history.filter(item => item.id !== id);
  localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(updatedHistory));
};

export const clearImageHistory = (): void => {
  localStorage.removeItem(HISTORY_STORAGE_KEY);
}; 