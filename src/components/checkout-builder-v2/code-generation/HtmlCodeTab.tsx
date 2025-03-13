
import React from 'react';
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import { toast } from "sonner";
import { Row, StyleVariables, CheckoutConfig } from '../types';
import { generateHTMLCode } from './codeGenerationUtils';

interface HtmlCodeTabProps {
  rows: Row[];
  checkoutRows: Row[];  // Add checkoutRows prop
  styleVariables: StyleVariables;
  checkoutConfig: CheckoutConfig;
}

const HtmlCodeTab: React.FC<HtmlCodeTabProps> = ({ rows, checkoutRows, styleVariables, checkoutConfig }) => {
  const copyToClipboard = () => {
    navigator.clipboard.writeText(generateHTMLCode(checkoutConfig));
    toast.success('HTML code copied to clipboard!');
  };

  return (
    <div className="relative mt-4 p-4 rounded-md bg-gray-900 text-gray-200 overflow-auto max-h-[500px]">
      <Button 
        variant="outline" 
        size="sm" 
        className="absolute top-2 right-2 bg-gray-800 hover:bg-gray-700 text-white"
        onClick={copyToClipboard}
      >
        <Copy size={16} />
      </Button>
      <pre className="text-sm">
        <code>{generateHTMLCode(checkoutConfig)}</code>
      </pre>
    </div>
  );
};

export default HtmlCodeTab;
