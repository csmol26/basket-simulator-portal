
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
    
    // 2. Import the Primer module dynamically
    const primerModule = await import('@primer-io/checkout-web');
    
    // 3. Initialize the Universal Checkout with client token
    // The SDK exports a default object, we need to check what methods are available
    console.log("Available Primer methods:", Object.keys(primerModule.default));
    
    // Properly initialize the checkout with the correct method
    const checkout = await primerModule.default.init({
      // Provide the client token
      clientToken: clientSession.clientToken,
      
      // Configure the container where the checkout will be rendered
      containers: {
        main: `#${config.containerId}`
      },
      
      // Configure checkout events
      onCheckoutComplete: (data: any) => {
        console.log('Checkout completed successfully!', data);
        if (config.onComplete) {
          config.onComplete(data.payment);
        }
      },
      
      onCheckoutFail: (error: any, data: any) => {
        console.log('Checkout failed:', error, data);
        if (config.onError) {
          config.onError(error, data.payment);
        }
      }
    });
    
    console.log("Primer checkout initialized successfully", checkout);
    
  } catch (error) {
    console.error("Error initializing Primer checkout:", error);
    throw error;
  }
};
