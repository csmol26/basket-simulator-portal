
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { CardFormLayout, PaymentMethodDisplay } from "./types";

interface CheckoutLayoutConfigPanelProps {
  checkoutConfig: any;
  onChangeCardFormLayout: (layout: CardFormLayout) => void;
  onChangePaymentMethodDisplay: (display: PaymentMethodDisplay) => void;
  onToggleCardholderName: (show: boolean) => void;
}

const CheckoutLayoutConfigPanel: React.FC<CheckoutLayoutConfigPanelProps> = ({
  checkoutConfig,
  onChangeCardFormLayout,
  onChangePaymentMethodDisplay,
  onToggleCardholderName
}) => {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg">Checkout Configuration</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 gap-4">
          <div className="space-y-2">
            <Label htmlFor="checkout-layout">Checkout Layout</Label>
            <Select 
              value={checkoutConfig.layout}
              onValueChange={(value) => onChangeCardFormLayout(value as CardFormLayout)}
            >
              <SelectTrigger id="checkout-layout">
                <SelectValue placeholder="Select layout" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="single-page">Single Page</SelectItem>
                <SelectItem value="multi-step">Multi-step</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="payment-method-display">Payment Method Display</Label>
            <Select 
              value={checkoutConfig.paymentMethodsDisplay}
              onValueChange={(value) => onChangePaymentMethodDisplay(value as PaymentMethodDisplay)}
            >
              <SelectTrigger id="payment-method-display">
                <SelectValue placeholder="Select display type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="dropdown">Dropdown</SelectItem>
                <SelectItem value="radio">Radio Buttons</SelectItem>
                <SelectItem value="tabs">Tabs</SelectItem>
                <SelectItem value="buttons">Buttons</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="cardholder-name" className="cursor-pointer">Show Cardholder Name</Label>
            <Switch 
              id="cardholder-name" 
              checked={checkoutConfig.showCardholderName}
              onCheckedChange={onToggleCardholderName}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CheckoutLayoutConfigPanel;
