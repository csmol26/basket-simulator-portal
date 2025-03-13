
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CodeHeader from "./code-generation/CodeHeader";
import HtmlCodeTab from "./code-generation/HtmlCodeTab";
import TypeScriptCodeTab from "./code-generation/TypeScriptCodeTab";
import CssCodeTab from "./code-generation/CssCodeTab";
import ImplementationGuide from "./code-generation/ImplementationGuide";
import UICodeTab from "./code-generation/UICodeTab";
import UXCodeTab from "./code-generation/UXCodeTab";
import { Row, StyleVariables, CheckoutConfig } from "./types";

interface GeneratedCodeProps {
  cardFormRows: Row[];
  checkoutRows: Row[];
  styleVariables: StyleVariables;
  checkoutConfig: CheckoutConfig;
}

const GeneratedCode: React.FC<GeneratedCodeProps> = ({ 
  cardFormRows, 
  checkoutRows, 
  styleVariables,
  checkoutConfig
}) => {
  const [activeCodeTab, setActiveCodeTab] = useState("html");

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl flex items-center justify-between">
          <span>Generated Code</span>
          <Tabs value={activeCodeTab} onValueChange={setActiveCodeTab} className="w-auto">
            <TabsList>
              <TabsTrigger value="html">HTML</TabsTrigger>
              <TabsTrigger value="typescript">TypeScript</TabsTrigger>
              <TabsTrigger value="css">CSS</TabsTrigger>
              <TabsTrigger value="guide">Implementation Guide</TabsTrigger>
              <TabsTrigger value="code-generator">Code Generator</TabsTrigger>
            </TabsList>
          </Tabs>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <TabsContent value="html" className="m-0 mt-4">
          <CodeHeader language="html" />
          <HtmlCodeTab 
            cardFormRows={cardFormRows} 
            checkoutRows={checkoutRows}
            styleVariables={styleVariables} 
            checkoutConfig={checkoutConfig} 
          />
        </TabsContent>
        
        <TabsContent value="typescript" className="m-0 mt-4">
          <CodeHeader language="typescript" />
          <TypeScriptCodeTab 
            checkoutConfig={checkoutConfig}
            styleVariables={styleVariables}
          />
        </TabsContent>
        
        <TabsContent value="css" className="m-0 mt-4">
          <CodeHeader language="css" />
          <CssCodeTab styleVariables={styleVariables} />
        </TabsContent>
        
        <TabsContent value="guide" className="m-0 mt-4">
          <ImplementationGuide />
        </TabsContent>

        <TabsContent value="code-generator" className="m-0 mt-4">
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-2">UI Styles (CSS Variables)</h3>
              <UICodeTab styleVariables={styleVariables} />
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-2">UX Code (Primer Checkout Markup)</h3>
              <UXCodeTab 
                cardFormRows={cardFormRows}
                checkoutRows={checkoutRows}
                styleVariables={styleVariables}
                checkoutConfig={checkoutConfig}
              />
            </div>
          </div>
        </TabsContent>
      </CardContent>
    </Card>
  );
};

export default GeneratedCode;
