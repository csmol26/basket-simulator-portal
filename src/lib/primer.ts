
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
    
    // 2. Load Primer SDK using the correct method from documentation
    await loadPrimer();
    console.log("Primer SDK loaded successfully");
    
    // Create primer-checkout element following the documentation
    const checkoutElement = document.createElement('primer-checkout');
    checkoutElement.setAttribute('client-token', clientSession.clientToken);
    
    // Add options if needed
    const options = {
      locale: "en-US"
    };
    checkoutElement.setAttribute('options', JSON.stringify(options));
    
    // Add event listeners for completion and errors
    checkoutElement.addEventListener('primer-checkout-complete', (event: any) => {
      console.log('Checkout completed successfully!', event.detail);
      if (config.onComplete) {
        config.onComplete(event.detail.payment);
      }
    });
    
    checkoutElement.addEventListener('primer-checkout-fail', (event: any) => {
      console.log('Checkout failed:', event.detail);
      if (config.onError) {
        config.onError(event.detail.error, event.detail.payment);
      }
    });
    
    // Append to container
    const container = document.getElementById(config.containerId);
    if (container) {
      container.innerHTML = ''; // Clear container
      container.appendChild(checkoutElement);
      console.log("Primer checkout element added to container");
    } else {
      throw new Error(`Container with ID '${config.containerId}' not found`);
    }
    
  } catch (error) {
    console.error("Error initializing Primer checkout:", error);
    throw error;
  }
};
