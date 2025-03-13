
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CodeHeader from "./code-generation/CodeHeader";
import HtmlCodeTab from "./code-generation/HtmlCodeTab";
import TypeScriptCodeTab from "./code-generation/TypeScriptCodeTab";
import CssCodeTab from "./code-generation/CssCodeTab";
import ImplementationGuide from "./code-generation/ImplementationGuide";
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
            </TabsList>
          </Tabs>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <TabsContent value="html" className="m-0 mt-4" forceMount={activeCodeTab === "html"}>
          <CodeHeader language="html" />
          <HtmlCodeTab 
            cardFormRows={cardFormRows} 
            checkoutRows={checkoutRows}
            styleVariables={styleVariables} 
            checkoutConfig={checkoutConfig} 
          />
        </TabsContent>
        
        <TabsContent value="typescript" className="m-0 mt-4" forceMount={activeCodeTab === "typescript"}>
          <CodeHeader language="typescript" />
          <TypeScriptCodeTab styleVariables={styleVariables} />
        </TabsContent>
        
        <TabsContent value="css" className="m-0 mt-4" forceMount={activeCodeTab === "css"}>
          <CodeHeader language="css" />
          <CssCodeTab styleVariables={styleVariables} />
        </TabsContent>
        
        <TabsContent value="guide" className="m-0 mt-4" forceMount={activeCodeTab === "guide"}>
          <ImplementationGuide />
        </TabsContent>
      </CardContent>
    </Card>
  );
};

export default GeneratedCode;
