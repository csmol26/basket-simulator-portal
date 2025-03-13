import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Row, StyleVariables, CheckoutConfig } from "./types";
import { Clipboard } from "lucide-react";
import { toast } from "@/hooks/use-toast";

export interface ComposableCheckoutSlotsProps {
  rows: Row[];
  cardFormRows: Row[];
  styleVariables: StyleVariables;
  checkoutConfig: CheckoutConfig;
}

const ComposableCheckoutSlots: React.FC<ComposableCheckoutSlotsProps> = ({
  rows,
  cardFormRows,
  styleVariables,
  checkoutConfig
}) => {
  const [codeTab, setCodeTab] = useState<string>("html");
  const [copied, setCopied] = useState<{ [key: string]: boolean }>({
    html: false,
    js: false,
    react: false
  });

  const generateHtmlCode = () => {
    return `<primer-checkout client-token="\${clientSession.clientToken}">
  <primer-main slot="main">
    <!-- Payment methods -->
    <div slot="payments">
      <!-- Card payment method -->
      <p class="text-base font-medium text-gray-700 mb-4">Card</p>
      <primer-payment-method type="PAYMENT_CARD"></primer-payment-method>
      
      <!-- Alternative Payment Methods -->
      <div class="mt-8 pt-6 border-t border-gray-200">
        <p class="text-base font-medium text-gray-700 mb-4">Alternative Payment Methods</p>
        <primer-payment-method type="PAYPAL"></primer-payment-method>
        <primer-payment-method type="GOOGLE_PAY"></primer-payment-method>
        <primer-payment-method type="APPLE_PAY"></primer-payment-method>
      </div>
    </div>
    
    <!-- Custom completion screen -->
    <div slot="checkout-complete">
      <h2 class="text-xl font-bold text-green-600 text-center my-4">Thank you for your purchase!</h2>
      <p class="text-center text-gray-600">Your order has been processed successfully.</p>
    </div>
  </primer-main>
</primer-checkout>`;
  };

  const generateJsCode = () => {
    return `// 1. Initialize Primer with a client token from your server
const initPrimerCheckout = async () => {
  try {
    // Request a client token from your backend
    const response = await fetch('/api/create-primer-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        amount: 1000, // Amount in cents
        currency: 'USD',
        orderId: 'order-' + Date.now(),
      })
    });
    
    const clientSession = await response.json();
    
    // Get the checkout container
    const container = document.getElementById('primer-checkout-container');
    
    // Create the checkout HTML
    container.innerHTML = \`
      <primer-checkout client-token="\${clientSession.clientToken}">
        <primer-main slot="main">
          <!-- Payment methods -->
          <div slot="payments">
            <!-- Card payment method -->
            <p class="text-base font-medium text-gray-700 mb-4">Card</p>
            <primer-payment-method type="PAYMENT_CARD"></primer-payment-method>
            
            <!-- Alternative Payment Methods -->
            <div class="mt-8 pt-6 border-t border-gray-200">
              <p class="text-base font-medium text-gray-700 mb-4">Alternative Payment Methods</p>
              <primer-payment-method type="PAYPAL"></primer-payment-method>
              <primer-payment-method type="GOOGLE_PAY"></primer-payment-method>
              <primer-payment-method type="APPLE_PAY"></primer-payment-method>
            </div>
          </div>
          
          <!-- Custom completion screen -->
          <div slot="checkout-complete">
            <h2 class="text-xl font-bold text-green-600 text-center my-4">Thank you for your purchase!</h2>
            <p class="text-center text-gray-600">Your order has been processed successfully.</p>
          </div>
        </primer-main>
      </primer-checkout>
    \`;
    
    // Add event listeners to the checkout
    const checkoutElement = container.querySelector('primer-checkout');
    
    checkoutElement.addEventListener('primer-checkout-initialized', () => {
      console.log('Primer checkout initialized');
    });
    
    checkoutElement.addEventListener('primer-state-changed', (event) => {
      const state = event.detail;
      console.log('Checkout state changed:', state);
      
      if (state.isSuccessful) {
        console.log('Payment was successful!');
        // Handle successful payment
      }
      
      if (state.error) {
        console.error('Payment error:', state.error);
        // Handle payment error
      }
    });
    
  } catch (error) {
    console.error('Error initializing Primer checkout:', error);
  }
};

// Run the initialization
document.addEventListener('DOMContentLoaded', initPrimerCheckout);`;
  };

  const generateReactCode = () => {
    return `import React, { useEffect, useRef } from 'react';
import { loadPrimer } from '@primer-io/primer-js';

const PrimerCheckout = () => {
  const containerRef = useRef(null);
  
  useEffect(() => {
    const initPrimerCheckout = async () => {
      try {
        // 1. Request a client token from your API
        const response = await fetch('/api/create-primer-session', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            amount: 1000, // Amount in cents
            currency: 'USD',
            orderId: 'order-' + Date.now(),
          })
        });
        
        const clientSession = await response.json();
        
        // 2. Load Primer SDK
        await loadPrimer();
        
        // 3. Create the checkout HTML
        if (containerRef.current) {
          containerRef.current.innerHTML = \`
            <primer-checkout client-token="\${clientSession.clientToken}">
              <primer-main slot="main">
                <!-- Payment methods -->
                <div slot="payments">
                  <!-- Card payment method -->
                  <p class="text-base font-medium text-gray-700 mb-4">Card</p>
                  <primer-payment-method type="PAYMENT_CARD"></primer-payment-method>
                  
                  <!-- Alternative Payment Methods -->
                  <div class="mt-8 pt-6 border-t border-gray-200">
                    <p class="text-base font-medium text-gray-700 mb-4">Alternative Payment Methods</p>
                    <primer-payment-method type="PAYPAL"></primer-payment-method>
                    <primer-payment-method type="GOOGLE_PAY"></primer-payment-method>
                    <primer-payment-method type="APPLE_PAY"></primer-payment-method>
                  </div>
                </div>
                
                <!-- Custom completion screen -->
                <div slot="checkout-complete">
                  <h2 class="text-xl font-bold text-green-600 text-center my-4">Thank you for your purchase!</h2>
                  <p class="text-center text-gray-600">Your order has been processed successfully.</p>
                </div>
              </primer-main>
            </primer-checkout>
          \`;
          
          // 4. Add event listeners
          const checkoutElement = containerRef.current.querySelector('primer-checkout');
          
          checkoutElement.addEventListener('primer-checkout-initialized', () => {
            console.log('Primer checkout initialized');
          });
          
          checkoutElement.addEventListener('primer-state-changed', (event) => {
            const state = event.detail;
            console.log('Checkout state changed:', state);
            
            if (state.isSuccessful) {
              console.log('Payment was successful!');
              // Handle successful payment, e.g. redirect to confirmation page
            }
            
            if (state.error) {
              console.error('Payment error:', state.error);
              // Handle payment error
            }
          });
        }
        
      } catch (error) {
        console.error('Error initializing Primer checkout:', error);
      }
    };
    
    initPrimerCheckout();
    
    // Cleanup function
    return () => {
      // Clean up any event listeners if needed
    };
  }, []);
  
  return (
    <div className="w-full">
      <div 
        ref={containerRef}
        id="primer-checkout-container" 
        className="min-h-48 rounded-md border border-gray-200 p-4"
      />
    </div>
  );
};

export default PrimerCheckout;`;
  };

  const copyToClipboard = (code: string, type: string) => {
    navigator.clipboard.writeText(code);
    setCopied(prev => ({ ...prev, [type]: true }));
    
    toast({
      title: "Copied to clipboard",
      description: `${type.toUpperCase()} code has been copied to your clipboard`,
    });
    
    setTimeout(() => {
      setCopied(prev => ({ ...prev, [type]: false }));
    }, 2000);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Composable Checkout Slots Implementation</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600 mb-4">
            Use these code snippets to implement a checkout with Primer's Composable Checkout Web Components.
            The code is based on your configuration from the Checkout Builder and Card Form Builder.
          </p>
          
          <Tabs value={codeTab} onValueChange={setCodeTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="html">HTML</TabsTrigger>
              <TabsTrigger value="js">JavaScript</TabsTrigger>
              <TabsTrigger value="react">React</TabsTrigger>
            </TabsList>
            
            <TabsContent value="html">
              <div className="bg-gray-50 p-4 rounded-md relative border">
                <Button 
                  className="absolute right-2 top-2 h-8 w-8 p-0" 
                  variant="outline" 
                  onClick={() => copyToClipboard(generateHtmlCode(), "html")}
                >
                  <Clipboard className="h-4 w-4" />
                </Button>
                <pre className="text-xs overflow-x-auto p-2 text-gray-800">
                  {generateHtmlCode()}
                </pre>
              </div>
              <p className="text-sm text-gray-500 mt-2">This is the HTML structure for implementing Primer's Composable Checkout.</p>
            </TabsContent>
            
            <TabsContent value="js">
              <div className="bg-gray-50 p-4 rounded-md relative border">
                <Button 
                  className="absolute right-2 top-2 h-8 w-8 p-0" 
                  variant="outline" 
                  onClick={() => copyToClipboard(generateJsCode(), "js")}
                >
                  <Clipboard className="h-4 w-4" />
                </Button>
                <pre className="text-xs overflow-x-auto p-2 text-gray-800">
                  {generateJsCode()}
                </pre>
              </div>
              <p className="text-sm text-gray-500 mt-2">JavaScript implementation for adding Primer's Composable Checkout to your website.</p>
            </TabsContent>
            
            <TabsContent value="react">
              <div className="bg-gray-50 p-4 rounded-md relative border">
                <Button 
                  className="absolute right-2 top-2 h-8 w-8 p-0" 
                  variant="outline" 
                  onClick={() => copyToClipboard(generateReactCode(), "react")}
                >
                  <Clipboard className="h-4 w-4" />
                </Button>
                <pre className="text-xs overflow-x-auto p-2 text-gray-800">
                  {generateReactCode()}
                </pre>
              </div>
              <p className="text-sm text-gray-500 mt-2">React component implementation for adding Primer's Composable Checkout.</p>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Implementation Guide</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium mb-2">1. Backend Setup</h3>
              <p className="text-sm text-gray-600">
                Create an API endpoint on your server to generate a Primer client session token. This endpoint should:
              </p>
              <ul className="list-disc list-inside text-sm text-gray-600 mt-2 ml-4 space-y-1">
                <li>Accept details about the order (amount, currency, etc.)</li>
                <li>Call Primer's API to create a client session</li>
                <li>Return the client token to your frontend</li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-2">2. Frontend Integration</h3>
              <p className="text-sm text-gray-600">
                Choose the appropriate implementation based on your tech stack:
              </p>
              <ul className="list-disc list-inside text-sm text-gray-600 mt-2 ml-4 space-y-1">
                <li>HTML: Use for static sites or server-rendered pages</li>
                <li>JavaScript: Use for dynamic websites without a framework</li>
                <li>React: Use for React applications</li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-2">3. Handling Checkout Events</h3>
              <p className="text-sm text-gray-600">
                The code examples include event listeners for:
              </p>
              <ul className="list-disc list-inside text-sm text-gray-600 mt-2 ml-4 space-y-1">
                <li><code>primer-checkout-initialized</code>: When the SDK is ready</li>
                <li><code>primer-state-changed</code>: When the checkout state changes</li>
              </ul>
              <p className="text-sm text-gray-600 mt-2">
                Expand the event handlers to match your application needs, such as redirecting to a confirmation page after successful payment.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ComposableCheckoutSlots;
