
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
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="components">Components</TabsTrigger>
          <TabsTrigger value="styles">Style Variables</TabsTrigger>
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
      </Tabs>
    </div>
  );
};

export default BuilderTabs;
