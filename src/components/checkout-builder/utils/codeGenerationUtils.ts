
import { Row, StyleVariables } from "../types";
import { jsonToCssVariable } from "../StyleEditor";

/**
 * Generates React JSX code for the UI container that will hold the Primer checkout
 */
export const generateUICode = (styleVariables: StyleVariables) => {
  const variableString = Object.entries(styleVariables)
    .filter(([_, value]) => value !== '')
    .map(([key, value]) => `${jsonToCssVariable[key as keyof typeof jsonToCssVariable]}: ${value};`)
    .join('\n    ');
  
  return `<div id="primer-payment-container" ref={containerRef} 
  className="min-h-48 rounded-md border border-gray-200 p-4 transition-all duration-300 ease-in-out"
  style={{ ${variableString ? '\n    ' + variableString + '\n  ' : ''} }}
>
  {/* Primer checkout will be rendered here */}
</div>`;
};

/**
 * Formats a primer component tag with its attributes
 */
export const formatPrimerTag = (tagName: string, attributes: Record<string, string | undefined>) => {
  let attributeString = '';
  
  Object.entries(attributes).forEach(([key, value]) => {
    if (value) attributeString += ` ${key}="${value}"`;
  });
  
  return `<${tagName}${attributeString}></${tagName}>`;
};

/**
 * Generates the Primer checkout HTML code based on the layout configuration
 */
export const generatePrimerCode = (rows: Row[], styleVariables: StyleVariables) => {
  return `<primer-checkout client-token="\${clientSession.clientToken}">
  <primer-main slot="main">
    <!-- Payment methods -->
    <div slot="payments">
      <!-- Card payment method -->
      <p class="text-base font-medium text-gray-700 mb-4">Card</p>
      <primer-card-form>
        <div slot="card-form-content" style="--primer-input-height: 40px; --primer-space-medium: 16px; display: flex; flex-direction: column; gap: 16px;">
          <primer-input-card-number placeholder="4444 3333 2222 1111"></primer-input-card-number>
          
          <!-- Expiry and CVV side by side -->
          <div style="display: flex; gap: 16px;">
            <div style="flex: 1;">
              <primer-input-card-expiry placeholder="12/30"></primer-input-card-expiry>
            </div>
            <div style="flex: 1;">
              <primer-input-cvv placeholder="123"></primer-input-cvv>
            </div>
          </div>
          
          <primer-input-card-holder-name placeholder="John Smith"></primer-input-card-holder-name>
          <primer-card-form-submit style="height: 40px; width: 100%; font-weight: 500;"></primer-card-form-submit>
        </div>
      </primer-card-form>

      <!-- Alternative Payment Methods -->
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
</primer-checkout>`;
};

/**
 * Apply syntax highlighting to the code - removed for now as it was causing issues
 */
export const applyHighlighting = (code: string) => {
  // Return code without any highlighting for now to fix rendering issues
  return code;
};
