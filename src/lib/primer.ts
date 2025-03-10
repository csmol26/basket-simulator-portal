
import { createPrimerClientSession } from './api';
import { loadPrimer } from '@primer-io/primer-js';

// Define interfaces for Primer custom elements to help TypeScript
interface PrimerCheckoutElement extends HTMLElement {
  // Add any specific properties/methods of primer-checkout if needed
}

interface PrimerMainElement extends HTMLElement {
  // Add any specific properties/methods of primer-main if needed
}

interface PrimerPaymentMethodElement extends HTMLElement {
  // Add any specific properties/methods of primer-payment-method if needed
}

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
    
    // 5. Create the elements with proper TypeScript casting
    const checkoutElement = document.createElement('primer-checkout') as unknown as PrimerCheckoutElement;
    const mainElement = document.createElement('primer-main') as unknown as PrimerMainElement;
    const paymentsDiv = document.createElement('div');
    const cardPaymentMethod = document.createElement('primer-payment-method') as unknown as PrimerPaymentMethodElement;
    
    // 6. Set attributes using standard DOM methods
    checkoutElement.setAttribute('client-token', clientSession.clientToken);
    
    // Set options as a JSON string attribute with en-GB locale
    const options = {
      locale: "en-GB",
      card: {
        cardholderName: {
          required: true
        }
      }
    };
    
    checkoutElement.setAttribute('options', JSON.stringify(options));
    
    // 7. Configure the component hierarchy
    mainElement.setAttribute('slot', 'main');
    paymentsDiv.setAttribute('slot', 'payments');
    cardPaymentMethod.setAttribute('type', 'PAYMENT_CARD');
    
    // 8. Create default card form layout
    const cardFormHtml = `
      <primer-card-form>
        <div slot="card-form-content">
          <primer-input-card-number placeholder="Card number"></primer-input-card-number>
          <primer-input-card-expiry placeholder="MM/YY"></primer-input-card-expiry>
          <primer-input-cvv placeholder="CVV"></primer-input-cvv>
          <primer-input-card-holder-name placeholder="Name on card"></primer-input-card-holder-name>
          <button type="submit">Pay Now</button>
        </div>
      </primer-card-form>
    `;
    
    cardPaymentMethod.innerHTML = cardFormHtml;
    
    // 9. Assemble the components using DOM methods
    paymentsDiv.appendChild(cardPaymentMethod);
    mainElement.appendChild(paymentsDiv);
    checkoutElement.appendChild(mainElement);
    container.appendChild(checkoutElement);
    
    // 10. Add event listeners to the checkout element
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
