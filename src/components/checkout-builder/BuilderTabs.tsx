
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ComponentList from "./ComponentList";
import StyleEditor from "./StyleEditor";
import LayoutBuilder from "./LayoutBuilder";
import { Row, StyleVariables } from "./types";

interface BuilderTabsProps {
  rows: Row[];
  onAddRow: () => void;
  onRemoveRow: (rowId: string) => void;
  styleVariables: StyleVariables;
  handleStyleChange: (variableName: string, value: string) => void;
  updateComponentConfig: (rowId: string, componentId: string, config: any) => void;
}

const BuilderTabs: React.FC<BuilderTabsProps> = ({
  rows,
  onAddRow,
  onRemoveRow,
  styleVariables,
  handleStyleChange,
  updateComponentConfig
}) => {
  return (
    <div className="lg:col-span-1">
      <Tabs defaultValue="components" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="components">Components</TabsTrigger>
          <TabsTrigger value="styles">Style Variables</TabsTrigger>
          <TabsTrigger value="preview">Preview</TabsTrigger>
        </TabsList>
        
        <TabsContent value="components" className="mt-4">
          <ComponentList onAddRow={onAddRow} />
        </TabsContent>
        
        <TabsContent value="styles" className="mt-4">
          <StyleEditor 
            styleVariables={styleVariables}
            onStyleChange={handleStyleChange}
          />
        </TabsContent>
        
        <TabsContent value="preview" className="mt-4">
          <div className="p-4 bg-gray-100 rounded-md">
            <h3 className="text-md font-medium mb-3">Theme Preview</h3>
            <p className="text-sm text-gray-600 mb-4">
              Visualize how your theme and components will appear in the checkout.
            </p>
            <div className="border rounded-md p-4 bg-white">
              <div className="flex justify-between items-center mb-3">
                <span className="text-sm font-medium">Card Form Preview</span>
                <span className="text-xs text-gray-500">Using your style variables</span>
              </div>
              <div className="h-24 bg-gray-50 border border-dashed border-gray-300 rounded flex items-center justify-center">
                <span className="text-gray-400 text-sm">Preview will be shown here</span>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BuilderTabs;
