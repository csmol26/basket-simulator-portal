
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
    
    // 2. Load Primer SDK - loadPrimer() doesn't return the Primer object
    // Instead we need to access it through the global window object after loading
    await loadPrimer();
    console.log("Primer SDK loaded successfully");
    
    // Access the Primer object from the global window object
    // @ts-ignore - Primer is added to window by loadPrimer()
    const Primer = window.Primer;
    
    if (!Primer) {
      throw new Error("Primer SDK failed to load properly");
    }
    
    // 3. Use the showUniversalCheckout method with the correct parameter structure
    // The UniversalCheckoutOptions type does not have an 'options' property
    const checkout = await Primer.showUniversalCheckout(
      clientSession.clientToken,
      {
        container: `#${config.containerId}`,
        locale: "en-US"
      }
    );
    
    // 4. Set up event handlers - use the correct event names from the SDK
    // The Primer SDK likely uses 'on' instead of 'addEventListener'
    checkout.on('CHECKOUT_COMPLETE', (event: any) => {
      console.log('Checkout completed successfully!', event);
      if (config.onComplete) {
        config.onComplete(event.payment);
      }
    });
    
    checkout.on('CHECKOUT_ERROR', (event: any) => {
      console.log('Checkout failed:', event);
      if (config.onError) {
        config.onError(event.error, event.payment);
      }
    });
    
    console.log("Primer checkout initialized successfully");
    
  } catch (error) {
    console.error("Error initializing Primer checkout:", error);
    throw error;
  }
};
