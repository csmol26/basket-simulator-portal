
import React from "react";
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import { toast } from "sonner";

interface CodeDisplayProps {
  code: string;
  description: string;
  language?: "html" | "jsx" | "css" | "js" | "ts";
}

const CodeDisplay: React.FC<CodeDisplayProps> = ({ code, description, language = "html" }) => {
  const copyToClipboard = () => {
    navigator.clipboard.writeText(code);
    toast.success("Code copied to clipboard!");
  };

  // Manually escape HTML tags for proper display
  const escapedCode = code.replace(/</g, '&lt;').replace(/>/g, '&gt;');

  return (
    <div className="mt-4">
      <div className="relative">
        <pre className={`p-4 bg-gray-900 rounded-md text-sm overflow-x-auto text-gray-100 whitespace-pre-wrap language-${language}`}>
          <code dangerouslySetInnerHTML={{ __html: escapedCode }} />
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
