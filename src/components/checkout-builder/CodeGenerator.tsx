
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Row, StyleVariables } from "./types";
import CodeDisplay from "./CodeDisplay";
import { generateUICode, generatePrimerCode, generateThemeStyles } from "./utils/codeGenerationUtils";

interface CodeGeneratorProps {
  rows: Row[];
  styleVariables: StyleVariables;
}

const CodeGenerator: React.FC<CodeGeneratorProps> = ({ rows, styleVariables }) => {
  // Generate codes dynamically based on current rows and style variables
  const uiCode = generateUICode(styleVariables);
  const primerCode = generatePrimerCode(rows, styleVariables);
  const themeCode = generateThemeStyles(styleVariables);

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-lg">Generated Code</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="uiCode" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="uiCode">UI Code</TabsTrigger>
            <TabsTrigger value="primerCode">Primer Code</TabsTrigger>
            <TabsTrigger value="themeCode">Theme Code</TabsTrigger>
          </TabsList>
          
          <TabsContent value="uiCode">
            <CodeDisplay 
              code={uiCode}
              description="Copy this React JSX code to your PaymentSection.tsx file"
              language="jsx"
            />
          </TabsContent>
          
          <TabsContent value="primerCode">
            <CodeDisplay 
              code={primerCode}
              description="Copy this HTML code to the initPrimer function in primer.ts"
              language="html"
            />
          </TabsContent>
          
          <TabsContent value="themeCode">
            <CodeDisplay 
              code={themeCode}
              description="Copy these CSS variables to your styles.css file"
              language="css"
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default CodeGenerator;
