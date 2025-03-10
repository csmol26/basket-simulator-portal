
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
          --primer-color-background: transparent;
          --primer-radius-base: 6px;
          --primer-color-text-primary: #4CAF50;
        }
        
        /* Single line styling for card inputs */
        #primer-payment-container .single-line-card-inputs {
          display: flex;
          width: 100%;
          border: 1px solid #e2e8f0;
          border-radius: 6px;
          overflow: hidden;
          margin-bottom: 16px;
        }
        
        /* Allow inputs to flex and fill the container */
        #primer-payment-container .single-line-card-inputs > * {
          flex: 1;
        }
        
        /* Give card number more space */
        #primer-payment-container .single-line-card-inputs primer-input-card-number {
          flex: 2;
        }
        
        /* Style dividers between fields */
        #primer-payment-container .single-line-card-inputs > *:not(:last-child) {
          border-right: 1px solid #e2e8f0;
        }
        
        /* Button styling with blinking effect */
        #primer-payment-container button[type="submit"] {
          width: 100%;
          padding: 0.75rem;
          margin-top: 1rem;
          border-radius: 6px;
          animation: blinkColors 2s infinite;
          background: var(--primer-color-brand);
          color: white;
          font-weight: bold;
          cursor: pointer;
          border: none;
          font-size: 16px;
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
