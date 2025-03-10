
import React, { useEffect, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface PaymentSectionProps {
  showPrimerCheckout: boolean;
}

const PaymentSection: React.FC<PaymentSectionProps> = ({ showPrimerCheckout }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentTheme, setCurrentTheme] = useState<string>("default");

  // Add Primer CSS and theme handling
  useEffect(() => {
    if (showPrimerCheckout) {
      // Add the main Primer styles
      const linkElement = document.createElement('link');
      linkElement.rel = 'stylesheet';
      linkElement.href = 'https://sdk.primer.io/web/primer-js/v0-latest/styles.css';
      document.head.appendChild(linkElement);

      // Add Google Fonts for Poppins
      const fontLinkElement = document.createElement('link');
      fontLinkElement.rel = 'stylesheet';
      fontLinkElement.href = 'https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&family=Comic+Sans+MS&family=VT323&display=swap';
      document.head.appendChild(fontLinkElement);

      // Add custom CSS variables globally based on selected theme
      const styleElement = document.createElement('style');
      styleElement.id = 'primer-theme-styles';
      document.head.appendChild(styleElement);
      
      // Set initial theme
      applyTheme(currentTheme);

      return () => {
        // Clean up styles when component unmounts
        document.head.removeChild(linkElement);
        document.head.removeChild(fontLinkElement);
        const themeStyle = document.getElementById('primer-theme-styles');
        if (themeStyle) document.head.removeChild(themeStyle);
      };
    }
  }, [showPrimerCheckout]);

  // Apply theme when it changes
  useEffect(() => {
    if (showPrimerCheckout) {
      applyTheme(currentTheme);
    }
  }, [currentTheme, showPrimerCheckout]);

  const applyTheme = (theme: string) => {
    const styleElement = document.getElementById('primer-theme-styles') as HTMLStyleElement;
    if (!styleElement) return;

    let themeStyles = '';

    switch(theme) {
      case 'minimal':
        themeStyles = `
          :root {
            --primer-color-brand: #666666;
            --primer-color-gray-300: #e6e6e6;
            --primer-color-gray-400: #cccccc;
            --primer-color-gray-500: #aaaaaa;
            --primer-color-gray-600: #777777;
            --primer-color-red-500: #888888;
            --primer-color-red-900: #666666;
            --primer-color-blue-500: #777777;
            --primer-color-blue-900: #555555;
            --primer-radius-base: 2px;
            --primer-space-base: 4px;
            --primer-typography-brand: 'Inter', sans-serif;
            --primer-color-background: transparent;
            --primer-color-text-primary: #333333;
            --primer-color-focus: #777777;
          }
        `;
        break;
      case 'high-contrast':
        themeStyles = `
          :root {
            --primer-color-brand: #000000;
            --primer-color-gray-300: #000000;
            --primer-color-gray-400: #333333;
            --primer-color-gray-500: #000000;
            --primer-color-gray-600: #000000;
            --primer-color-gray-900: #000000;
            --primer-color-red-500: #cc0000;
            --primer-color-red-900: #990000;
            --primer-color-blue-500: #0000cc;
            --primer-color-blue-900: #000099;
            --primer-radius-base: 0px;
            --primer-space-base: 6px;
            --primer-typography-brand: 'Inter', sans-serif;
            --primer-color-background: transparent;
            --primer-color-text-primary: #000000;
            --primer-color-focus: #cc0000;
          }
        `;
        break;
      case 'kawaii':
        themeStyles = `
          :root {
            --primer-color-brand: #ff70b5;
            --primer-color-gray-100: #fff0f7;
            --primer-color-gray-200: #ffe6f3;
            --primer-color-gray-300: #ffcce6;
            --primer-color-gray-400: #ffadda;
            --primer-color-gray-500: #ff8dce;
            --primer-color-gray-600: #ff6dbc;
            --primer-color-gray-900: #994068;
            --primer-color-gray-000: #ffffff;
            --primer-color-red-100: #fff0f0;
            --primer-color-red-500: #ff7eb3;
            --primer-color-red-900: #e83a8c;
            --primer-color-blue-500: #7eb3ff;
            --primer-color-blue-900: #5e72e4;
            --primer-radius-base: 12px;
            --primer-typography-brand: 'Comic Sans MS', cursive, sans-serif;
            --primer-space-base: 6px;
            --primer-color-background: #fff0f7;
            --primer-color-text-primary: #994068;
            --primer-color-focus: #ff70b5;
          }
        `;
        break;
      case 'retro-90s':
        themeStyles = `
          :root {
            --primer-color-brand: #00ccff;
            --primer-color-gray-100: #fcfcfc;
            --primer-color-gray-200: #f5f5f5;
            --primer-color-gray-300: #ff00ff;
            --primer-color-gray-400: #00ccff;
            --primer-color-gray-500: #ff6633;
            --primer-color-gray-600: #663399;
            --primer-color-gray-900: #000000;
            --primer-color-gray-000: #ffffff;
            --primer-color-red-100: #ffff00;
            --primer-color-red-500: #ff6633;
            --primer-color-red-900: #cc0033;
            --primer-color-blue-500: #33ccff;
            --primer-color-blue-900: #3300ff;
            --primer-radius-base: 0px;
            --primer-typography-brand: 'VT323', 'Courier New', monospace;
            --primer-space-base: 8px;
            --primer-color-background: #000000;
            --primer-color-text-primary: #00ccff;
            --primer-color-focus: #ff00ff;
          }
        `;
        break;
      default: // default theme
        themeStyles = `
          :root {
            --primer-typography-brand: 'Poppins', sans-serif;
            --primer-color-brand: #18A94B;
            --primer-color-background: transparent;
            --primer-radius-base: 16px;
            --primer-space-base: 4px;
            --primer-color-text-primary: #4CAF50;
            --primer-color-focus: #DE00D1;
          }
        `;
    }

    styleElement.textContent = themeStyles;
    
    // Set data-theme attribute on container
    if (containerRef.current) {
      containerRef.current.setAttribute('data-theme', theme);
    }
  };

  const handleThemeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCurrentTheme(e.target.value);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-medium">The Chris' awesome payment form</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {!showPrimerCheckout ? (
            <p className="text-sm text-gray-500">
              Payment information will be securely collected via the Primer payment interface after validating your shipping information.
            </p>
          ) : (
            <div className="space-y-4">
              {/* Primer logo image moved above the "Card" heading */}
              <div className="flex justify-center mb-4">
                <img 
                  src="https://disruptivetechnews.com/wp-content/uploads/1663672073-primer-io-2x.jpeg" 
                  alt="Primer.io" 
                  className="h-16 object-contain"
                />
              </div>
              
              {/* Theme selector */}
              <div className="flex items-center gap-4 mb-6">
                <label htmlFor="theme-selector" className="text-sm font-medium">
                  Payment Theme:
                </label>
                <select 
                  id="theme-selector" 
                  className="p-2 rounded-md border border-gray-200 text-sm"
                  value={currentTheme}
                  onChange={handleThemeChange}
                >
                  <option value="default">Default</option>
                  <option value="minimal">Minimal</option>
                  <option value="high-contrast">High Contrast</option>
                  <option value="kawaii">Kawaii</option>
                  <option value="retro-90s">Retro 90s</option>
                </select>
              </div>
            </div>
          )}
          
          {/* Container for Primer checkout */}
          <div 
            id="primer-payment-container" 
            ref={containerRef}
            className={`min-h-48 rounded-md border border-gray-200 p-4 transition-all duration-300 ease-in-out ${currentTheme === 'kawaii' ? 'bg-pink-50' : ''} ${currentTheme === 'retro-90s' ? 'bg-black text-blue-400 border-pink-500 border-2' : ''}`}
            data-theme={currentTheme}
          >
            {!showPrimerCheckout && (
              <div className="flex items-center justify-center h-full">
                <p className="text-muted-foreground text-sm">Payment form will appear here</p>
              </div>
            )}
          </div>
          
          {/* Theme description area only shown when checkout is visible */}
          {showPrimerCheckout && (
            <div className={`mt-4 p-4 rounded-md text-sm ${
              currentTheme === 'kawaii' ? 'bg-pink-50 border border-dashed border-pink-300' : 
              currentTheme === 'retro-90s' ? 'bg-blue-900 text-white border-2 border-pink-500' :
              currentTheme === 'high-contrast' ? 'bg-gray-100 border border-black' :
              'bg-gray-50'
            }`}>
              <h3 className="font-medium mb-2">
                {currentTheme === 'default' ? 'Default Theme' : 
                 currentTheme === 'minimal' ? 'Minimal Theme' :
                 currentTheme === 'high-contrast' ? 'High Contrast Theme' :
                 currentTheme === 'kawaii' ? 'Kawaii Theme' :
                 'Retro 90s Theme'}
              </h3>
              <p className="text-xs">
                {currentTheme === 'default' ? 'The standard Primer checkout theme with green accents and rounded corners.' : 
                 currentTheme === 'minimal' ? 'A minimalist grayscale theme with subtle styling and small radius.' :
                 currentTheme === 'high-contrast' ? 'Maximum accessibility with strong black borders and high contrast elements.' :
                 currentTheme === 'kawaii' ? 'Playful pink theme with soft rounded corners and Comic Sans font.' :
                 'Nostalgic 90s web design with bright colors, sharp edges, and monospace font.'}
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default PaymentSection;
