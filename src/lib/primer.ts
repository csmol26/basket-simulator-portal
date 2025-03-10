
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
    
    // 2. Load Primer SDK
    const Primer = await loadPrimer();
    console.log("Primer SDK loaded successfully");
    
    // 3. Configure Primer with client token
    await Primer.configure({
      clientToken: clientSession.clientToken,
    });
    
    // 4. Create and show checkout
    const checkoutHandler = await Primer.createCheckout({
      container: `#${config.containerId}`,
      options: {
        locale: "en-US"
      }
    });
    
    // 5. Set up event handlers
    checkoutHandler.on('CHECKOUT_COMPLETE', (event: any) => {
      console.log('Checkout completed successfully!', event);
      if (config.onComplete) {
        config.onComplete(event.payment);
      }
    });
    
    checkoutHandler.on('CHECKOUT_ERROR', (event: any) => {
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
