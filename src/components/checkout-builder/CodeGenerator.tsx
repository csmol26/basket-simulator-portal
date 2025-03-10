import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Copy } from "lucide-react";
import { toast } from "sonner";
import { jsonToCssVariable } from "./StyleEditor";
import { Row, StyleVariables } from "./types";

interface CodeGeneratorProps {
  rows: Row[];
  styleVariables: StyleVariables;
}

const CodeGenerator: React.FC<CodeGeneratorProps> = ({ rows, styleVariables }) => {
  const generateUICode = () => {
    const variableString = Object.entries(styleVariables)
      .filter(([_, value]) => value !== '')
      .map(([key, value]) => `${jsonToCssVariable[key as keyof typeof jsonToCssVariable]}: ${value};`)
      .join('\n    ');
    
    return `<div id="primer-payment-container" ref={containerRef} 
  className="min-h-48 rounded-md border border-gray-200 p-4 transition-all duration-300 ease-in-out"
  style={{ ${variableString ? '\n    ' + variableString + '\n  ' : ''} }}
>
  {/* Primer checkout will be rendered here */}
</div>`;
  };

  const generatePrimerCode = () => {
    let cardFormContent = rows.map(row => {
      if (row.components.length === 0) return '';
      
      if (row.components.length === 1) {
        const component = row.components[0];
        let config = component.config || {};
        
        let formattedTag = component.content;
        const openingTagEnd = formattedTag.indexOf('>');
        const tagName = formattedTag.substring(1, openingTagEnd);
        
        let attributes = '';
        if (config.label) attributes += ` label="${config.label}"`;
        if (config.placeholder) attributes += ` placeholder="${config.placeholder}"`;
        if (config.ariaLabel) attributes += ` aria-label="${config.ariaLabel}"`;
        
        formattedTag = `<${tagName}${attributes}></${tagName}>`;
        
        return `              ${formattedTag}`;
      }
      
      else {
        return `<div style="display: flex; gap: 16px;">
  ${row.components.map((comp, index) => {
    const config = comp.config || {};
    const spaceSmall = config.spaceSmall || styleVariables.primerSpaceSmall;
    
    const openingTagEnd = comp.content.indexOf('>');
    const tagName = comp.content.substring(1, openingTagEnd);
    
    let attributes = '';
    if (config.label) attributes += ` label="${config.label}"`;
    if (config.placeholder) attributes += ` placeholder="${config.placeholder}"`;
    if (config.ariaLabel) attributes += ` aria-label="${config.ariaLabel}"`;
    
    const formattedTag = `<${tagName}${attributes}></${tagName}>`;
    
    return `<div style="flex: 1; margin-bottom: ${spaceSmall};">
    ${formattedTag}
  </div>`;
  }).join('\n  ')}
</div>`;
      }
    }).filter(content => content).join('\n');

    const checkoutHtml = `<primer-checkout client-token="\${clientSession.clientToken}">
  <primer-main slot="main">
    <!-- Payment methods -->
    <div slot="payments">
      <!-- Card payment method -->
      <p class="text-base font-medium text-gray-700 mb-4">Card</p>
      <primer-card-form>
        <div slot="card-form-content" 
             style="--primer-input-height: 40px; --primer-space-medium: 16px; 
                    display: flex; flex-direction: column; gap: 16px;">
          <div style="display: flex; gap: 16px;">
            <div style="flex: 1; margin-bottom: 8px;">
              <primer-input-card-number label="Card Number" 
                                      placeholder="4444 3333 2222 1111" 
                                      aria-label="Card Number">
              </primer-input-card-number>
            </div>
            <div style="flex: 1; margin-bottom: 8px;">
              <primer-input-card-expiry label="Expiry Date" 
                                      placeholder="MM/YY" 
                                      aria-label="Card Expiry Date">
              </primer-input-card-expiry>
            </div>
            <div style="flex: 1; margin-bottom: 8px;">
              <primer-input-cvv label="CVV" 
                              placeholder="123" 
                              aria-label="Card Security Code">
              </primer-input-cvv>
            </div>
          </div>
          <primer-input-card-holder-name label="Cardholder Name" 
                                       placeholder="John Smith" 
                                       aria-label="Cardholder Name">
          </primer-input-card-holder-name>
          <primer-card-form-submit></primer-card-form-submit>
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
    
    return checkoutHtml;
  };

  const copyToClipboard = (code: string) => {
    navigator.clipboard.writeText(code);
    toast.success("Code copied to clipboard!");
  };

  const syntaxHighlightingStyles = `
    .code-highlight {
      color: #F6F6F7; /* Light gray for general text */
    }
    .code-highlight .tag {
      color: #33C3F0; /* Bright blue for tags */
    }
    .code-highlight .attr-name {
      color: #9F9EA1; /* Silver gray for attribute names */
    }
    .code-highlight .attr-value {
      color: #C8C8C9; /* Light gray for attribute values */
    }
    .code-highlight .comment {
      color: #8A898C; /* Medium gray for comments */
    }
  `;

  const applyHighlighting = (code: string) => {
    let highlighted = code.replace(/<\/?([a-z-]+)(?:\s|>)/gi, (match) => 
      `<span class="tag">${match}</span>`
    );
    
    highlighted = highlighted.replace(/\s([a-z-]+)=/gi, (match) => 
      `<span class="attr-name">${match}</span>`
    );
    
    highlighted = highlighted.replace(/"([^"]*)"/g, (match) => 
      `<span class="attr-value">${match}</span>`
    );
    
    highlighted = highlighted.replace(/<!--([\s\S]*?)-->/g, (match) => 
      `<span class="comment">${match}</span>`
    );
    
    return highlighted;
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-lg">Generated Code</CardTitle>
      </CardHeader>
      <CardContent>
        <style>{syntaxHighlightingStyles}</style>
        <Tabs defaultValue="uiCode" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="uiCode">UI Code</TabsTrigger>
            <TabsTrigger value="primerCode">Primer Code</TabsTrigger>
          </TabsList>
          
          <TabsContent value="uiCode" className="mt-4">
            <div className="relative">
              <pre className="p-4 bg-gray-900 rounded-md text-sm overflow-x-auto">
                <code className="code-highlight" dangerouslySetInnerHTML={{ __html: applyHighlighting(generateUICode()) }} />
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
            <p className="text-xs text-gray-500 mt-2">Copy this code to your PaymentSection.tsx file</p>
          </TabsContent>
          
          <TabsContent value="primerCode" className="mt-4">
            <div className="relative">
              <pre className="p-4 bg-gray-900 rounded-md text-sm overflow-x-auto">
                <code className="code-highlight" dangerouslySetInnerHTML={{ __html: applyHighlighting(generatePrimerCode()) }} />
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
            <p className="text-xs text-gray-500 mt-2">Copy this code to the initPrimer function in primer.ts</p>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default CodeGenerator;
