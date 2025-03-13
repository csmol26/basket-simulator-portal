
export const generateHtmlCode = () => {
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

export const generateJsCode = () => {
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

export const generateReactCode = () => {
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
