
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
 * Formats a primer component tag with its attributes based on component config
 */
export const formatPrimerComponent = (componentType: string, config?: { placeholder?: string; label?: string; }) => {
  const placeholder = config?.placeholder ? ` placeholder="${config.placeholder}"` : '';
  
  switch (componentType) {
    case 'card-number':
      return `<primer-input-card-number${placeholder}></primer-input-card-number>`;
    case 'card-expiry':
      return `<primer-input-card-expiry${placeholder}></primer-input-card-expiry>`;
    case 'card-cvv':
      return `<primer-input-cvv${placeholder}></primer-input-cvv>`;
    case 'card-holder':
      return `<primer-input-card-holder-name${placeholder}></primer-input-card-holder-name>`;
    case 'card-submit':
      return `<primer-card-form-submit style="height: 40px; width: 100%; font-weight: 500;"></primer-card-form-submit>`;
    default:
      return '';
  }
};

/**
 * Generates the Primer checkout HTML code based on the layout configuration
 */
export const generatePrimerCode = (rows: Row[], styleVariables: StyleVariables) => {
  // Find card components to generate appropriate layout
  let cardComponents = rows.flatMap(row => row.components);
  
  // Generate the card form content based on layout configuration
  let cardFormContent = '';
  
  // Process rows to build card form content
  for (const row of rows) {
    if (row.components.length === 0) continue;
    
    if (row.components.length === 1) {
      // Single component in row
      const component = row.components[0];
      cardFormContent += `          ${formatPrimerComponent(component.originalComponent.id, component.config)}\n`;
    } else if (row.components.length === 2) {
      // Two components side by side
      cardFormContent += `          <!-- Two components side by side -->\n`;
      cardFormContent += `          <div style="display: flex; gap: 16px;">\n`;
      cardFormContent += `            <div style="flex: 1;">\n`;
      cardFormContent += `              ${formatPrimerComponent(row.components[0].originalComponent.id, row.components[0].config)}\n`;
      cardFormContent += `            </div>\n`;
      cardFormContent += `            <div style="flex: 1;">\n`;
      cardFormContent += `              ${formatPrimerComponent(row.components[1].originalComponent.id, row.components[1].config)}\n`;
      cardFormContent += `            </div>\n`;
      cardFormContent += `          </div>\n`;
    } else {
      // More than two components
      cardFormContent += `          <!-- Multiple components in row -->\n`;
      cardFormContent += `          <div style="display: flex; gap: 16px;">\n`;
      for (const component of row.components) {
        cardFormContent += `            <div style="flex: 1;">\n`;
        cardFormContent += `              ${formatPrimerComponent(component.originalComponent.id, component.config)}\n`;
        cardFormContent += `            </div>\n`;
      }
      cardFormContent += `          </div>\n`;
    }
  }
  
  // If no components were added, use default layout
  if (!cardComponents.length) {
    cardFormContent = `          <primer-input-card-number placeholder="4444 3333 2222 1111"></primer-input-card-number>
          
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
          <primer-card-form-submit style="height: 40px; width: 100%; font-weight: 500;"></primer-card-form-submit>`;
  }
  
  // Generate the complete Primer checkout code
  return `<primer-checkout client-token="\${clientSession.clientToken}">
  <primer-main slot="main">
    <!-- Payment methods -->
    <div slot="payments">
      <!-- Card payment method -->
      <p class="text-base font-medium text-gray-700 mb-4">Card</p>
      <primer-card-form>
        <div slot="card-form-content" style="--primer-input-height: 40px; --primer-space-medium: 16px; display: flex; flex-direction: column; gap: 16px;">
${cardFormContent}
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
 * Generates specialized theme code for custom styling
 */
export const generateThemeStyles = (styleVariables: StyleVariables) => {
  const cssVariables = Object.entries(styleVariables)
    .filter(([_, value]) => value !== '')
    .map(([key, value]) => `  ${jsonToCssVariable[key as keyof typeof jsonToCssVariable]}: ${value};`)
    .join('\n');
  
  return `:root {
${cssVariables}
}`;
};

/**
 * Apply syntax highlighting to the code
 */
export const applyHighlighting = (code: string) => {
  return code.replace(/</g, '&lt;').replace(/>/g, '&gt;');
};
