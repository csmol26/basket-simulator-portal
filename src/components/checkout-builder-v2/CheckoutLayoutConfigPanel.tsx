
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
          <p className="text-sm text-gray-500">Configure your checkout layout and payment options</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default CheckoutLayoutConfigPanel;
