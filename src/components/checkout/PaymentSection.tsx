
import React, { useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface PaymentSectionProps {
  showPrimerCheckout: boolean;
}

const PaymentSection: React.FC<PaymentSectionProps> = ({ showPrimerCheckout }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Add Primer CSS when the component mounts
  useEffect(() => {
    if (showPrimerCheckout) {
      // Add the main Primer styles
      const linkElement = document.createElement('link');
      linkElement.rel = 'stylesheet';
      linkElement.href = 'https://sdk.primer.io/web/primer-js/v0-latest/styles.css';
      document.head.appendChild(linkElement);

      // Add Google Fonts for Caveat
      const fontLinkElement = document.createElement('link');
      fontLinkElement.rel = 'stylesheet';
      fontLinkElement.href = 'https://fonts.googleapis.com/css2?family=Caveat:wght@400;700&display=swap';
      document.head.appendChild(fontLinkElement);

      // Add custom CSS variables globally with blinking animation
      const styleElement = document.createElement('style');
      styleElement.textContent = `
        @keyframes blinkColors {
          0% { --primer-color-brand: #9b87f5; }
          50% { --primer-color-brand: #D946EF; }
          100% { --primer-color-brand: #9b87f5; }
        }
        
        :root {
          animation: blinkColors 2s infinite;
          --primer-typography-brand: Caveat;
          --primer-color-background: #FFFF00;
          --primer-radius-base: 6px;
          --primer-color-text-primary: #4CAF50;
        }

        /* Custom styles for the seamless card form appearance */
        #primer-payment-container primer-card-form {
          width: 100%;
        }

        /* Create a seamless card form appearance */
        #primer-payment-container .card-row {
          display: flex;
          width: 100%;
          margin-bottom: 16px;
          border: 1px solid #e2e8f0;
          border-radius: 6px;
          overflow: hidden;
        }

        /* Remove individual borders between inputs */
        #primer-payment-container .card-row > * {
          flex: 1;
          margin: 0;
          border: none !important;
          border-radius: 0 !important;
        }

        /* Remove any margin/padding that might create visual separation */
        #primer-payment-container primer-input-card-number,
        #primer-payment-container primer-input-card-expiry,
        #primer-payment-container primer-input-cvv {
          margin: 0;
          padding: 0;
        }

        /* Ensure the hosted iframes inherit these styles */
        #primer-payment-container iframe {
          border: none !important;
        }

        /* Button styling */
        #primer-payment-container button[type="submit"],
        #primer-payment-container [data-submit] {
          width: 100%;
          padding: 0.75rem;
          margin-top: 1rem;
          border-radius: 6px;
          animation: blinkColors 2s infinite;
          background: var(--primer-color-brand);
          color: white;
          font-weight: bold;
          cursor: pointer;
        }
      `;
      document.head.appendChild(styleElement);

      return () => {
        // Clean up styles when component unmounts
        document.head.removeChild(linkElement);
        document.head.removeChild(fontLinkElement);
        document.head.removeChild(styleElement);
      };
    }
  }, [showPrimerCheckout]);

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
            <div className="space-y-4">
              <p className="text-sm text-gray-500">
                Please complete your payment below:
              </p>
              
              {/* Primer logo image */}
              <div className="flex justify-center mb-4">
                <img 
                  src="https://disruptivetechnews.com/wp-content/uploads/1663672073-primer-io-2x.jpeg" 
                  alt="Primer.io" 
                  className="h-16 object-contain"
                />
              </div>
            </div>
          )}
          
          {/* Container for Primer checkout - removed bg-gray-50 class */}
          <div 
            id="primer-payment-container" 
            ref={containerRef}
            className="min-h-48 rounded-md border border-gray-200 p-4"
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
