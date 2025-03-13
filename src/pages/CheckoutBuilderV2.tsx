
import React, { useState } from "react";
import { DragDropContext } from "react-beautiful-dnd";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Copy, Code, Paintbrush, LayoutGrid, CreditCard, Eye } from "lucide-react";
import { toast } from "sonner";

import Navbar from "@/components/Navbar";
import { useCheckoutBuilderV2 } from "@/hooks/useCheckoutBuilderV2";
import CardFormBuilder from "@/components/checkout-builder-v2/CardFormBuilder";
import StyleVarsEditor from "@/components/checkout-builder-v2/StyleVarsEditor";
import CheckoutBuilder from "@/components/checkout-builder-v2/CheckoutBuilder";
import GeneratedCode from "@/components/checkout-builder-v2/GeneratedCode";
import ComponentPalette from "@/components/checkout-builder-v2/ComponentPalette";
import CheckoutLayoutConfig from "@/components/checkout-builder-v2/CheckoutLayoutConfig";

const CheckoutBuilderV2: React.FC = () => {
  const {
    rows,
    checkoutRows,
    styleVariables,
    checkoutConfig,
    activeTheme,
    addRow,
    addCheckoutRow,
    removeRow,
    removeCheckoutRow,
    handleStyleChange,
    updateComponentConfig,
    updateCheckoutComponentConfig,
    updateCheckoutConfig,
    changeCardFormLayout,
    changePaymentMethodDisplay,
    toggleCardholderName,
    changeTheme,
    onDragEnd
  } = useCheckoutBuilderV2();

  // State for main tab view
  const [activeMainTab, setActiveMainTab] = useState<string>("checkout-builder");

  // Export functionality
  const handleExportCode = () => {
    try {
      // In a real implementation, this would generate and download files
      const blob = new Blob([JSON.stringify({
        rows,
        checkoutRows,
        styleVariables,
        checkoutConfig
      }, null, 2)], { type: 'application/json' });
      
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'checkout-config.json';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast.success("Checkout configuration exported successfully!");
    } catch (error) {
      toast.error("Failed to export configuration");
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      <main className="flex-1 py-8">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Checkout Builder V2</h1>
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleExportCode}
                className="flex items-center gap-2"
              >
                <Download size={16} />
                Export Code
              </Button>
              <div className="text-sm text-gray-500 ml-4">Powered by Primer.io</div>
            </div>
          </div>
          
          <Tabs value={activeMainTab} onValueChange={setActiveMainTab} className="w-full mb-8">
            <TabsList className="grid w-full grid-cols-4 mb-8">
              <TabsTrigger value="checkout-builder" className="flex items-center gap-2">
                <LayoutGrid size={16} />
                Checkout Builder
              </TabsTrigger>
              <TabsTrigger value="card-form" className="flex items-center gap-2">
                <CreditCard size={16} />
                Card Form
              </TabsTrigger>
              <TabsTrigger value="styles" className="flex items-center gap-2">
                <Paintbrush size={16} />
                UI Styles
              </TabsTrigger>
              <TabsTrigger value="code" className="flex items-center gap-2">
                <Code size={16} />
                Code
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="checkout-builder" className="mt-0">
              <DragDropContext onDragEnd={onDragEnd}>
                <CheckoutBuilder 
                  rows={checkoutRows}
                  styleVariables={styleVariables}
                  checkoutConfig={checkoutConfig}
                  onAddRow={addCheckoutRow}
                  onRemoveRow={removeCheckoutRow}
                  updateComponentConfig={updateCheckoutComponentConfig}
                  onDragEnd={onDragEnd}
                />
              </DragDropContext>
            </TabsContent>
            
            <TabsContent value="card-form" className="mt-0">
              <DragDropContext onDragEnd={onDragEnd}>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-2">
                    <CardFormBuilder 
                      rows={rows} 
                      onRemoveRow={removeRow} 
                      updateComponentConfig={updateComponentConfig}
                      styleVariables={styleVariables}
                      cardFormLayout={checkoutConfig.cardFormLayout}
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
                    activeTheme={activeTheme}
                    onChangeTheme={changeTheme}
                  />
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="code" className="mt-0">
              <GeneratedCode 
                rows={rows}
                checkoutRows={checkoutRows}
                styleVariables={styleVariables}
                checkoutConfig={checkoutConfig}
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
