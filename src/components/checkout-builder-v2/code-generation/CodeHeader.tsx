
import React from 'react';
import { Button } from "@/components/ui/button";
import { FileDown } from "lucide-react";
import { CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

interface CodeHeaderProps {
  downloadCode: () => Promise<void> | void;
}

const CodeHeader: React.FC<CodeHeaderProps> = ({ downloadCode }) => {
  return (
    <CardHeader className="flex flex-row items-center justify-between pb-2">
      <CardTitle className="text-lg">Generated Code</CardTitle>
      <div className="flex gap-2">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={downloadCode}
          className="flex items-center gap-2"
        >
          <FileDown size={16} />
          Download All Files
        </Button>
      </div>
    </CardHeader>
  );
};

export default CodeHeader;
