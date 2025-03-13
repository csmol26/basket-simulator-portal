
import React, { useState } from "react";
import { DragDropContext } from "react-beautiful-dnd";
import Navbar from "@/components/Navbar";
import { useCheckoutBuilderV2 } from "@/hooks/useCheckoutBuilderV2";
import CardFormBuilder from "@/components/checkout-builder-v2/CardFormBuilder";
import StyleVarsEditor from "@/components/checkout-builder-v2/StyleVarsEditor";
import CheckoutPreview from "@/components/checkout-builder-v2/CheckoutPreview";
import GeneratedCode from "@/components/checkout-builder-v2/GeneratedCode";
import ComponentPalette from "@/components/checkout-builder-v2/ComponentPalette";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";

const CheckoutBuilderV2: React.FC = () => {
  const {
    rows,
    styleVariables,
    addRow,
    removeRow,
    handleStyleChange,
    updateComponentConfig,
    onDragEnd
  } = useCheckoutBuilderV2();

  // State for main tab view
  const [activeMainTab, setActiveMainTab] = useState<string>("builder");

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      <main className="flex-1 py-8">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Checkout Builder V2</h1>
            <div className="text-sm text-gray-500">Powered by Primer.io</div>
          </div>
          
          <Tabs value={activeMainTab} onValueChange={setActiveMainTab} className="w-full mb-8">
            <TabsList className="grid w-full grid-cols-4 mb-8">
              <TabsTrigger value="builder">Card Form Builder</TabsTrigger>
              <TabsTrigger value="styles">UI Styles</TabsTrigger>
              <TabsTrigger value="preview">Checkout Preview</TabsTrigger>
              <TabsTrigger value="code">Generated Code</TabsTrigger>
            </TabsList>
            
            <TabsContent value="builder" className="mt-0">
              <DragDropContext onDragEnd={onDragEnd}>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-2">
                    <CardFormBuilder 
                      rows={rows} 
                      onRemoveRow={removeRow} 
                      updateComponentConfig={updateComponentConfig}
                      styleVariables={styleVariables}
                    />
                  </div>
                  
                  <div className="lg:col-span-1">
                    <ComponentPalette 
                      onAddRow={addRow}
                    />
                  </div>
                </div>
              </DragDropContext>
            </TabsContent>
            
            <TabsContent value="styles" className="mt-0">
              <Card>
                <CardContent className="pt-6">
                  <StyleVarsEditor 
                    styleVariables={styleVariables}
                    handleStyleChange={handleStyleChange}
                  />
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="preview" className="mt-0">
              <CheckoutPreview
                rows={rows}
                styleVariables={styleVariables}
              />
            </TabsContent>
            
            <TabsContent value="code" className="mt-0">
              <GeneratedCode 
                rows={rows}
                styleVariables={styleVariables}
              />
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <footer className="bg-white border-t border-gray-100 py-6 mt-6">
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

export default CheckoutBuilderV2;
