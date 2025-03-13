
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import { toast } from "sonner";
import { Row, CheckoutConfig, StyleVariables } from './types';
import { generatePrimerCode } from './code-generation/codeGenerationUtils';

interface CheckoutCodePreviewProps {
  checkoutRows: Row[];
  cardFormRows: Row[];
  styleVariables: StyleVariables;
  checkoutConfig: CheckoutConfig;
}

const CheckoutCodePreview: React.FC<CheckoutCodePreviewProps> = ({ 
  checkoutRows, 
  cardFormRows, 
  styleVariables, 
  checkoutConfig 
}) => {
  const code = generatePrimerCode(cardFormRows, checkoutRows, styleVariables, checkoutConfig);
  
  const copyToClipboard = () => {
    navigator.clipboard.writeText(code);
    toast.success("Code copied to clipboard");
  };

  return (
    <Card className="mt-4">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-md font-medium">
          Generated Checkout Code
        </CardTitle>
        <Button 
          variant="outline" 
          size="sm" 
          className="h-8 gap-1"
          onClick={copyToClipboard}
        >
          <Copy className="h-3.5 w-3.5" />
          <span>Copy</span>
        </Button>
      </CardHeader>
      <CardContent>
        <div className="relative">
          <pre className="language-html rounded-md bg-slate-950 p-4 text-white text-sm overflow-x-auto max-h-[300px]">
            <code dangerouslySetInnerHTML={{ __html: code.replace(/</g, '&lt;').replace(/>/g, '&gt;') }}></code>
          </pre>
        </div>
      </CardContent>
    </Card>
  );
};

export default CheckoutCodePreview;
