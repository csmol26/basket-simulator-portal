
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { CheckoutConfig, CardFormLayout, PaymentMethodDisplay } from "../checkout-builder-v2/types";

interface CheckoutLayoutConfigProps {
  config: CheckoutConfig;
  onChangeCardFormLayout: (layout: CardFormLayout) => void;
  onChangePaymentMethodDisplay: (display: PaymentMethodDisplay) => void;
  onToggleCardholderName: (show: boolean) => void;
}

const CheckoutLayoutConfig: React.FC<CheckoutLayoutConfigProps> = ({
  config,
  onChangeCardFormLayout,
  onChangePaymentMethodDisplay,
  onToggleCardholderName
}) => {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-lg font-semibold mb-4">Checkout Layout Configuration</h2>
        <p className="text-sm text-gray-500 mb-6">
          Configure how your checkout will appear to customers. These settings control the layout and display of payment methods and form fields.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card>
          <CardContent className="pt-6">
            <h3 className="text-md font-medium mb-4">Card Form Layout</h3>
            <div className="space-y-4">
              <RadioGroup 
                value={config.cardFormLayout} 
                onValueChange={(value) => onChangeCardFormLayout(value as CardFormLayout)}
                className="space-y-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="single-line" id="single-line" />
                  <Label htmlFor="single-line">Single-line (compact)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="two-line" id="two-line" />
                  <Label htmlFor="two-line">Two-line (standard)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="three-line" id="three-line" />
                  <Label htmlFor="three-line">Three-line (expanded)</Label>
                </div>
              </RadioGroup>
              
              <div className="mt-6 border-t pt-4">
                <div className="flex items-center justify-between py-2">
                  <Label htmlFor="show-cardholder-name">Show Cardholder Name Field</Label>
                  <Switch 
                    id="show-cardholder-name" 
                    checked={config.showCardholderName}
                    onCheckedChange={onToggleCardholderName}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <h3 className="text-md font-medium mb-4">Payment Methods Display</h3>
            <RadioGroup 
              value={config.paymentMethodsDisplay} 
              onValueChange={(value) => onChangePaymentMethodDisplay(value as PaymentMethodDisplay)}
              className="space-y-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="dropdown" id="dropdown" />
                <Label htmlFor="dropdown">Dropdown Menu</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="radio" id="radio" />
                <Label htmlFor="radio">Radio Buttons (list)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="buttons" id="buttons" />
                <Label htmlFor="buttons">Separate Buttons</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="tabs" id="tabs" />
                <Label htmlFor="tabs">Tabbed Interface</Label>
              </div>
            </RadioGroup>

            <div className="mt-6 border-t pt-4">
              <div className="flex items-center justify-between py-2">
                <Label htmlFor="single-page">Single Page Checkout</Label>
                <Switch 
                  id="single-page" 
                  checked={config.layout === "single-page"}
                  onCheckedChange={(checked) => 
                    checked ? onChangePaymentMethodDisplay("radio") : onChangePaymentMethodDisplay("tabs")
                  }
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="pt-6">
          <h3 className="text-md font-medium mb-2">Layout Preview</h3>
          <p className="text-sm text-gray-500 mb-4">
            This visual representation shows how your configured checkout will appear:
          </p>
          
          <div className="border rounded-md p-4 bg-gray-50">
            <div className="text-center p-4 text-gray-400">
              {config.cardFormLayout === "single-line" && (
                <div className="mb-2">Single-line card form layout</div>
              )}
              {config.cardFormLayout === "two-line" && (
                <div className="mb-2">Two-line card form layout</div>
              )}
              {config.cardFormLayout === "three-line" && (
                <div className="mb-2">Three-line card form layout</div>
              )}
              
              {config.paymentMethodsDisplay === "dropdown" && (
                <div>Payment methods in dropdown menu</div>
              )}
              {config.paymentMethodsDisplay === "radio" && (
                <div>Payment methods as radio buttons</div>
              )}
              {config.paymentMethodsDisplay === "buttons" && (
                <div>Payment methods as separate buttons</div>
              )}
              {config.paymentMethodsDisplay === "tabs" && (
                <div>Payment methods in tabs</div>
              )}
              
              {config.showCardholderName ? (
                <div className="mt-2">With cardholder name field</div>
              ) : (
                <div className="mt-2">Without cardholder name field</div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CheckoutLayoutConfig;
