
import React, { useState } from "react";
import { DragDropContext } from "react-beautiful-dnd";
import Navbar from "@/components/Navbar";
import LayoutBuilder from "@/components/checkout-builder/LayoutBuilder";
import CodeGenerator from "@/components/checkout-builder/CodeGenerator";
import Preview from "@/components/checkout-builder/Preview";
import BuilderTabs from "@/components/checkout-builder/BuilderTabs";
import { useCheckoutBuilder } from "@/hooks/useCheckoutBuilder";
import { StyleVariables } from "@/components/checkout-builder/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const CheckoutBuilder: React.FC = () => {
  const {
    rows,
    styleVariables,
    addRow,
    removeRow,
    handleStyleChange,
    updateComponentConfig,
    onDragEnd
  } = useCheckoutBuilder();

  // State for main tab view
  const [activeMainTab, setActiveMainTab] = useState<string>("builder");

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      <main className="flex-1 py-8">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout Builder</h1>
          
          <Tabs value={activeMainTab} onValueChange={setActiveMainTab} className="w-full mb-8">
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="builder">Card Form Builder</TabsTrigger>
              <TabsTrigger value="preview">Checkout Preview</TabsTrigger>
              <TabsTrigger value="code">Generated Code</TabsTrigger>
            </TabsList>
            
            <TabsContent value="builder" className="mt-0">
              <DragDropContext onDragEnd={onDragEnd}>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-2">
                    <LayoutBuilder 
                      rows={rows} 
                      onRemoveRow={removeRow} 
                      updateComponentConfig={updateComponentConfig}
                      styleVariables={styleVariables}
                    />
                  </div>
                  
                  <BuilderTabs 
                    rows={rows}
                    onAddRow={addRow}
                    onRemoveRow={removeRow}
                    styleVariables={styleVariables}
                    handleStyleChange={handleStyleChange}
                    updateComponentConfig={updateComponentConfig}
                  />
                </div>
              </DragDropContext>
            </TabsContent>
            
            <TabsContent value="preview" className="mt-0">
              <Preview rows={rows} styleVariables={styleVariables} />
            </TabsContent>
            
            <TabsContent value="code" className="mt-0">
              <CodeGenerator 
                rows={rows}
                styleVariables={styleVariables}
              />
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <footer className="bg-white border-t border-gray-100 py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500">
                © 2023 PrimerBasket. All rights reserved.
              </p>
            </div>
            <div className="text-sm text-gray-500">
              <p>Secured by Primer.io</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default CheckoutBuilder;
