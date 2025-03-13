
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ClipboardCopy } from "lucide-react";
import { toast } from "sonner";
import { Row, CheckoutConfig } from "./types";

interface CodePreviewPanelProps {
  checkoutRows: Row[];
  cardFormRows: Row[];
  checkoutConfig: CheckoutConfig;
  generateCode: () => string;
}

const CodePreviewPanel: React.FC<CodePreviewPanelProps> = ({ 
  generateCode 
}) => {
  const handleCopyCode = () => {
    const code = generateCode();
    navigator.clipboard.writeText(code);
    toast({
      title: "Code copied",
      description: "HTML code has been copied to clipboard"
    });
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-md font-medium">
          Generated HTML
        </CardTitle>
        <Button 
          variant="outline" 
          size="sm"
          className="h-8 gap-1"
          onClick={handleCopyCode}
        >
          <ClipboardCopy className="h-3.5 w-3.5" />
          <span>Copy</span>
        </Button>
      </CardHeader>
      <CardContent>
        <div className="relative">
          <pre className="language-html rounded-md bg-slate-950 p-4 text-white text-sm overflow-x-auto">
            <code dangerouslySetInnerHTML={{ __html: generateCode().replace(/</g, '&lt;').replace(/>/g, '&gt;') }}></code>
          </pre>
        </div>
      </CardContent>
    </Card>
  );
};

export default CodePreviewPanel;
