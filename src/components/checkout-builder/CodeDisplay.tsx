
import React from "react";
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import { toast } from "sonner";
import { applyHighlighting } from "./utils/codeGenerationUtils";

interface CodeDisplayProps {
  code: string;
  description: string;
}

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

const CodeDisplay: React.FC<CodeDisplayProps> = ({ code, description }) => {
  const copyToClipboard = () => {
    navigator.clipboard.writeText(code);
    toast.success("Code copied to clipboard!");
  };

  return (
    <div className="mt-4">
      <style>{syntaxHighlightingStyles}</style>
      <div className="relative">
        <pre className="p-4 bg-gray-900 rounded-md text-sm overflow-x-auto">
          <code className="code-highlight" dangerouslySetInnerHTML={{ __html: applyHighlighting(code) }} />
        </pre>
        <Button 
          size="sm" 
          variant="secondary" 
          className="absolute top-2 right-2"
          onClick={copyToClipboard}
        >
          <Copy size={16} />
        </Button>
      </div>
      <p className="text-xs text-gray-500 mt-2">{description}</p>
    </div>
  );
};

export default CodeDisplay;
