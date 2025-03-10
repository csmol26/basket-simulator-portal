
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Row, StyleVariables } from "./types";
import CodeDisplay from "./CodeDisplay";
import { generateUICode, generatePrimerCode } from "./utils/codeGenerationUtils";

interface CodeGeneratorProps {
  rows: Row[];
  styleVariables: StyleVariables;
}

const CodeGenerator: React.FC<CodeGeneratorProps> = ({ rows, styleVariables }) => {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-lg">Generated Code</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="uiCode" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="uiCode">UI Code</TabsTrigger>
            <TabsTrigger value="primerCode">Primer Code</TabsTrigger>
          </TabsList>
          
          <TabsContent value="uiCode">
            <CodeDisplay 
              code={generateUICode(styleVariables)}
              description="Copy this code to your PaymentSection.tsx file"
            />
          </TabsContent>
          
          <TabsContent value="primerCode">
            <CodeDisplay 
              code={generatePrimerCode(rows, styleVariables)}
              description="Copy this code to the initPrimer function in primer.ts"
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default CodeGenerator;
