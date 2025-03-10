
import React from "react";
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import { toast } from "sonner";

interface CodeDisplayProps {
  code: string;
  description: string;
}

const CodeDisplay: React.FC<CodeDisplayProps> = ({ code, description }) => {
  const copyToClipboard = () => {
    navigator.clipboard.writeText(code);
    toast.success("Code copied to clipboard!");
  };

  return (
    <div className="mt-4">
      <div className="relative">
        <pre className="p-4 bg-gray-900 rounded-md text-sm overflow-x-auto text-gray-100">
          <code>{code}</code>
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
