
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
    
    // 5. Create the primer checkout element structure with multiple payment methods
    // Added additional margin and border classes to create separation between card displays
    const checkoutHtml = `
      <primer-checkout client-token="${clientSession.clientToken}" custom-styles='{"primerTypographyBrand":"Poppins","primerTypographyBodyLargeFont":"Poppins","primerTypographyBodyMediumFont":"Poppins","primerTypographyBodySmallFont":"Poppins","primerTypographyTitleLargeFont":"Poppins"}'>
        <primer-main slot="main">
          <!-- Payment methods -->
          <div slot="payments">
            <!-- Card payment method display 1 -->
            <p class="text-base font-medium text-gray-700 mb-4">Card</p>
            <primer-card-form>
              <div slot="card-form-content">
              <primer-input-card-number placeholder="4444 3333 2222 1111"></primer-input-card-number>
              <primer-input-card-expiry placeholder="12/30"></primer-input-card-expiry>
              <primer-input-cvv placeholder="123"></primer-input-cvv>
              <primer-input-card-holder-name placeholder="Christophe Smol"></primer-input-card-holder-name>
              <primer-card-form-submit></primer-card-form-submit>
              </div>
            </primer-card-form>
            </primer-payment-method>
                        
            <!-- Added margin-top to create more space between payment methods -->
            <div class="mt-8 pt-6 border-t border-gray-200">
              <p class="text-base font-medium text-gray-700 mb-4">Alternative Payment Method</p>
              <primer-payment-method type="PAYPAL">
                <!-- PayPal payment method will be rendered automatically -->
              </primer-payment-method>
            </div>
          </div>
          
          <!-- Custom completion screen -->
          <div slot="checkout-complete">
            <h2 class="text-xl font-bold text-green-600 text-center my-4">Thank you for your purchase!</h2>
            <p class="text-center text-gray-600">Your order has been processed successfully.</p>
          </div>
        </primer-main>
      </primer-checkout>
    `;
    
    // Insert the checkout HTML directly
    container.innerHTML = checkoutHtml;
    
    // Get a reference to the checkout element to add event listeners
    const checkoutElement = container.querySelector('primer-checkout') as unknown as PrimerCheckoutElement;
    
    // Add event listeners to the checkout element
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
    
    // Add click event listener for the collapsible card form
    const toggleButton = container.querySelector('#toggle-card-form-2');
    const formContainer = container.querySelector('#card-form-2-container');
    
    if (toggleButton && formContainer) {
      toggleButton.addEventListener('click', () => {
        // Toggle the 'hidden' class to show/hide the form
        formContainer.classList.toggle('hidden');
        
        // Toggle the chevron icon direction
        const chevron = toggleButton.querySelector('.chevron-down');
        if (chevron) {
          if (formContainer.classList.contains('hidden')) {
            chevron.outerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="chevron-down">
              <path d="m6 9 6 6 6-6"/>
            </svg>`;
          } else {
            chevron.outerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="chevron-up">
              <path d="m18 15-6-6-6 6"/>
            </svg>`;
          }
        }
      });
    }
    
    console.log("Primer checkout initialized successfully");
    
  } catch (error) {
    console.error("Error initializing Primer checkout:", error);
    throw error;
  }
};
