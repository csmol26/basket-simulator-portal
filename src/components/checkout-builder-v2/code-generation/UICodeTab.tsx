
import React from 'react';
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import { toast } from "sonner";
import { StyleVariables } from '../types';

interface UICodeTabProps {
  styleVariables: StyleVariables;
}

const UICodeTab: React.FC<UICodeTabProps> = ({ styleVariables }) => {
  // Generate CSS variables from the style variables
  const generateUICode = (variables: StyleVariables) => {
    const cssVariables = Object.entries(variables)
      .filter(([_, value]) => value !== '')
      .map(([key, value]) => `  --${key.replace(/([A-Z])/g, '-$1').toLowerCase()}: ${value};`)
      .join('\n');
    
    return `:root {
${cssVariables}
}`;
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generateUICode(styleVariables));
    toast.success('UI code copied to clipboard!');
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
        <code>{generateUICode(styleVariables)}</code>
      </pre>
    </div>
  );
};

export default UICodeTab;
