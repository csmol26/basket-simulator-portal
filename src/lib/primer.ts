
import { Primer } from '@primer-io/checkout-web';
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
    
    // 2. Initialize Primer with the client token
    const primer = new Primer(clientSession.clientToken);
    
    // 3. Create the checkout instance using the Composable Checkout API
    const checkout = await primer.createCheckout();
    
    // 4. Configure the checkout with event handlers
    checkout.on('CHECKOUT_COMPLETE', (data) => {
      console.log('Checkout completed successfully!', data);
      if (config.onComplete) {
        config.onComplete(data.payment);
      }
    });
    
    checkout.on('CHECKOUT_ERROR', (error, data) => {
      console.log('Checkout failed:', error, data);
      if (config.onError) {
        config.onError(error, data.payment);
      }
    });
    
    // 5. Initialize the payment method managers
    const { CardManager, ApplePayManager, GooglePayManager } = checkout.paymentMethods;
    
    // 6. Render the payment methods in the container
    // Render card form
    if (CardManager) {
      const cardManager = await CardManager.init();
      await cardManager.renderCardForm(`${config.containerId}-card`);
    }
    
    // Render Apple Pay if available and on supported device
    if (ApplePayManager && window.ApplePaySession && ApplePaySession.canMakePayments()) {
      const applePayManager = await ApplePayManager.init();
      await applePayManager.renderApplePayButton(`${config.containerId}-applepay`);
    }
    
    // Render Google Pay if available
    if (GooglePayManager) {
      const googlePayManager = await GooglePayManager.init();
      await googlePayManager.renderGooglePayButton(`${config.containerId}-googlepay`);
    }
    
    console.log("Primer checkout initialized successfully", checkout);
    
  } catch (error) {
    console.error("Error initializing Primer checkout:", error);
    throw error;
  }
};
