
import { createPrimerClientSession } from './api';
import { loadPrimer } from '@primer-io/primer-js';

interface PrimerCheckoutConfig {
  amount: number;
  currency: string;
  orderId: string;
  items: {
    id: string;
    name: string;
    quantity: number;
    unitPrice: number;
  }[];
  containerId: string;
  onComplete?: (payment: any) => void;
  onError?: (error: any, paymentData: any) => void;
}

export const initPrimer = async (config: PrimerCheckoutConfig): Promise<void> => {
  console.log("Initializing Primer checkout with config:", config);
  
  try {
    // 1. Request a client token from our API
    const clientSession = await createPrimerClientSession(
      config.amount,
      config.currency,
      config.orderId,
      config.items
    );
    
    // 2. Load Primer SDK - needed before we can use the web components
    await loadPrimer();
    console.log("Primer SDK loaded successfully");
    
    // 3. Get the container element
    const container = document.getElementById(config.containerId);
    if (!container) {
      throw new Error(`Container element with ID '${config.containerId}' not found`);
    }
    
    // 4. Clear any existing content in the container
    container.innerHTML = '';
    
    // 5. Create the primer-checkout element
    const checkoutElement = document.createElement('primer-checkout');
    
    // 6. Set attributes
    checkoutElement.setAttribute('client-token', clientSession.clientToken);
    
    // Set options as a JSON string attribute
    const options = {
      locale: "en-US",
      card: {
        cardholderName: {
          required: true
        }
      }
    };
    checkoutElement.setAttribute('options', JSON.stringify(options));
    
    // 7. Create the primer-main element
    const mainElement = document.createElement('primer-main');
    mainElement.setAttribute('slot', 'main');
    
    // 8. Create a div for payments
    const paymentsDiv = document.createElement('div');
    paymentsDiv.setAttribute('slot', 'payments');
    
    // 9. Add primary payment method (card)
    const cardPaymentMethod = document.createElement('primer-payment-method');
    cardPaymentMethod.setAttribute('type', 'PAYMENT_CARD');
    paymentsDiv.appendChild(cardPaymentMethod);
    
    // 10. Assemble the components
    mainElement.appendChild(paymentsDiv);
    checkoutElement.appendChild(mainElement);
    container.appendChild(checkoutElement);
    
    // 11. Add event listeners to the checkout element
    checkoutElement.addEventListener('primer-checkout-initialized', () => {
      console.log('Primer checkout initialized');
    });
    
    checkoutElement.addEventListener('primer-state-changed', (event: any) => {
      const state = event.detail;
      console.log('Checkout state changed:', state);
      
      if (state.isSuccessful && config.onComplete) {
        console.log('Checkout completed successfully!');
        config.onComplete(state.payment);
      }
      
      if (state.error && config.onError) {
        console.log('Checkout failed:', state.error);
        config.onError(state.error, state.payment);
      }
    });
    
    console.log("Primer checkout initialized successfully");
    
  } catch (error) {
    console.error("Error initializing Primer checkout:", error);
    throw error;
  }
};
