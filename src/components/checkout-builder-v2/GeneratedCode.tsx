
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Boxes, Paintbrush, ChevronsRight } from "lucide-react";
import { toast } from "sonner";
import { Row, StyleVariables, CheckoutConfig } from './types';

import CodeHeader from './code-generation/CodeHeader';
import HtmlCodeTab from './code-generation/HtmlCodeTab';
import CssCodeTab from './code-generation/CssCodeTab';
import TypeScriptCodeTab from './code-generation/TypeScriptCodeTab';
import ImplementationGuide from './code-generation/ImplementationGuide';

interface GeneratedCodeProps {
  rows: Row[];
  checkoutRows: Row[];  // Add the checkoutRows property to fix the TypeScript error
  styleVariables: StyleVariables;
  checkoutConfig: CheckoutConfig;
}

const GeneratedCode: React.FC<GeneratedCodeProps> = ({ rows, checkoutRows, styleVariables, checkoutConfig }) => {
  const [codeTab, setCodeTab] = useState("html");

  const downloadCode = async () => {
    try {
      // Import dynamically and await the resolved values
      const codeGenerationUtils = await import('./code-generation/codeGenerationUtils');
      
      // Get the actual code strings by awaiting the promises
      const htmlCode = await codeGenerationUtils.generateHTMLCode(checkoutConfig);
      const cssCode = await codeGenerationUtils.generateCSSCode(styleVariables);
      const tsCode = await codeGenerationUtils.generateTSCode(checkoutConfig);
      
      // Now create blobs with the resolved string values
      const htmlBlob = new Blob([htmlCode], { type: 'text/html' });
      const cssBlob = new Blob([cssCode], { type: 'text/css' });
      const tsBlob = new Blob([tsCode], { type: 'text/typescript' });
      
      const htmlUrl = URL.createObjectURL(htmlBlob);
      const cssUrl = URL.createObjectURL(cssBlob);
      const tsUrl = URL.createObjectURL(tsBlob);
      
      // Helper function to trigger download
      const download = (url: string, filename: string) => {
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      };
      
      download(htmlUrl, 'index.html');
      setTimeout(() => download(cssUrl, 'styles.css'), 100);
      setTimeout(() => download(tsUrl, 'main.ts'), 200);
      
      toast.success('Files downloaded successfully!');
    } catch (error) {
      toast.error('Failed to download code files');
      console.error(error);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CodeHeader downloadCode={downloadCode} />
        <div className="p-6 pt-2">
          <Tabs value={codeTab} onValueChange={setCodeTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="html" className="flex items-center gap-2">
                <Boxes size={16} />
                HTML
              </TabsTrigger>
              <TabsTrigger value="css" className="flex items-center gap-2">
                <Paintbrush size={16} />
                CSS
              </TabsTrigger>
              <TabsTrigger value="ts" className="flex items-center gap-2">
                <ChevronsRight size={16} />
                TypeScript
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="html">
              <HtmlCodeTab 
                rows={rows}
                checkoutRows={checkoutRows}  // Pass the checkoutRows prop to HtmlCodeTab
                styleVariables={styleVariables}
                checkoutConfig={checkoutConfig}
              />
            </TabsContent>
            
            <TabsContent value="css">
              <CssCodeTab styleVariables={styleVariables} />
            </TabsContent>
            
            <TabsContent value="ts">
              <TypeScriptCodeTab checkoutConfig={checkoutConfig} />
            </TabsContent>
          </Tabs>
        </div>
      </Card>
      
      <ImplementationGuide />
    </div>
  );
};

export default GeneratedCode;
