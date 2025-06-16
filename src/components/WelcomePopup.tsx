import React from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Sparkles, Palette, Download, Eye, Layers } from 'lucide-react';

interface WelcomePopupProps {
  isOpen: boolean;
  onClose: () => void;
}

const WelcomePopup: React.FC<WelcomePopupProps> = ({ isOpen, onClose }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden border-none">
        <div className="relative">
          {/* Animated gradient background */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-accent/20 to-primary/20 animate-gradient" />
          
          {/* Glassmorphism content */}
          <div className="relative p-8 backdrop-blur-xl bg-background/30 border border-border/50">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                <Sparkles className="w-8 h-8 text-primary" />
              </div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-2">
                Welcome to Smart Palette Pro
              </h2>
              <p className="text-muted-foreground text-lg">
                Every great design starts with the perfect color palette
              </p>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start space-x-3 p-4 rounded-lg bg-background/20">
                  <Palette className="w-5 h-5 text-primary mt-1" />
                  <div>
                    <h3 className="font-semibold mb-1">AI-Powered Intelligence</h3>
                    <p className="text-sm text-muted-foreground">
                      Smart color generation based on design principles
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 p-4 rounded-lg bg-background/20">
                  <Download className="w-5 h-5 text-primary mt-1" />
                  <div>
                    <h3 className="font-semibold mb-1">20+ Export Formats</h3>
                    <p className="text-sm text-muted-foreground">
                      Export in multiple professional formats
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 p-4 rounded-lg bg-background/20">
                  <Eye className="w-5 h-5 text-primary mt-1" />
                  <div>
                    <h3 className="font-semibold mb-1">Accessibility Checking</h3>
                    <p className="text-sm text-muted-foreground">
                      Real-time WCAG compliance verification
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 p-4 rounded-lg bg-background/20">
                  <Layers className="w-5 h-5 text-primary mt-1" />
                  <div>
                    <h3 className="font-semibold mb-1">Brand Identity Tools</h3>
                    <p className="text-sm text-muted-foreground">
                      Complete suite of brand color tools
                    </p>
                  </div>
                </div>
              </div>

              <div className="text-center">
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity"
                  onClick={onClose}
                >
                  Start Creating
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default WelcomePopup; 