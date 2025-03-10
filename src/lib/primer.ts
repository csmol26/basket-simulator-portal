
import { createPrimerClientSession } from './api';

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
  console.log("Initializing Primer Composable checkout with config:", config);
  
  try {
    // 1. Request a client token from our API that makes a real call to Primer
    const clientSession = await createPrimerClientSession(
      config.amount,
      config.currency,
      config.orderId,
      config.items
    );
    
    // 2. Load Primer SDK using the correct method from documentation
    const primerModule = await import('@primer-io/checkout-web');
    
    // Check what methods are available on the imported module
    console.log("Available Primer methods:", Object.keys(primerModule));
    
    // According to the documentation, we need to first load Primer
    if (typeof primerModule.loadPrimer === 'function') {
      await primerModule.loadPrimer();
      console.log("Primer SDK loaded successfully");
    } else {
      console.log("loadPrimer method not found, trying alternative approach");
    }
    
    // Create primer-checkout element
    const checkoutElement = document.createElement('primer-checkout');
    checkoutElement.setAttribute('client-token', clientSession.clientToken);
    
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
