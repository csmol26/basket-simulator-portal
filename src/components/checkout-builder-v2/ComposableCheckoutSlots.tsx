
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import { toast } from "sonner";
import { Row, StyleVariables, CheckoutConfig } from './types';
import { formatPrimerComponent } from './code-generation/codeGenerationUtils';

interface ComposableCheckoutSlotsProps {
  cardFormRows: Row[];
  checkoutRows: Row[];
  styleVariables: StyleVariables;
  checkoutConfig: CheckoutConfig;
}

const ComposableCheckoutSlots: React.FC<ComposableCheckoutSlotsProps> = ({
  cardFormRows,
  checkoutRows,
  styleVariables,
  checkoutConfig
}) => {
  const [activeCodeTab, setActiveCodeTab] = useState<string>("static-html");
  
  // Generate composable checkout code
  const generateComposableCode = () => {
    // Build card form content
    let cardFormContent = '';
    
    for (const row of cardFormRows) {
      if (row.components.length === 0) continue;
      
      if (row.components.length === 1) {
        const component = row.components[0];
        cardFormContent += `        ${formatPrimerComponent(component.originalComponent.id, component.config)}\n`;
      } else if (row.components.length === 2) {
        cardFormContent += `        <!-- Two components side by side -->\n`;
        cardFormContent += `        <div style="display: flex; gap: 16px;">\n`;
        cardFormContent += `          <div style="flex: 1;">\n`;
        cardFormContent += `            ${formatPrimerComponent(row.components[0].originalComponent.id, row.components[0].config)}\n`;
        cardFormContent += `          </div>\n`;
        cardFormContent += `          <div style="flex: 1;">\n`;
        cardFormContent += `            ${formatPrimerComponent(row.components[1].originalComponent.id, row.components[1].config)}\n`;
        cardFormContent += `          </div>\n`;
        cardFormContent += `        </div>\n`;
      } else {
        cardFormContent += `        <!-- Multiple components in row -->\n`;
        cardFormContent += `        <div style="display: flex; gap: 16px;">\n`;
        for (const component of row.components) {
          cardFormContent += `          <div style="flex: 1;">\n`;
          cardFormContent += `            ${formatPrimerComponent(component.originalComponent.id, component.config)}\n`;
          cardFormContent += `          </div>\n`;
        }
        cardFormContent += `        </div>\n`;
      }
    }
    
    // If no card components, use default layout
    if (!cardFormContent) {
      cardFormContent = `        <primer-input-card-number placeholder="4444 3333 2222 1111"></primer-input-card-number>\n        
        <!-- Expiry and CVV side by side -->\n
        <div style="display: flex; gap: 16px;">\n
          <div style="flex: 1;">\n
            <primer-input-card-expiry placeholder="12/30"></primer-input-card-expiry>\n
          </div>\n
          <div style="flex: 1;">\n
            <primer-input-cvv placeholder="123"></primer-input-cvv>\n
          </div>\n
        </div>\n
        
        <primer-input-card-holder-name placeholder="John Smith"></primer-input-card-holder-name>\n
        <primer-card-form-submit style="height: 40px; width: 100%; font-weight: 500;"></primer-card-form-submit>`;
    }
    
    // Build the alternative payment methods section
    let apmContent = '';
    const hasAPMs = checkoutRows.some(row => 
      row.components.some(component => component.originalComponent.isAPM)
    );
    
    if (hasAPMs) {
      apmContent = `\n      <!-- Alternative Payment Methods -->\n      <div class="mt-8 pt-6 border-t border-gray-200">\n`;
      apmContent += `        <p class="text-base font-medium text-gray-700 mb-4">Alternative Payment Methods</p>\n`;
      
      for (const row of checkoutRows) {
        for (const component of row.components) {
          if (component.originalComponent.isAPM) {
            apmContent += `        <primer-payment-method type="${component.originalComponent.apmType}"></primer-payment-method>\n`;
          }
        }
      }
      
      apmContent += `      </div>`;
    }
    
    // Generate layout class based on config
    let layoutClass = '';
    switch (checkoutConfig.layout) {
      case 'multi-step':
        layoutClass = ' data-layout="stepped"';
        break;
      case 'single-page':
      default:
        layoutClass = '';
        break;
    }
    
    // Generate payment methods display config
    let paymentMethodsDisplay = '';
    switch (checkoutConfig.paymentMethodsDisplay) {
      case 'radio':
        paymentMethodsDisplay = ' data-payment-method-display="radio"';
        break;
      case 'buttons':
        paymentMethodsDisplay = ' data-payment-method-display="buttons"';
        break;
      case 'tabs':
        paymentMethodsDisplay = ' data-payment-method-display="tabs"';
        break;
      case 'dropdown':
      default:
        paymentMethodsDisplay = ' data-payment-method-display="dropdown"';
        break;
    }
    
    // Generate the style variables
    const cssVariables = Object.entries(styleVariables)
      .filter(([_, value]) => value !== '')
      .map(([key, value]) => `  --${key.replace(/([A-Z])/g, '-$1').toLowerCase()}: ${value};`)
      .join('\n');
      
    // Generate the custom styles JSON for the primer-checkout element
    const customStylesJson = Object.entries(styleVariables)
      .filter(([_, value]) => value !== '')
      .reduce((acc, [key, value]) => {
        acc[key] = value;
        return acc;
      }, {} as Record<string, string>);
    
    const customStylesAttr = Object.keys(customStylesJson).length > 0 
      ? ` custom-styles='${JSON.stringify(customStylesJson)}'` 
      : '';
    
    // Generate the static HTML code
    return `<!-- Composable Checkout with Slots -->
<style>
:root {
${cssVariables}
}
</style>

<primer-checkout
  client-token="\${clientToken}"${layoutClass}${paymentMethodsDisplay}${customStylesAttr}
>
  <primer-main slot="main">
    <!-- Payment methods -->
    <div slot="payments">
      <!-- Card payment method -->
      <primer-payment-method type="PAYMENT_CARD">
        <primer-card-form slot="payment-method-content">
          <div slot="card-form-content" style="--primer-input-height: 40px; --primer-space-medium: 16px; display: flex; flex-direction: column; gap: 16px;">
${cardFormContent}
          </div>
        </primer-card-form>
      </primer-payment-method>${apmContent}
    </div>
    
    <!-- Custom completion screen -->
    <div slot="checkout-complete">
      <h2 class="text-xl font-bold text-green-600 text-center my-4">Thank you for your purchase!</h2>
      <p class="text-center text-gray-600">Your order has been processed successfully.</p>
    </div>
  </primer-main>
</primer-checkout>`;
  };
  
  // Generate the JavaScript integration code
  const generateJsIntegrationCode = () => {
    // Add options config based on checkout configuration
    const optionsObj: Record<string, any> = {
      locale: 'en-GB'
    };
    
    if (checkoutConfig.layout === 'multi-step') {
      optionsObj.layout = 'stepped';
    }
    
    if (checkoutConfig.paymentMethodsDisplay) {
      optionsObj.paymentMethodsDisplay = checkoutConfig.paymentMethodsDisplay;
    }
    
    if (checkoutConfig.showCardholderName !== undefined) {
      if (!optionsObj.card) optionsObj.card = {};
      optionsObj.card.cardholderName = {
        required: checkoutConfig.showCardholderName
      };
    }
    
    return `// JavaScript Integration with Composable Checkout
document.addEventListener('DOMContentLoaded', async () => {
  try {
    // Fetch client token from your server
    const response = await fetch('/api/create-checkout-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        amount: 1000, // Amount in smallest currency unit (e.g., cents)
        currencyCode: 'USD'
      })
    });
    
    const data = await response.json();
    const clientToken = data.clientToken;
    
    // Initialize checkout with the client token
    const checkoutElement = document.querySelector('primer-checkout');
    checkoutElement.setAttribute('client-token', clientToken);
    
    // Configure checkout options
    checkoutElement.options = ${JSON.stringify(optionsObj, null, 2)};
    
    // Listen for checkout events
    checkoutElement.addEventListener('primer-checkout-initialized', (event) => {
      console.log('Checkout initialized:', event.detail);
    });
    
    checkoutElement.addEventListener('primer-payment-methods-updated', (event) => {
      console.log('Payment methods updated:', event.detail);
    });
    
    checkoutElement.addEventListener('primer-state-changed', (event) => {
      const state = event.detail;
      console.log('Checkout state changed:', state);
      
      if (state.isSuccessful) {
        console.log('Payment was successful!');
      } else if (state.isProcessing) {
        console.log('Payment is processing...');
      } else if (state.error) {
        console.error('Error occurred:', state.error);
      }
    });
  } catch (error) {
    console.error('Failed to initialize checkout:', error);
  }
});`;
  };
  
  // Generate React component integration code
  const generateReactIntegrationCode = () => {
    // Add options config based on checkout configuration
    const optionsObj: Record<string, any> = {
      locale: 'en-GB'
    };
    
    if (checkoutConfig.layout === 'multi-step') {
      optionsObj.layout = 'stepped';
    }
    
    if (checkoutConfig.paymentMethodsDisplay) {
      optionsObj.paymentMethodsDisplay = checkoutConfig.paymentMethodsDisplay;
    }
    
    if (checkoutConfig.showCardholderName !== undefined) {
      if (!optionsObj.card) optionsObj.card = {};
      optionsObj.card.cardholderName = {
        required: checkoutConfig.showCardholderName
      };
    }
    
    return `import { useEffect, useRef, useState } from 'react';

export default function CheckoutComponent() {
  const [clientToken, setClientToken] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const checkoutRef = useRef(null);
  
  useEffect(() => {
    // Function to fetch client token
    const fetchClientToken = async () => {
      try {
        setIsLoading(true);
        
        const response = await fetch('/api/create-checkout-session', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            amount: 1000, // Amount in smallest currency unit (e.g., cents)
            currencyCode: 'USD'
          })
        });
        
        if (!response.ok) {
          throw new Error('Failed to create checkout session');
        }
        
        const data = await response.json();
        setClientToken(data.clientToken);
      } catch (err) {
        console.error('Error fetching client token:', err);
        setError(err.message || 'Failed to initialize checkout');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchClientToken();
  }, []);
  
  useEffect(() => {
    if (!clientToken || !checkoutRef.current) return;
    
    // Configure the checkout
    const checkoutElement = checkoutRef.current;
    
    // Set options on the checkout element
    checkoutElement.options = ${JSON.stringify(optionsObj, null, 2)};
    
    // Set up event listeners
    const handleCheckoutInitialized = (event) => {
      console.log('Checkout initialized:', event.detail);
    };
    
    const handlePaymentMethodsUpdated = (event) => {
      console.log('Payment methods updated:', event.detail);
    };
    
    const handleStateChanged = (event) => {
      const state = event.detail;
      console.log('Checkout state changed:', state);
      
      if (state.isSuccessful) {
        console.log('Payment was successful!');
        // Navigate to success page or update UI
      } else if (state.error) {
        console.error('Error occurred:', state.error);
        // Handle error state
      }
    };
    
    checkoutElement.addEventListener('primer-checkout-initialized', handleCheckoutInitialized);
    checkoutElement.addEventListener('primer-payment-methods-updated', handlePaymentMethodsUpdated);
    checkoutElement.addEventListener('primer-state-changed', handleStateChanged);
    
    return () => {
      // Clean up event listeners
      checkoutElement.removeEventListener('primer-checkout-initialized', handleCheckoutInitialized);
      checkoutElement.removeEventListener('primer-payment-methods-updated', handlePaymentMethodsUpdated);
      checkoutElement.removeEventListener('primer-state-changed', handleStateChanged);
    };
  }, [clientToken]);
  
  if (isLoading) {
    return <div className="text-center py-12">Loading checkout...</div>;
  }
  
  if (error) {
    return <div className="text-center py-12 text-red-600">Error: {error}</div>;
  }
  
  // Generate custom styles object from CSS variables
  const customStyles = ${JSON.stringify(
    Object.entries(styleVariables)
      .filter(([_, value]) => value !== '')
      .reduce((acc, [key, value]) => {
        acc[key] = value;
        return acc;
      }, {} as Record<string, string>),
    null, 2
  )};
  
  return (
    <div className="checkout-container">
      <primer-checkout
        ref={checkoutRef}
        client-token={clientToken}
        ${checkoutConfig.layout === 'multi-step' ? 'data-layout="stepped"' : ''}
        ${checkoutConfig.paymentMethodsDisplay ? `data-payment-method-display="${checkoutConfig.paymentMethodsDisplay}"` : ''}
        custom-styles={JSON.stringify(customStyles)}
      >
        <primer-main slot="main">
          {/* Payment methods */}
          <div slot="payments">
            {/* Card payment method */}
            <primer-payment-method type="PAYMENT_CARD">
              <primer-card-form slot="payment-method-content">
                <div 
                  slot="card-form-content"
                  style={{
                    '--primer-input-height': '40px',
                    '--primer-space-medium': '16px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '16px'
                  } as React.CSSProperties}
                >
                  {/* Card form components would be rendered here */}
                  {/* This is simplified - you'd need to render your card form components based on your configuration */}
                </div>
              </primer-card-form>
            </primer-payment-method>
            
            {/* Example of adding other payment methods */}
            <primer-payment-method type="PAYPAL"></primer-payment-method>
            <primer-payment-method type="GOOGLE_PAY"></primer-payment-method>
          </div>
          
          {/* Custom completion screen */}
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
  
  const composableCode = generateComposableCode();
  const jsIntegrationCode = generateJsIntegrationCode();
  const reactIntegrationCode = generateReactIntegrationCode();
  
  const copyToClipboard = (code: string, type: string) => {
    navigator.clipboard.writeText(code);
    toast.success(`${type} code copied to clipboard!`);
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Composable Checkout with Slots</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4 text-gray-600">
            This tab generates code for a customized Primer Composable Checkout using the slot-based architecture.
            The code is based on your configurations in the Checkout Builder and Card Form Builder tabs.
          </p>
          
          <Tabs value={activeCodeTab} onValueChange={setActiveCodeTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-4">
              <TabsTrigger value="static-html">HTML Implementation</TabsTrigger>
              <TabsTrigger value="js-integration">JavaScript Integration</TabsTrigger>
              <TabsTrigger value="react-integration">React Component</TabsTrigger>
            </TabsList>
            
            <TabsContent value="static-html" className="p-0">
              <div className="relative mt-4 p-4 rounded-md bg-gray-900 text-gray-200 overflow-auto max-h-[500px]">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="absolute top-2 right-2 bg-gray-800 hover:bg-gray-700 text-white" 
                  onClick={() => copyToClipboard(composableCode, "HTML")}
                >
                  <Copy size={16} />
                </Button>
                <pre className="text-sm">
                  <code>{composableCode}</code>
                </pre>
              </div>
            </TabsContent>
            
            <TabsContent value="js-integration" className="p-0">
              <div className="relative mt-4 p-4 rounded-md bg-gray-900 text-gray-200 overflow-auto max-h-[500px]">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="absolute top-2 right-2 bg-gray-800 hover:bg-gray-700 text-white" 
                  onClick={() => copyToClipboard(jsIntegrationCode, "JavaScript")}
                >
                  <Copy size={16} />
                </Button>
                <pre className="text-sm">
                  <code>{jsIntegrationCode}</code>
                </pre>
              </div>
            </TabsContent>
            
            <TabsContent value="react-integration" className="p-0">
              <div className="relative mt-4 p-4 rounded-md bg-gray-900 text-gray-200 overflow-auto max-h-[500px]">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="absolute top-2 right-2 bg-gray-800 hover:bg-gray-700 text-white" 
                  onClick={() => copyToClipboard(reactIntegrationCode, "React")}
                >
                  <Copy size={16} />
                </Button>
                <pre className="text-sm">
                  <code>{reactIntegrationCode}</code>
                </pre>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Implementation Guide</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium text-base mb-2">HTML Implementation</h3>
              <p className="text-sm text-gray-600">
                The HTML implementation provides a drop-in solution that you can directly incorporate into your website.
                Add the generated HTML to your page, replace the "{"\${clientToken}"}" with an actual client token from your server,
                and the checkout will initialize.
              </p>
            </div>
            
            <div>
              <h3 className="font-medium text-base mb-2">JavaScript Integration</h3>
              <p className="text-sm text-gray-600">
                The JavaScript integration shows how to programmatically fetch a client token from your server,
                initialize the checkout, configure options, and listen for checkout events. This is ideal for
                vanilla JavaScript applications.
              </p>
            </div>
            
            <div>
              <h3 className="font-medium text-base mb-2">React Component</h3>
              <p className="text-sm text-gray-600">
                The React implementation provides a complete React component that fetches the client token,
                renders the checkout, and handles events. This can be directly used in React applications.
              </p>
            </div>
            
            <div className="bg-yellow-50 p-4 rounded-md border border-yellow-200">
              <h3 className="font-medium text-base mb-2 text-yellow-800">Important Notes</h3>
              <ul className="list-disc list-inside text-sm text-yellow-800 space-y-1">
                <li>You need to implement the server endpoint to create a client token</li>
                <li>Test the checkout in a real environment to ensure all payment methods work correctly</li>
                <li>The actual available payment methods depend on your Primer account configuration</li>
                <li>Make sure to handle success, processing, and error states appropriately</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ComposableCheckoutSlots;
