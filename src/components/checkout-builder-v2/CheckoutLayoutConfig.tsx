
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ComponentPalette from "./ComponentPalette";
import DevicePreview from "./previews/DevicePreview";
import { useCheckoutBuilderV2 } from "@/hooks/useCheckoutBuilderV2";
import { Clipboard } from "lucide-react";
import CardFormBuilder from "./CardFormBuilder";
import ThemeAndPreview from "./ThemeAndPreview";
import ComposableCheckoutSlots from "./ComposableCheckoutSlots";
import { toast } from "@/hooks/use-toast";

const CheckoutLayoutConfig: React.FC = () => {
  const { 
    rows, 
    checkoutRows,
    styleVariables, 
    checkoutConfig,
    onDragEnd,
    addRow,
    removeRow,
    updateComponentConfig,
    activeTheme,
    handleStyleChange,
    changeTheme
  } = useCheckoutBuilderV2();

  // State for active tab and device preview
  const [activeTab, setActiveTab] = useState<string>("checkout-builder");
  const [devicePreview, setDevicePreview] = useState<"desktop" | "mobile">("desktop");

  // State for copied code indicator
  const [copied, setCopied] = useState(false);

  const generatePaymentMethodsHtml = () => {
    let html = `<primer-checkout client-token="\${clientSession.clientToken}">
  <primer-main slot="main">
    <!-- Payment methods -->
    <div slot="payments">
      <!-- Card payment method -->
      <p class="text-base font-medium text-gray-700 mb-4">Card</p>
      <primer-payment-method type="PAYMENT_CARD"></primer-payment-method>
      
      <!-- Alternative Payment Methods -->
      <div class="mt-8 pt-6 border-t border-gray-200">
        <p class="text-base font-medium text-gray-700 mb-4">Alternative Payment Methods</p>
        <primer-payment-method type="PAYPAL"></primer-payment-method>
        <primer-payment-method type="GOOGLE_PAY"></primer-payment-method>
        <primer-payment-method type="APPLE_PAY"></primer-payment-method>
      </div>
    </div>
    
    <!-- Custom completion screen -->
    <div slot="checkout-complete">
      <h2 class="text-xl font-bold text-green-600 text-center my-4">Thank you for your purchase!</h2>
      <p class="text-center text-gray-600">Your order has been processed successfully.</p>
    </div>
  </primer-main>
</primer-checkout>`;

    return html;
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatePaymentMethodsHtml());
    setCopied(true);
    toast({
      title: "Copied to clipboard",
      description: "The HTML code has been copied to your clipboard",
    });
    
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  return (
    <div className="w-full p-4">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="checkout-builder">Checkout Builder</TabsTrigger>
          <TabsTrigger value="card-form-builder">Card Form Builder</TabsTrigger>
          <TabsTrigger value="theme-and-preview">Theme and Preview</TabsTrigger>
          <TabsTrigger value="composable-checkout-slots">Composable Checkout Slots</TabsTrigger>
        </TabsList>
        
        <TabsContent value="checkout-builder" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Create Checkout Layout</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <ComponentPalette />
              </div>
            </CardContent>
          </Card>
          
          <Card className="mt-4">
            <CardHeader>
              <CardTitle>Generated HTML</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-50 p-4 rounded-md relative border">
                <Button 
                  className="absolute right-2 top-2 h-8 w-8 p-0" 
                  variant="outline" 
                  onClick={copyToClipboard}
                >
                  <Clipboard className="h-4 w-4" />
                </Button>
                <pre className="text-xs overflow-x-auto p-2 text-gray-800">
                  {generatePaymentMethodsHtml()}
                </pre>
              </div>
              <p className="text-sm text-gray-500 mt-2">This is the HTML code for the payment methods configuration. The card form is defined in the Card Form Builder tab.</p>
            </CardContent>
          </Card>
          
          <DevicePreview 
            rows={rows} 
            cardFormRows={rows} 
            styleVariables={styleVariables} 
            checkoutConfig={checkoutConfig}
            devicePreview={devicePreview}
            setDevicePreview={setDevicePreview}
          />
        </TabsContent>
        
        <TabsContent value="card-form-builder">
          <CardFormBuilder 
            rows={rows}
            styleVariables={styleVariables}
            cardFormLayout={checkoutConfig.cardFormLayout}
            onRemoveRow={removeRow}
            updateComponentConfig={updateComponentConfig}
            onChangeLayout={() => {}}
            addRow={addRow}
          />
        </TabsContent>
        
        <TabsContent value="theme-and-preview">
          <ThemeAndPreview 
            rows={checkoutRows}
            cardFormRows={rows}
            styleVariables={styleVariables}
            checkoutConfig={checkoutConfig}
            activeTheme={activeTheme}
            onStyleChange={handleStyleChange}
            onChangeTheme={changeTheme}
          />
        </TabsContent>
        
        <TabsContent value="composable-checkout-slots">
          <ComposableCheckoutSlots 
            rows={checkoutRows} 
            cardFormRows={rows}
            styleVariables={styleVariables} 
            checkoutConfig={checkoutConfig}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CheckoutLayoutConfig;
