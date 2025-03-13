
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import HtmlCodeTab from "./HtmlCodeTab";
import JsCodeTab from "./JsCodeTab";
import ReactCodeTab from "./ReactCodeTab";
import { 
  generateHtmlCode, 
  generateJsCode, 
  generateReactCode 
} from "../code-helpers/codeGenerationHelpers";

const CodeTabs: React.FC = () => {
  const [codeTab, setCodeTab] = useState<string>("html");

  return (
    <Tabs value={codeTab} onValueChange={setCodeTab}>
      <TabsList className="mb-4">
        <TabsTrigger value="html">HTML</TabsTrigger>
        <TabsTrigger value="js">JavaScript</TabsTrigger>
        <TabsTrigger value="react">React</TabsTrigger>
      </TabsList>
      
      <TabsContent value="html">
        <HtmlCodeTab generateHtmlCode={generateHtmlCode} />
        <p className="text-sm text-gray-500 mt-2">This is the HTML structure for implementing Primer's Composable Checkout.</p>
      </TabsContent>
      
      <TabsContent value="js">
        <JsCodeTab generateJsCode={generateJsCode} />
        <p className="text-sm text-gray-500 mt-2">JavaScript implementation for adding Primer's Composable Checkout to your website.</p>
      </TabsContent>
      
      <TabsContent value="react">
        <ReactCodeTab generateReactCode={generateReactCode} />
        <p className="text-sm text-gray-500 mt-2">React component implementation for adding Primer's Composable Checkout.</p>
      </TabsContent>
    </Tabs>
  );
};

export default CodeTabs;
