
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Clipboard } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { CheckoutConfig, CardFormLayout, PaymentMethodDisplay } from "./types";

interface CheckoutLayoutConfigProps {
  checkoutConfig: CheckoutConfig;
  onChangeCardFormLayout: (layout: CardFormLayout) => void;
  onChangePaymentMethodDisplay: (display: PaymentMethodDisplay) => void;
  onToggleCardholderName: (show: boolean) => void;
}

const CheckoutLayoutConfig: React.FC<CheckoutLayoutConfigProps> = ({
  checkoutConfig,
  onChangeCardFormLayout,
  onChangePaymentMethodDisplay,
  onToggleCardholderName
}) => {
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
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg">Checkout Configuration</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div>
            <h3 className="text-sm font-medium mb-3">Card Form Layout</h3>
            <div className="grid grid-cols-3 gap-2">
              <Button 
                variant={checkoutConfig.cardFormLayout === "single-line" ? "default" : "outline"}
                size="sm"
                onClick={() => onChangeCardFormLayout("single-line")}
                className="w-full"
              >
                Single Line
              </Button>
              <Button 
                variant={checkoutConfig.cardFormLayout === "two-line" ? "default" : "outline"}
                size="sm"
                onClick={() => onChangeCardFormLayout("two-line")}
                className="w-full"
              >
                Two Line
              </Button>
              <Button 
                variant={checkoutConfig.cardFormLayout === "three-line" ? "default" : "outline"}
                size="sm"
                onClick={() => onChangeCardFormLayout("three-line")}
                className="w-full"
              >
                Three Line
              </Button>
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-medium mb-3">Payment Methods Display</h3>
            <div className="grid grid-cols-2 gap-2">
              <Button 
                variant={checkoutConfig.paymentMethodsDisplay === "radio" ? "default" : "outline"}
                size="sm"
                onClick={() => onChangePaymentMethodDisplay("radio")}
                className="w-full"
              >
                Radio Buttons
              </Button>
              <Button 
                variant={checkoutConfig.paymentMethodsDisplay === "dropdown" ? "default" : "outline"}
                size="sm"
                onClick={() => onChangePaymentMethodDisplay("dropdown")}
                className="w-full"
              >
                Dropdown
              </Button>
              <Button 
                variant={checkoutConfig.paymentMethodsDisplay === "buttons" ? "default" : "outline"}
                size="sm"
                onClick={() => onChangePaymentMethodDisplay("buttons")}
                className="w-full"
              >
                Buttons
              </Button>
              <Button 
                variant={checkoutConfig.paymentMethodsDisplay === "tabs" ? "default" : "outline"}
                size="sm"
                onClick={() => onChangePaymentMethodDisplay("tabs")}
                className="w-full"
              >
                Tabs
              </Button>
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-medium mb-3">Card Options</h3>
            <div className="grid grid-cols-2 gap-2">
              <Button 
                variant={checkoutConfig.showCardholderName ? "default" : "outline"}
                size="sm"
                onClick={() => onToggleCardholderName(true)}
                className="w-full"
              >
                Show Cardholder Name
              </Button>
              <Button 
                variant={!checkoutConfig.showCardholderName ? "default" : "outline"}
                size="sm"
                onClick={() => onToggleCardholderName(false)}
                className="w-full"
              >
                Hide Cardholder Name
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CheckoutLayoutConfig;
