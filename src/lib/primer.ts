
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
    await loadPrimer();
    console.log("Primer SDK loaded successfully");
    
    // 3. Get the container element
    const container = document.getElementById(config.containerId);
    if (!container) {
      throw new Error(`Container element with ID '${config.containerId}' not found`);
    }
    
    // 4. Initialize Primer checkout with simple structure
    container.innerHTML = `
      <primer-checkout 
        client-token="${clientSession.clientToken}"
        class="w-full"
      >
      </primer-checkout>
    `;

    const checkoutElement = container.querySelector('primer-checkout');
    if (checkoutElement) {
      // Add event listeners
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
    }
    
    console.log("Primer checkout initialized successfully");
    
  } catch (error) {
    console.error("Error initializing Primer checkout:", error);
    throw error;
  }
};
