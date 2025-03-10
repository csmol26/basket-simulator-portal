
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface PaymentSectionProps {
  showPrimerCheckout: boolean;
}

const PaymentSection: React.FC<PaymentSectionProps> = ({ showPrimerCheckout }) => {
  return (
    <Card className={showPrimerCheckout ? "" : "hidden"}>
      <CardHeader>
        <CardTitle className="text-xl font-medium">Payment Details</CardTitle>
      </CardHeader>
      <CardContent>
        <div 
          id="primer-payment-container" 
          className="min-h-[300px]" 
          aria-live="polite"
        >
          {/* Primer payment form will be initialized here */}
          <div className="py-4 text-center text-gray-500">
            Loading payment options...
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PaymentSection;
