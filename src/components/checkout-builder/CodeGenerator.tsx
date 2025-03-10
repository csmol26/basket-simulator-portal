
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Copy } from "lucide-react";
import { toast } from "sonner";
import { jsonToCssVariable } from "./StyleEditor";

interface DragItem {
  id: string;
  content: string;
}

interface Row {
  id: string;
  components: DragItem[];
}

interface CodeGeneratorProps {
  rows: Row[];
  styleVariables: Record<string, string>;
}

const CodeGenerator: React.FC<CodeGeneratorProps> = ({ rows, styleVariables }) => {
  // Generate UI code for PaymentSection
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

  // Generate code for primer.ts (checkout structure)
  const generatePrimerCode = () => {
    // Create the HTML structure based on the rows and components
    let cardFormContent = rows.map(row => {
      if (row.components.length === 0) return '';
      
      if (row.components.length === 1) {
        return row.components[0].content;
      } else {
        // Multiple components in a row should be rendered in a flex container
        return `<div style="display: flex; gap: 16px;">
  ${row.components.map(comp => `  <div style="flex: 1;">\n    ${comp.content}\n  </div>`).join('\n  ')}
</div>`;
      }
    }).filter(content => content).join('\n');
    
    const cardPaymentHtml = `<primer-card-form>
  <div slot="card-form-content" style="--primer-input-height: 40px; --primer-space-medium: 16px; display: flex; flex-direction: column; gap: 16px;">
    ${cardFormContent}
  </div>
</primer-card-form>`;

    const checkoutHtml = `
      <primer-checkout client-token="\${clientSession.clientToken}">
        <primer-main slot="main">
          <!-- Payment methods -->
          <div slot="payments">
            <!-- Card payment method -->
            <p class="text-base font-medium text-gray-700 mb-4">Card</p>
            ${cardPaymentHtml}
          </div>
          
          <!-- Custom completion screen -->
          <div slot="checkout-complete">
            <h2 class="text-xl font-bold text-green-600 text-center my-4">Thank you for your purchase!</h2>
            <p class="text-center text-gray-600">Your order has been processed successfully.</p>
          </div>
        </primer-main>
      </primer-checkout>
    `;
    
    return checkoutHtml;
  };

  // Copy code to clipboard
  const copyToClipboard = (code: string) => {
    navigator.clipboard.writeText(code);
    toast.success("Code copied to clipboard!");
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-lg">Generated Code</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="uiCode" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="uiCode">UI Code</TabsTrigger>
            <TabsTrigger value="primerCode">Primer Code</TabsTrigger>
          </TabsList>
          
          <TabsContent value="uiCode" className="mt-4">
            <div className="relative">
              <pre className="p-4 bg-gray-900 text-gray-100 rounded-md text-sm overflow-x-auto">
                <code>{generateUICode()}</code>
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
              <pre className="p-4 bg-gray-900 text-gray-100 rounded-md text-sm overflow-x-auto">
                <code>{generatePrimerCode()}</code>
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
