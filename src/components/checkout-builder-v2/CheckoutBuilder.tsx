
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { DragDropContext } from "react-beautiful-dnd";
import CardFormBuilder from "./CardFormBuilder";
import ThemeAndPreview from "./ThemeAndPreview";
import ComposableCheckoutSlots from "./ComposableCheckoutSlots";
import GeneratedCode from "./GeneratedCode";
import { useCheckoutBuilderV2 } from "@/hooks/useCheckoutBuilderV2";
import CheckoutBuilderPanel from "./CheckoutBuilderPanel";

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
                <TabsTrigger value="composable-slots">Composable Checkout Slots</TabsTrigger>
              </TabsList>
              
              <TabsContent value="checkout-builder" className="p-0">
                <CheckoutBuilderPanel 
                  checkoutRows={checkoutRows}
                  styleVariables={styleVariables}
                  checkoutConfig={checkoutConfig}
                  addCheckoutRow={addCheckoutRow}
                  removeCheckoutRow={removeCheckoutRow}
                  updateCheckoutComponentConfig={updateCheckoutComponentConfig}
                  changeCardFormLayout={changeCardFormLayout}
                  changePaymentMethodDisplay={changePaymentMethodDisplay}
                  toggleCardholderName={toggleCardholderName}
                  onDragEnd={onDragEnd}
                  cardFormRows={cardFormRows}
                />
              </TabsContent>
              
              <TabsContent value="card-form-builder" className="p-0">
                <CardFormBuilder 
                  rows={cardFormRows}
                  styleVariables={styleVariables}
                  cardFormLayout={checkoutConfig.cardFormLayout}
                  onRemoveRow={removeRow}
                  updateComponentConfig={updateComponentConfig}
                  onChangeLayout={changeCardFormLayout}
                  addRow={addRow}
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
              
              <TabsContent value="composable-slots" className="p-0">
                <ComposableCheckoutSlots 
                  rows={checkoutRows}
                  cardFormRows={cardFormRows}
                  styleVariables={styleVariables}
                  checkoutConfig={checkoutConfig}
                />
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
