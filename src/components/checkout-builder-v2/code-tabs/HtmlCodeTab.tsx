
import React from "react";
import { Button } from "@/components/ui/button";
import { Clipboard } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface HtmlCodeTabProps {
  generateHtmlCode: () => string;
}

const HtmlCodeTab: React.FC<HtmlCodeTabProps> = ({ generateHtmlCode }) => {
  const [copied, setCopied] = React.useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generateHtmlCode());
    setCopied(true);
    
    toast({
      title: "Copied to clipboard",
      description: "HTML code has been copied to your clipboard",
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
        {generateHtmlCode()}
      </pre>
    </div>
  );
};

export default HtmlCodeTab;
