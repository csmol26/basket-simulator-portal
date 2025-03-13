
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
  styleVariables: StyleVariables;
  checkoutConfig: CheckoutConfig;
}

const GeneratedCode: React.FC<GeneratedCodeProps> = ({ rows, styleVariables, checkoutConfig }) => {
  const [codeTab, setCodeTab] = useState("html");

  const downloadCode = () => {
    try {
      const htmlBlob = new Blob([generateHTMLCode()], { type: 'text/html' });
      const cssBlob = new Blob([generateCSSCode()], { type: 'text/css' });
      const tsBlob = new Blob([generateTSCode()], { type: 'text/typescript' });
      
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

  // These functions are needed for the download functionality
  const generateHTMLCode = () => import('./code-generation/codeGenerationUtils')
    .then(module => module.generateHTMLCode(checkoutConfig));
  
  const generateCSSCode = () => import('./code-generation/codeGenerationUtils')
    .then(module => module.generateCSSCode(styleVariables));
  
  const generateTSCode = () => import('./code-generation/codeGenerationUtils')
    .then(module => module.generateTSCode(checkoutConfig));

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
