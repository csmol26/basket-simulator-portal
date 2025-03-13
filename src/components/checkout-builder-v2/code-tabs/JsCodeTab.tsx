
import React from "react";
import { Button } from "@/components/ui/button";
import { Clipboard } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface JsCodeTabProps {
  generateJsCode: () => string;
}

const JsCodeTab: React.FC<JsCodeTabProps> = ({ generateJsCode }) => {
  const [copied, setCopied] = React.useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generateJsCode());
    setCopied(true);
    
    toast({
      title: "Copied to clipboard",
      description: "JavaScript code has been copied to your clipboard",
    });
    
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  return (
    <div className="bg-gray-50 p-4 rounded-md relative border">
      <Button 
        className="absolute right-2 top-2 h-8 w-8 p-0" 
        variant="outline" 
        onClick={copyToClipboard}
      >
        <Clipboard className="h-4 w-4" />
      </Button>
      <pre className="text-xs overflow-x-auto p-2 text-gray-800">
        {generateJsCode()}
      </pre>
    </div>
  );
};

export default JsCodeTab;
