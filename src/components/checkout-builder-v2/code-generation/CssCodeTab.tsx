
import React from 'react';
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import { toast } from "sonner";
import { StyleVariables } from '../types';
import { generateCSSCode } from './codeGenerationUtils';

interface CssCodeTabProps {
  styleVariables: StyleVariables;
}

const CssCodeTab: React.FC<CssCodeTabProps> = ({ styleVariables }) => {
  const copyToClipboard = () => {
    navigator.clipboard.writeText(generateCSSCode(styleVariables));
    toast.success('CSS code copied to clipboard!');
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
        <code>{generateCSSCode(styleVariables)}</code>
      </pre>
    </div>
  );
};

export default CssCodeTab;
