
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
  let cardFormContent = rows.map(row => {
    if (row.components.length === 0) return '';
    
    if (row.components.length === 1) {
      const component = row.components[0];
      const config = component.config || {};
      
      const openingTagEnd = component.content.indexOf('>');
      const tagName = component.content.substring(1, openingTagEnd);
      
      const formattedTag = formatPrimerTag(tagName, {
        label: config.label,
        placeholder: config.placeholder,
        "aria-label": config.ariaLabel
      });
      
      return `              ${formattedTag}`;
    }
    
    else {
      return `              <div style="display: flex; gap: 16px;">
${row.components.map((comp) => {
  const config = comp.config || {};
  const spaceSmall = config.spaceSmall || styleVariables.primerSpaceSmall;
  
  const openingTagEnd = comp.content.indexOf('>');
  const tagName = comp.content.substring(1, openingTagEnd);
  
  const formattedTag = formatPrimerTag(tagName, {
    label: config.label,
    placeholder: config.placeholder,
    "aria-label": config.ariaLabel
  });
  
  return `                <div style="flex: 1; margin-bottom: ${spaceSmall};">
                  ${formattedTag}
                </div>`;
}).join('\n')}
              </div>`;
    }
  }).filter(content => content).join('\n');

  const checkoutHtml = `<primer-checkout client-token="\${clientSession.clientToken}">
  <primer-main slot="main">
    <!-- Payment methods -->
    <div slot="payments">
      <!-- Card payment method -->
      <p class="text-base font-medium text-gray-700 mb-4">Card</p>
      <primer-card-form>
        <div slot="card-form-content" 
             style="--primer-input-height: 40px; --primer-space-medium: 16px; 
                    display: flex; flex-direction: column; gap: 16px;">
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
