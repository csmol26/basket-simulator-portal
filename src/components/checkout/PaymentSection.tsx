
import React, { useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface PaymentSectionProps {
  showPrimerCheckout: boolean;
}

const PaymentSection: React.FC<PaymentSectionProps> = ({ showPrimerCheckout }) => {
  const cardContainerRef = useRef<HTMLDivElement>(null);
  const applePayContainerRef = useRef<HTMLDivElement>(null);
  const googlePayContainerRef = useRef<HTMLDivElement>(null);

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
          
          {/* Container for Primer card payment UI */}
          <div 
            id="primer-payment-container-card" 
            ref={cardContainerRef}
            className="min-h-48 bg-gray-50 rounded-md border border-gray-200 p-4"
          >
            {!showPrimerCheckout && (
              <div className="flex items-center justify-center h-full">
                <p className="text-muted-foreground text-sm">Credit card payment form will appear here</p>
              </div>
            )}
          </div>
          
          {/* Container for Apple Pay */}
          <div 
            id="primer-payment-container-applepay" 
            ref={applePayContainerRef}
            className="min-h-12 py-2"
          />
          
          {/* Container for Google Pay */}
          <div 
            id="primer-payment-container-googlepay" 
            ref={googlePayContainerRef}
            className="min-h-12 py-2"
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default PaymentSection;
