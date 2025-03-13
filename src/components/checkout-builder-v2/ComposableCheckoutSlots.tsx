
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Copy } from "lucide-react";
import { toast } from "sonner";
import { Row, StyleVariables, CheckoutConfig } from './types';
import CheckoutSlotPreview from './previews/CheckoutSlotPreview';

interface ComposableCheckoutSlotsProps {
  checkoutRows: Row[];
  cardFormRows: Row[];
  styleVariables: StyleVariables;
  checkoutConfig: CheckoutConfig;
}

const ComposableCheckoutSlots: React.FC<ComposableCheckoutSlotsProps> = ({
  checkoutRows,
  cardFormRows,
  styleVariables,
  checkoutConfig
}) => {
  const [activeCodeTab, setActiveCodeTab] = useState("html");

  // Generate HTML code for the Primer checkout with slots
  const generateHTMLCode = () => {
    // Format checkout attributes
    let layoutAttribute = '';
    if (checkoutConfig.layout === 'multi-step') {
      layoutAttribute = ' data-layout="stepped"';
    }

    let paymentMethodDisplayAttribute = '';
    if (checkoutConfig.paymentMethodsDisplay) {
      paymentMethodDisplayAttribute = ` data-payment-method-display="${checkoutConfig.paymentMethodsDisplay}"`;
    }

    // Generate content for card form if it exists in checkout rows
    let cardFormContent = '';
    const hasCardForm = checkoutRows.some(row => 
      row.components.some(component => 
        component.originalComponent.id === 'card-form' || 
        component.originalComponent.isCardForm
      )
    );

    if (hasCardForm && cardFormRows.length > 0) {
      cardFormContent = generateCardFormContent();
    }

    // Generate the payment methods section content
    let paymentMethodsContent = '';
    let hasAPMs = false;

    checkoutRows.forEach(row => {
      row.components.forEach(component => {
        if (component.originalComponent.isAPM) {
          hasAPMs = true;
          paymentMethodsContent += `      <primer-payment-method type="${component.originalComponent.apmType}"></primer-payment-method>\n`;
        }
      });
    });

    // Assemble the final HTML
    let html = `<primer-checkout 
  client-token="\${clientSession.clientToken}"${layoutAttribute}${paymentMethodDisplayAttribute}
>
  <primer-main slot="main">
    <!-- Payment methods -->
    <div slot="payments">`;

    if (hasCardForm) {
      html += `
      <!-- Card payment method -->
      <p class="text-base font-medium text-gray-700 mb-4">Card</p>
      <primer-card-form>
        <div slot="card-form-content" style="--primer-input-height: 40px; --primer-space-medium: 16px; display: flex; flex-direction: column; gap: 16px;">
${cardFormContent}
        </div>
      </primer-card-form>`;
    }

    if (hasAPMs) {
      html += `
      <!-- Alternative Payment Methods -->
      <div class="mt-8 pt-6 border-t border-gray-200">
        <p class="text-base font-medium text-gray-700 mb-4">Alternative Payment Methods</p>
${paymentMethodsContent}      </div>`;
    }

    html += `
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

  // Generate JS implementation code
  const generateJSCode = () => {
    return `// Initialize Primer checkout
document.addEventListener('DOMContentLoaded', async function() {
  try {
    // Get client token from your server
    const response = await fetch('/api/create-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: 1000, // Example amount in cents
        currencyCode: 'USD',
        ${checkoutConfig.layout === "multi-step" ? "isMultiStep: true," : ""}
        ${checkoutConfig.showCardholderName ? "showCardholderName: true," : "showCardholderName: false,"}
      }),
    });
    
    const clientSession = await response.json();
    
    // Find the checkout element
    const checkout = document.querySelector('primer-checkout');
    if (checkout) {
      // Set client token
      checkout.setAttribute('client-token', clientSession.clientToken);
      
      // Configure checkout options
      checkout.options = {
        ${checkoutConfig.showCardholderName ? "card: {\n          cardholderName: {\n            required: true\n          }\n        }," : ""}
        // Add more payment method options as needed
      };
      
      // Listen for checkout events
      checkout.addEventListener('primer-checkout-initialized', (event) => {
        console.log('Checkout initialized:', event.detail);
      });
      
      checkout.addEventListener('primer-payment-methods-updated', (event) => {
        console.log('Available payment methods:', event.detail);
      });
      
      checkout.addEventListener('primer-state-changed', (event) => {
        const state = event.detail;
        if (state.isSuccessful) {
          console.log('Payment successful!');
          // Redirect to confirmation page or show success message
        } else if (state.error) {
          console.error('Payment error:', state.error);
          // Handle error state
        }
      });
    }
  } catch (error) {
    console.error('Failed to initialize checkout:', error);
  }
});`;
  };

  // Generate React implementation code
  const generateReactCode = () => {
    return `import { useEffect, useRef } from 'react';

export default function CheckoutComponent() {
  const checkoutRef = useRef(null);
  
  useEffect(() => {
    async function initializeCheckout() {
      try {
        // Get client token from your server
        const response = await fetch('/api/create-session', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            amount: 1000, // Example amount in cents
            currencyCode: 'USD',
            ${checkoutConfig.layout === "multi-step" ? "isMultiStep: true," : ""}
            ${checkoutConfig.showCardholderName ? "showCardholderName: true," : "showCardholderName: false,"}
          }),
        });
        
        const clientSession = await response.json();
        
        if (checkoutRef.current) {
          const checkout = checkoutRef.current;
          
          // Set client token
          checkout.setAttribute('client-token', clientSession.clientToken);
          
          // Configure checkout options
          checkout.options = {
            ${checkoutConfig.showCardholderName ? "card: {\n              cardholderName: {\n                required: true\n              }\n            }," : ""}
            // Add more payment method options as needed
          };
          
          // Listen for checkout events
          const handleCheckoutInitialized = (event) => {
            console.log('Checkout initialized:', event.detail);
          };
          
          const handlePaymentMethodsUpdated = (event) => {
            console.log('Available payment methods:', event.detail);
          };
          
          const handleStateChanged = (event) => {
            const state = event.detail;
            if (state.isSuccessful) {
              console.log('Payment successful!');
              // Redirect to confirmation page or show success message
            } else if (state.error) {
              console.error('Payment error:', state.error);
              // Handle error state
            }
          };
          
          checkout.addEventListener('primer-checkout-initialized', handleCheckoutInitialized);
          checkout.addEventListener('primer-payment-methods-updated', handlePaymentMethodsUpdated);
          checkout.addEventListener('primer-state-changed', handleStateChanged);
          
          // Cleanup event listeners
          return () => {
            checkout.removeEventListener('primer-checkout-initialized', handleCheckoutInitialized);
            checkout.removeEventListener('primer-payment-methods-updated', handlePaymentMethodsUpdated);
            checkout.removeEventListener('primer-state-changed', handleStateChanged);
          };
        }
      } catch (error) {
        console.error('Failed to initialize checkout:', error);
      }
    }
    
    initializeCheckout();
  }, []);
  
  return (
    <div className="checkout-container">
      <h2 className="text-xl font-bold mb-6">Complete your purchase</h2>
      
      {/* Primer checkout component */}
      <primer-checkout 
        ref={checkoutRef}
        ${checkoutConfig.layout === "multi-step" ? 'data-layout="stepped"' : ''}
        ${checkoutConfig.paymentMethodsDisplay ? `data-payment-method-display="${checkoutConfig.paymentMethodsDisplay}"` : ''}
      >
        <primer-main slot="main">
          {/* Payment methods slot */}
          <div slot="payments">
            {/* Content will be dynamically populated */}
          </div>
          
          {/* Completion screen slot */}
          <div slot="checkout-complete">
            <h2 className="text-xl font-bold text-green-600 text-center my-4">
              Thank you for your purchase!
            </h2>
            <p className="text-center text-gray-600">
              Your order has been processed successfully.
            </p>
          </div>
        </primer-main>
      </primer-checkout>
    </div>
  );
}`;
  };

  // Generate content for card form slot
  const generateCardFormContent = () => {
    let content = '';
    
    // Process each row of card form components
    for (const row of cardFormRows) {
      if (row.components.length === 0) continue;
      
      if (row.components.length === 1) {
        // Single component in row
        const component = row.components[0];
        content += `          ${formatPrimerComponent(component.originalComponent.id, component.config)}\n`;
      } else if (row.components.length === 2) {
        // Two components side by side
        content += `          <!-- Two components side by side -->\n`;
        content += `          <div style="display: flex; gap: 16px;">\n`;
        content += `            <div style="flex: 1;">\n`;
        content += `              ${formatPrimerComponent(row.components[0].originalComponent.id, row.components[0].config)}\n`;
        content += `            </div>\n`;
        content += `            <div style="flex: 1;">\n`;
        content += `              ${formatPrimerComponent(row.components[1].originalComponent.id, row.components[1].config)}\n`;
        content += `            </div>\n`;
        content += `          </div>\n`;
      } else {
        // More than two components
        content += `          <!-- Multiple components in row -->\n`;
        content += `          <div style="display: flex; gap: 16px;">\n`;
        for (const component of row.components) {
          content += `            <div style="flex: 1;">\n`;
          content += `              ${formatPrimerComponent(component.originalComponent.id, component.config)}\n`;
          content += `            </div>\n`;
        }
        content += `          </div>\n`;
      }
    }
    
    // If no components were added, use default layout
    if (!content) {
      content = `          <primer-input-card-number placeholder="4444 3333 2222 1111"></primer-input-card-number>
          
          <!-- Expiry and CVV side by side -->
          <div style="display: flex; gap: 16px;">
            <div style="flex: 1;">
              <primer-input-card-expiry placeholder="12/30"></primer-input-card-expiry>
            </div>
            <div style="flex: 1;">
              <primer-input-cvv placeholder="123"></primer-input-cvv>
            </div>
          </div>
          
          <primer-input-card-holder-name placeholder="John Smith"></primer-input-card-holder-name>
          <primer-card-form-submit style="height: 40px; width: 100%; font-weight: 500;"></primer-card-form-submit>`;
    }
    
    return content;
  };

  // Format primer component tag with its attributes
  const formatPrimerComponent = (componentType: string, config?: { 
    placeholder?: string; 
    label?: string; 
    ariaLabel?: string;
    buttonText?: string;
    variant?: string;
  }) => {
    const placeholder = config?.placeholder ? ` placeholder="${config.placeholder}"` : '';
    const label = config?.label ? ` label="${config.label}"` : '';
    const ariaLabel = config?.ariaLabel ? ` aria-label="${config.ariaLabel}"` : '';
    const buttonText = config?.buttonText ? ` buttonText="${config.buttonText}"` : '';
    const variant = config?.variant ? ` variant="${config.variant}"` : '';
    
    switch (componentType) {
      case 'card-number':
        return `<primer-input-card-number${label}${placeholder}${ariaLabel}></primer-input-card-number>`;
      case 'card-expiry':
        return `<primer-input-card-expiry${label}${placeholder}${ariaLabel}></primer-input-card-expiry>`;
      case 'card-cvv':
        return `<primer-input-cvv${label}${placeholder}${ariaLabel}></primer-input-cvv>`;
      case 'card-holder':
        return `<primer-input-card-holder-name${label}${placeholder}${ariaLabel}></primer-input-card-holder-name>`;
      case 'card-submit':
        return `<primer-card-form-submit${buttonText}${variant} style="height: 40px; width: 100%; font-weight: 500;"></primer-card-form-submit>`;
      default:
        return '';
    }
  };

  // Copy code to clipboard
  const copyToClipboard = (code: string) => {
    navigator.clipboard.writeText(code);
    toast.success('Code copied to clipboard!');
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-[1fr_2fr] gap-6">
      <div className="space-y-6">
        <div className="bg-white border rounded-md p-4">
          <h3 className="font-medium text-lg mb-4">Checkout Preview</h3>
          <CheckoutSlotPreview 
            rows={checkoutRows} 
            cardFormRows={cardFormRows} 
            styleVariables={styleVariables} 
          />
        </div>
      </div>
      
      <div className="space-y-6">
        <div className="bg-white border rounded-md p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium text-lg">Composable Checkout Slots Code</h3>
            <Tabs value={activeCodeTab} onValueChange={setActiveCodeTab} className="w-auto">
              <TabsList>
                <TabsTrigger value="html">HTML</TabsTrigger>
                <TabsTrigger value="js">JavaScript</TabsTrigger>
                <TabsTrigger value="react">React</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          
          {activeCodeTab === "html" && (
            <div className="relative">
              <Button 
                variant="outline" 
                size="sm" 
                className="absolute top-2 right-2 bg-gray-800 hover:bg-gray-700 text-white"
                onClick={() => copyToClipboard(generateHTMLCode())}
              >
                <Copy size={16} />
              </Button>
              <pre className="bg-gray-900 text-gray-200 p-4 rounded-md text-sm overflow-auto max-h-[400px]">
                <code>{generateHTMLCode()}</code>
              </pre>
              <p className="text-sm text-gray-500 mt-2">
                The generated HTML for your checkout. Copy and use this in your website.
              </p>
            </div>
          )}
          
          {activeCodeTab === "js" && (
            <div className="relative">
              <Button 
                variant="outline" 
                size="sm" 
                className="absolute top-2 right-2 bg-gray-800 hover:bg-gray-700 text-white"
                onClick={() => copyToClipboard(generateJSCode())}
              >
                <Copy size={16} />
              </Button>
              <pre className="bg-gray-900 text-gray-200 p-4 rounded-md text-sm overflow-auto max-h-[400px]">
                <code>{generateJSCode()}</code>
              </pre>
              <p className="text-sm text-gray-500 mt-2">
                JavaScript implementation for initializing the checkout in your website.
              </p>
            </div>
          )}
          
          {activeCodeTab === "react" && (
            <div className="relative">
              <Button 
                variant="outline" 
                size="sm" 
                className="absolute top-2 right-2 bg-gray-800 hover:bg-gray-700 text-white"
                onClick={() => copyToClipboard(generateReactCode())}
              >
                <Copy size={16} />
              </Button>
              <pre className="bg-gray-900 text-gray-200 p-4 rounded-md text-sm overflow-auto max-h-[400px]">
                <code>{generateReactCode()}</code>
              </pre>
              <p className="text-sm text-gray-500 mt-2">
                React component implementation for integrating the checkout in your React application.
              </p>
            </div>
          )}
        </div>
        
        <div className="bg-white border rounded-md p-4">
          <h3 className="font-medium text-lg mb-2">Implementation Guide</h3>
          <div className="text-sm space-y-2 text-gray-700">
            <p><strong>1. Include Primer Script</strong>: Add the Primer script to your HTML head.</p>
            <pre className="bg-gray-100 p-2 rounded-md text-xs">
              <code>{`<script src="https://sdk.primer.io/web/primer-js/v0-latest/esm/primer-modules.js" type="module"></script>`}</code>
            </pre>
            
            <p><strong>2. Add CSS for Styling</strong>: Include the Primer styles in your HTML head.</p>
            <pre className="bg-gray-100 p-2 rounded-md text-xs">
              <code>{`<link rel="stylesheet" href="https://sdk.primer.io/web/primer-js/v0-latest/styles.css">`}</code>
            </pre>
            
            <p><strong>3. Create Server Endpoint</strong>: Set up a server endpoint to create client sessions.</p>
            <p><strong>4. Initialize Checkout</strong>: Use the generated code to initialize the checkout.</p>
            <p><strong>5. Test</strong>: Test your integration with Primer's test cards and credentials.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComposableCheckoutSlots;
