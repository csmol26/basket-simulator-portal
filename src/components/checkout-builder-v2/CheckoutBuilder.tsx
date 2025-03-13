
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { DragDropContext } from "react-beautiful-dnd";
import ComponentPalette from "./ComponentPalette";
import CardFormBuilder from "./CardFormBuilder";
import CheckoutPreview from "./CheckoutPreview";
import GeneratedCode from "./GeneratedCode";
import CheckoutLayoutConfig from "./CheckoutLayoutConfig";
import ThemeAndPreview from "./ThemeAndPreview";
import { useCheckoutBuilderV2 } from "@/hooks/useCheckoutBuilderV2";

const CheckoutBuilder: React.FC = () => {
  const [activeTab, setActiveTab] = useState("checkout-builder");
  
  const {
    rows: cardFormRows,
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

  return (
    <div className="container mx-auto px-4 py-6 max-w-screen-2xl">
      <DragDropContext onDragEnd={onDragEnd}>
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-2xl">Checkout Builder</CardTitle>
            <CardDescription>
              Design your perfect checkout experience with drag-and-drop components
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-4 mb-8">
                <TabsTrigger value="checkout-builder">Checkout Builder</TabsTrigger>
                <TabsTrigger value="card-form-builder">Card Form Builder</TabsTrigger>
                <TabsTrigger value="theme-preview">Theme & Preview</TabsTrigger>
                <TabsTrigger value="code-generator">Code Generator</TabsTrigger>
              </TabsList>
              
              <TabsContent value="checkout-builder" className="p-0">
                <div className="grid grid-cols-1 xl:grid-cols-[1fr_3fr] gap-6">
                  <div className="w-full space-y-6">
                    <ComponentPalette onAddRow={addCheckoutRow} />
                    <CheckoutLayoutConfig 
                      config={checkoutConfig}
                      onChangeCardFormLayout={changeCardFormLayout}
                      onChangePaymentMethodDisplay={changePaymentMethodDisplay}
                      onToggleCardholderName={toggleCardholderName}
                    />
                  </div>
                  
                  <div className="space-y-6">
                    <CheckoutPreview 
                      rows={checkoutRows} 
                      styleVariables={styleVariables}
                      checkoutConfig={checkoutConfig}
                      onDragEnd={onDragEnd}
                    />
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="card-form-builder" className="p-0">
                <CardFormBuilder 
                  rows={cardFormRows}
                  styleVariables={styleVariables}
                  addRow={addRow}
                  onRemoveRow={removeRow}
                  updateComponentConfig={updateComponentConfig}
                  onChangeLayout={changeCardFormLayout}
                  cardFormLayout={checkoutConfig.cardFormLayout}
                />
              </TabsContent>
              
              <TabsContent value="theme-preview" className="p-0">
                <ThemeAndPreview 
                  rows={checkoutRows}
                  cardFormRows={cardFormRows}
                  styleVariables={styleVariables}
                  checkoutConfig={checkoutConfig}
                  activeTheme={activeTheme}
                  onStyleChange={handleStyleChange}
                  onChangeTheme={changeTheme}
                />
              </TabsContent>
              
              <TabsContent value="code-generator" className="p-0">
                <div className="space-y-6">
                  <GeneratedCode 
                    cardFormRows={cardFormRows}
                    checkoutRows={checkoutRows}
                    styleVariables={styleVariables}
                    checkoutConfig={checkoutConfig}
                  />
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
        
        <GeneratedCode 
          cardFormRows={cardFormRows}
          checkoutRows={checkoutRows}
          styleVariables={styleVariables}
          checkoutConfig={checkoutConfig}
        />
      </DragDropContext>
    </div>
  );
};

export default CheckoutBuilder;
