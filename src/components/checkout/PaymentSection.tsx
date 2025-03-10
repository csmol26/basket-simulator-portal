
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface PaymentSectionProps {
  showPrimerCheckout: boolean;
}

const PaymentSection: React.FC<PaymentSectionProps> = ({ showPrimerCheckout }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-medium">Payment</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {!showPrimerCheckout ? (
            <p className="text-sm text-gray-500">
              Payment information will be securely collected via the Primer payment interface after validating your shipping information.
            </p>
          ) : (
            <p className="text-sm text-gray-500 mb-4">
              Please complete your payment below:
            </p>
          )}
          
          {/* Container for Universal Primer checkout */}
          <div 
            id="primer-payment-container" 
            className="min-h-48 bg-gray-50 rounded-md border border-gray-200 p-4"
          >
            {!showPrimerCheckout && (
              <div className="flex items-center justify-center h-full">
                <p className="text-muted-foreground text-sm">Payment form will appear here</p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PaymentSection;
