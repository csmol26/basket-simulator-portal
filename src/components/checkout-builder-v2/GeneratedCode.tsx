
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Row, StyleVariables } from "./types";
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import { toast } from "sonner";
import { jsonToCssVariable } from "./StyleVarsEditor";

interface GeneratedCodeProps {
  rows: Row[];
  styleVariables: StyleVariables;
}

const GeneratedCode: React.FC<GeneratedCodeProps> = ({ rows, styleVariables }) => {
  const [selectedTheme, setSelectedTheme] = useState<string>("light");
  
  const copyToClipboard = (code: string) => {
    navigator.clipboard.writeText(code);
    toast.success("Code copied to clipboard!");
  };

  // Escape HTML tags for safe display
  const escapeHtml = (code: string) => {
    return code.replace(/</g, '&lt;').replace(/>/g, '&gt;');
  };

  const generateUICode = () => {
    const variableString = Object.entries(styleVariables)
      .filter(([_, value]) => value !== '')
      .map(([key, value]) => `${jsonToCssVariable[key as keyof typeof jsonToCssVariable]}: ${value};`)
      .join('\n    ');
    
    return `// React component that renders the checkout container
import React, { useEffect, useRef } from 'react';
import { initPrimer } from '../lib/primer';

export const PaymentSection = ({ 
  amount, 
  orderId, 
  items,
  onComplete 
}) => {
  const containerRef = useRef(null);

  useEffect(() => {
    if (containerRef.current) {
      initPrimer({
        amount,
        currency: "USD",
        orderId,
        items,
        containerId: "primer-checkout-container",
        onComplete
      });
    }
  }, [amount, orderId, items, onComplete]);

  return (
    <div id="primer-checkout-container" ref={containerRef} 
      className="min-h-48 rounded-md border border-gray-200 p-4 transition-all duration-300 ease-in-out"
      style={{ ${variableString ? '\n    ' + variableString + '\n  ' : ''} }}
    >
      {/* Primer checkout will be rendered here */}
    </div>
  );
};`;
  };

  const generatePrimerCode = () => {
    // Find card components to generate appropriate layout
    let cardComponents = rows.flatMap(row => row.components);
    
    // Generate the card form content based on layout configuration
    let cardFormContent = '';
    
    // Process rows to build card form content
    if (rows.length > 0 && rows.some(row => row.components.length > 0)) {
      for (const row of rows) {
        if (row.components.length === 0) continue;
        
        if (row.components.length === 1) {
          // Single component in row
          const component = row.components[0];
          const placeholder = component.config?.placeholder ? ` placeholder="${component.config.placeholder}"` : '';
          let elementTag = '';
          
          switch (component.originalComponent.id) {
            case 'card-number':
              elementTag = `<primer-input-card-number${placeholder}></primer-input-card-number>`;
              break;
            case 'card-expiry':
              elementTag = `<primer-input-card-expiry${placeholder}></primer-input-card-expiry>`;
              break;
            case 'card-cvv':
              elementTag = `<primer-input-cvv${placeholder}></primer-input-cvv>`;
              break;
            case 'card-holder':
              elementTag = `<primer-input-card-holder-name${placeholder}></primer-input-card-holder-name>`;
              break;
            case 'card-submit':
              elementTag = `<primer-card-form-submit style="height: 40px; width: 100%; font-weight: 500;"></primer-card-form-submit>`;
              break;
          }
          
          cardFormContent += `          ${elementTag}\n`;
        } else if (row.components.length > 1) {
          // Multiple components side by side
          cardFormContent += `          <!-- Multiple components in row -->\n`;
          cardFormContent += `          <div style="display: flex; gap: 16px;">\n`;
          for (const component of row.components) {
            const placeholder = component.config?.placeholder ? ` placeholder="${component.config.placeholder}"` : '';
            let elementTag = '';
            
            switch (component.originalComponent.id) {
              case 'card-number':
                elementTag = `<primer-input-card-number${placeholder}></primer-input-card-number>`;
                break;
              case 'card-expiry':
                elementTag = `<primer-input-card-expiry${placeholder}></primer-input-card-expiry>`;
                break;
              case 'card-cvv':
                elementTag = `<primer-input-cvv${placeholder}></primer-input-cvv>`;
                break;
              case 'card-holder':
                elementTag = `<primer-input-card-holder-name${placeholder}></primer-input-card-holder-name>`;
                break;
              case 'card-submit':
                elementTag = `<primer-card-form-submit style="height: 40px; width: 100%; font-weight: 500;"></primer-card-form-submit>`;
                break;
            }
            
            cardFormContent += `            <div style="flex: 1;">\n`;
            cardFormContent += `              ${elementTag}\n`;
            cardFormContent += `            </div>\n`;
          }
          cardFormContent += `          </div>\n`;
        }
      }
    } else {
      // Default form content if no components added
      cardFormContent = `          <primer-input-card-number placeholder="4444 3333 2222 1111"></primer-input-card-number>
          
          <!-- Expiry and CVV side by side -->
          <div style="display: flex; gap: 16px;">
            <div style="flex: 1;">
              <primer-input-card-expiry placeholder="12/30"></primer-input-card-expiry>
            </div>
            <div style="flex: 1;">
              <primer-input-cvv placeholder="123"></primer-input-cvv>
            </div>
          </div>
          
          <primer-input-card-holder-name placeholder="John Smith"></primer-input-card-holder-name>
          <primer-card-form-submit style="height: 40px; width: 100%; font-weight: 500;"></primer-card-form-submit>`;
    }
    
    // Generate complete checkout HTML
    return `// HTML structure to be injected into the checkout container
// This should be placed in your primer.ts file in the initPrimer function

<primer-checkout client-token="\${clientSession.clientToken}">
  <primer-main slot="main">
    <!-- Payment methods -->
    <div slot="payments">
      <!-- Card payment method -->
      <p class="text-base font-medium text-gray-700 mb-4">Card</p>
      <primer-card-form>
        <div slot="card-form-content" style="--primer-input-height: 40px; --primer-space-medium: 16px; display: flex; flex-direction: column; gap: 16px;">
${cardFormContent}
        </div>
      </primer-card-form>

      <!-- Alternative Payment Methods -->
      <div class="mt-8 pt-6 border-t border-gray-200">
        <p class="text-base font-medium text-gray-700 mb-4">Alternative Payment Method</p>
        <primer-payment-method type="PAYPAL">
          <!-- PayPal payment method will be rendered automatically -->
        </primer-payment-method>
      </div>
    </div>
    
    <!-- Custom completion screen -->
    <div slot="checkout-complete">
      <h2 class="text-xl font-bold text-green-600 text-center my-4">Thank you for your purchase!</h2>
      <p class="text-center text-gray-600">Your order has been processed successfully.</p>
    </div>
  </primer-main>
</primer-checkout>`;
  };

  const generateThemeCode = () => {
    // Theme selection logic
    let baseTheme = '';
    switch (selectedTheme) {
      case 'dark':
        baseTheme = '/* Dark theme base */\n:root {\n  color-scheme: dark;\n}\n\n';
        break;
      case 'minimal':
        baseTheme = '/* Minimal theme base */\n:root {\n  /* Base colors */\n  --primer-color-gray-300: #e6e6e6;\n  --primer-color-gray-400: #cccccc;\n  --primer-color-gray-500: #aaaaaa;\n}\n\n';
        break;
      case 'high-contrast':
        baseTheme = '/* High contrast theme base */\n:root {\n  /* Increased contrast colors */\n  --primer-color-gray-300: #000000;\n  --primer-color-gray-500: #000000;\n  --primer-color-red-500: #cc0000;\n  --primer-color-blue-500: #0000cc;\n}\n\n';
        break;
      default:
        baseTheme = '/* Light theme base */\n';
    }
    
    // Generate CSS variables from style settings
    const cssVariables = Object.entries(styleVariables)
      .filter(([_, value]) => value !== '')
      .map(([key, value]) => `  ${jsonToCssVariable[key as keyof typeof jsonToCssVariable]}: ${value};`)
      .join('\n');
    
    return `${baseTheme}/* Custom theme variables */
:root {
${cssVariables}
}

/* Component-specific styles */
primer-checkout {
  --primer-input-height: 40px;
  --primer-input-width: 100%;
  --primer-input-border-radius: var(--primer-radius-base);
  --primer-input-padding: 0 12px;
  width: 100%;
}

/* Responsive styles */
@media (max-width: 640px) {
  primer-checkout {
    --primer-space-medium: 12px;
  }
}`;
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-lg">Generated Code</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="uiCode" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="uiCode">UI Code</TabsTrigger>
            <TabsTrigger value="primerCode">Primer Code</TabsTrigger>
            <TabsTrigger value="themeCode">Theme Code</TabsTrigger>
          </TabsList>
          
          <TabsContent value="uiCode">
            <div className="mt-4">
              <div className="relative">
                <pre className="p-4 bg-gray-900 rounded-md text-sm overflow-x-auto text-gray-100 whitespace-pre-wrap language-jsx">
                  <code dangerouslySetInnerHTML={{ __html: escapeHtml(generateUICode()) }} />
                </pre>
                <Button 
                  size="sm" 
                  variant="secondary" 
                  className="absolute top-2 right-2"
                  onClick={() => copyToClipboard(generateUICode())}
                >
                  <Copy size={16} />
                </Button>
              </div>
              <p className="text-xs text-gray-500 mt-2">React component to render the checkout container</p>
            </div>
          </TabsContent>
          
          <TabsContent value="primerCode">
            <div className="mt-4">
              <div className="relative">
                <pre className="p-4 bg-gray-900 rounded-md text-sm overflow-x-auto text-gray-100 whitespace-pre-wrap language-html">
                  <code dangerouslySetInnerHTML={{ __html: escapeHtml(generatePrimerCode()) }} />
                </pre>
                <Button 
                  size="sm" 
                  variant="secondary" 
                  className="absolute top-2 right-2"
                  onClick={() => copyToClipboard(generatePrimerCode())}
                >
                  <Copy size={16} />
                </Button>
              </div>
              <p className="text-xs text-gray-500 mt-2">HTML structure for Primer checkout</p>
            </div>
          </TabsContent>
          
          <TabsContent value="themeCode">
            <div className="mt-2 mb-4">
              <label className="text-sm font-medium">Base Theme:</label>
              <div className="flex gap-2 mt-2">
                <Button 
                  variant={selectedTheme === "light" ? "default" : "outline"} 
                  onClick={() => setSelectedTheme("light")}
                  size="sm"
                >
                  Light
                </Button>
                <Button 
                  variant={selectedTheme === "dark" ? "default" : "outline"} 
                  onClick={() => setSelectedTheme("dark")}
                  size="sm"
                >
                  Dark
                </Button>
                <Button 
                  variant={selectedTheme === "minimal" ? "default" : "outline"} 
                  onClick={() => setSelectedTheme("minimal")}
                  size="sm"
                >
                  Minimal
                </Button>
                <Button 
                  variant={selectedTheme === "high-contrast" ? "default" : "outline"} 
                  onClick={() => setSelectedTheme("high-contrast")}
                  size="sm"
                >
                  High Contrast
                </Button>
              </div>
            </div>
          
            <div className="mt-4">
              <div className="relative">
                <pre className="p-4 bg-gray-900 rounded-md text-sm overflow-x-auto text-gray-100 whitespace-pre-wrap language-css">
                  <code dangerouslySetInnerHTML={{ __html: escapeHtml(generateThemeCode()) }} />
                </pre>
                <Button 
                  size="sm" 
                  variant="secondary" 
                  className="absolute top-2 right-2"
                  onClick={() => copyToClipboard(generateThemeCode())}
                >
                  <Copy size={16} />
                </Button>
              </div>
              <p className="text-xs text-gray-500 mt-2">CSS variables for styling the checkout</p>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default GeneratedCode;
