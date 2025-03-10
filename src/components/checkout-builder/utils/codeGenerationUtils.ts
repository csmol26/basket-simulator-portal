
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
  // Instead of dynamically generating the card form content, we'll use the provided template
  // and only modify specific parts based on the configuration
  
  // Generate card form inputs based on the row configuration
  let cardFormContent = '';
  
  // Check if we have any components in our rows
  if (rows.some(row => row.components.length > 0)) {
    // Create the card number input
    const cardNumberComponent = rows.flatMap(r => r.components).find(comp => 
      comp.originalComponent?.id === "card-number"
    );
    
    if (cardNumberComponent) {
      const config = cardNumberComponent.config || {};
      cardFormContent += `          <primer-input-card-number${config.placeholder ? ` placeholder="${config.placeholder}"` : ''}></primer-input-card-number>\n          \n`;
    } else {
      cardFormContent += `          <primer-input-card-number placeholder="4444 3333 2222 1111"></primer-input-card-number>\n          \n`;
    }
    
    // Create the expiry and CVV row
    const expiryComponent = rows.flatMap(r => r.components).find(comp => 
      comp.originalComponent?.id === "card-expiry"
    );
    
    const cvvComponent = rows.flatMap(r => r.components).find(comp => 
      comp.originalComponent?.id === "card-cvv"
    );
    
    if (expiryComponent || cvvComponent) {
      cardFormContent += `          <!-- Expiry and CVV side by side -->\n`;
      cardFormContent += `          <div style="display: flex; gap: 16px;">\n`;
      
      // Add expiry component
      if (expiryComponent) {
        const expiryConfig = expiryComponent.config || {};
        cardFormContent += `            <div style="flex: 1;">\n`;
        cardFormContent += `              <primer-input-card-expiry${expiryConfig.placeholder ? ` placeholder="${expiryConfig.placeholder}"` : ' placeholder="12/30"'}></primer-input-card-expiry>\n`;
        cardFormContent += `            </div>\n`;
      }
      
      // Add CVV component
      if (cvvComponent) {
        const cvvConfig = cvvComponent.config || {};
        cardFormContent += `            <div style="flex: 1;">\n`;
        cardFormContent += `              <primer-input-cvv${cvvConfig.placeholder ? ` placeholder="${cvvConfig.placeholder}"` : ' placeholder="123"'}></primer-input-cvv>\n`;
        cardFormContent += `            </div>\n`;
      }
      
      cardFormContent += `          </div>\n          \n`;
    }
    
    // Add card holder name if present
    const cardHolderComponent = rows.flatMap(r => r.components).find(comp => 
      comp.originalComponent?.id === "card-holder"
    );
    
    if (cardHolderComponent) {
      const holderConfig = cardHolderComponent.config || {};
      cardFormContent += `          <primer-input-card-holder-name${holderConfig.placeholder ? ` placeholder="${holderConfig.placeholder}"` : ' placeholder="John Smith"'}></primer-input-card-holder-name>\n          \n`;
    }
    
    // Add submit button
    const submitComponent = rows.flatMap(r => r.components).find(comp => 
      comp.originalComponent?.id === "card-submit"
    );
    
    if (submitComponent || true) { // Always add submit button
      cardFormContent += `          <primer-card-form-submit style="height: 40px; width: 100%; font-weight: 500;"></primer-card-form-submit>\n`;
    }
  } else {
    // Use default layout
    cardFormContent = `          <primer-input-card-number placeholder="4444 3333 2222 1111"></primer-input-card-number>\n          
          <!-- Expiry and CVV side by side -->
          <div style="display: flex; gap: 16px;">
            <div style="flex: 1;">
              <primer-input-card-expiry placeholder="12/30"></primer-input-card-expiry>
            </div>
            <div style="flex: 1;">
              <primer-input-cvv placeholder="123"></primer-input-cvv>
            </div>
          </div>
          
          <primer-card-form-submit style="height: 40px; width: 100%; font-weight: 500;"></primer-card-form-submit>\n`;
  }

  const checkoutHtml = `<primer-checkout client-token="\${clientSession.clientToken}">
  <primer-main slot="main">
    <!-- Payment methods -->
    <div slot="payments">
      <!-- Card payment method -->
      <p class="text-base font-medium text-gray-700 mb-4">Card</p>
      <primer-card-form>
        <div slot="card-form-content" style="--primer-input-height: 40px; --primer-space-medium: 16px; display: flex; flex-direction: column; gap: 16px;">
${cardFormContent}        </div>
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
  
  return checkoutHtml;
};

/**
 * Apply syntax highlighting to the code
 */
export const applyHighlighting = (code: string) => {
  // Highlight HTML tags (<tag> and </tag>)
  let highlighted = code.replace(/<\/?([a-z0-9-]+)(?:\s|>)/gi, (match) => 
    `<span class="tag">${match}</span>`
  );
  
  // Highlight attributes (attribute=)
  highlighted = highlighted.replace(/\s([a-z0-9-]+)=/gi, (match) => 
    `<span class="attr-name">${match}</span>`
  );
  
  // Highlight attribute values ("value")
  highlighted = highlighted.replace(/"([^"]*)"/g, (match) => 
    `<span class="attr-value">${match}</span>`
  );
  
  // Highlight comments <!-- comment -->
  highlighted = highlighted.replace(/<!--([\s\S]*?)-->/g, (match) => 
    `<span class="comment">${match}</span>`
  );
  
  return highlighted;
};
