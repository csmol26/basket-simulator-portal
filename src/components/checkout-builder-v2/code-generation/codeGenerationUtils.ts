import { Row, StyleVariables, CheckoutConfig } from '../types';
import { jsonToCssVariable } from '../StyleVarsEditor';

/**
 * Generates CSS code from style variables
 */
export const generateCSSCode = (styleVariables: StyleVariables) => {
  const cssVariables = Object.entries(styleVariables)
    .filter(([_, value]) => value !== '')
    .map(([key, value]) => `  ${jsonToCssVariable[key as keyof typeof jsonToCssVariable]}: ${value};`)
    .join('\n');
  
  return `:root {
${cssVariables}
}

/* Additional checkout styling */
.checkout-container {
  font-family: var(--primer-typography-brand);
  border-radius: var(--primer-radius-base);
  background-color: var(--primer-color-background);
  padding: calc(var(--primer-space-base) * 4);
}

.checkout-button {
  background-color: var(--primer-color-brand);
  color: white;
  border-radius: var(--primer-radius-base);
  padding: calc(var(--primer-space-base) * 2);
  cursor: pointer;
  border: none;
  font-weight: 500;
}

.checkout-input {
  border-radius: var(--primer-radius-base);
  padding: calc(var(--primer-space-base) * 2);
  border: 1px solid #e0e0e0;
  width: 100%;
}`;
};

/**
 * Formats a primer component tag with its attributes based on component config
 */
export const formatPrimerComponent = (componentType: string, config?: { 
  placeholder?: string; 
  label?: string; 
  ariaLabel?: string;
  buttonText?: string;
  variant?: string;
}) => {
  const placeholder = config?.placeholder ? ` placeholder="${config.placeholder}"` : '';
  const label = config?.label ? ` label="${config.label}"` : '';
  const ariaLabel = config?.ariaLabel ? ` aria-label="${config.ariaLabel}"` : '';
  const buttonText = config?.buttonText ? ` buttonText="${config.buttonText}"` : '';
  const variant = config?.variant ? ` variant="${config.variant}"` : '';
  
  switch (componentType) {
    case 'card-number':
      return `<primer-input-card-number${label}${placeholder}${ariaLabel}></primer-input-card-number>`;
    case 'card-expiry':
      return `<primer-input-card-expiry${label}${placeholder}${ariaLabel}></primer-input-card-expiry>`;
    case 'card-cvv':
      return `<primer-input-cvv${label}${placeholder}${ariaLabel}></primer-input-cvv>`;
    case 'card-holder':
      return `<primer-input-card-holder-name${label}${placeholder}${ariaLabel}></primer-input-card-holder-name>`;
    case 'card-submit':
      return `<primer-card-form-submit${buttonText}${variant} style="height: 40px; width: 100%; font-weight: 500;"></primer-card-form-submit>`;
    default:
      return '';
  }
};

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
 * Generates the Primer checkout HTML code based on the layout configuration
 */
export const generatePrimerCode = (cardFormRows: Row[], checkoutRows: Row[], styleVariables: StyleVariables, checkoutConfig: CheckoutConfig) => {
  let cardFormContent = '';
  
  for (const row of cardFormRows) {
    if (row.components.length === 0) continue;
    
    if (row.components.length === 1) {
      const component = row.components[0];
      cardFormContent += `          ${formatPrimerComponent(component.originalComponent.id, component.config)}\n`;
    } else if (row.components.length === 2) {
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
  
  if (!cardFormContent) {
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
  
  let apmContent = '';
  
  const hasAPMs = checkoutRows.some(row => 
    row.components.some(component => component.originalComponent.isAPM)
  );
  
  if (hasAPMs) {
    apmContent = `
      <!-- Alternative Payment Methods -->
      <div class="mt-8 pt-6 border-t border-gray-200">
        <p class="text-base font-medium text-gray-700 mb-4">Alternative Payment Methods</p>
        ${checkoutRows.map(row => 
          row.components
            .filter(component => component.originalComponent.isAPM)
            .map(component => `        <primer-payment-method type="${component.originalComponent.apmType}"></primer-payment-method>\n`)
            .join('')
        ).join('')}
      </div>`;
  }
  
  let layoutClass = '';
  
  switch (checkoutConfig.layout) {
    case 'multi-step':
      layoutClass = 'data-layout="stepped"';
      break;
    case 'single-page':
    default:
      layoutClass = '';
      break;
  }
  
  let paymentMethodsDisplay = '';
  
  switch (checkoutConfig.paymentMethodsDisplay) {
    case 'radio':
      paymentMethodsDisplay = 'data-payment-method-display="radio"';
      break;
    case 'buttons':
      paymentMethodsDisplay = 'data-payment-method-display="buttons"';
      break;
    case 'tabs':
      paymentMethodsDisplay = 'data-payment-method-display="tabs"';
      break;
    case 'dropdown':
    default:
      paymentMethodsDisplay = 'data-payment-method-display="dropdown"';
      break;
  }
  
  return `<primer-checkout 
  client-token="\${clientSession.clientToken}"
  ${layoutClass}
  ${paymentMethodsDisplay}
>
  <primer-main slot="main">
    <!-- Payment methods -->
    <div slot="payments">
      <!-- Card payment method -->
      <p class="text-base font-medium text-gray-700 mb-4">Card</p>
      <primer-card-form>
        <div slot="card-form-content" style="--primer-input-height: 40px; --primer-space-medium: 16px; display: flex; flex-direction: column; gap: 16px;">
${cardFormContent}
        </div>
      </primer-card-form>${apmContent}
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
 * Generates TypeScript code for Primer checkout integration
 */
export const generateTSCode = (checkoutConfig: CheckoutConfig) => {
  return `import { useEffect, useRef } from 'react';
import { createClientSession } from '@primer-io/checkout-web';

export default function CheckoutContainer() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    async function initializePrimer() {
      try {
        const response = await fetch('/api/create-session', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            amount: 1000,
            currencyCode: 'USD',
            ${checkoutConfig.layout === "multi-step" ? "isMultiStep: true," : ""}
            ${checkoutConfig.showCardholderName ? "showCardholderName: true," : "showCardholderName: false,"}
            onCheckoutComplete: (result) => {
              console.log('Payment completed!', result);
              window.location.href = '/confirmation?orderId=' + result.orderId;
            },
            onCheckoutFail: (error) => {
              console.error('Payment failed:', error);
            },
          }),
        });
        
        const clientSession = await response.json();
        
        if (containerRef.current) {
          const checkout = await createClientSession({
            clientToken: clientSession.clientToken,
            containerId: 'primer-payment-container',
            ${checkoutConfig.layout === "multi-step" ? "isMultiStep: true," : ""}
            ${checkoutConfig.showCardholderName ? "showCardholderName: true," : "showCardholderName: false,"}
            onCheckoutComplete: (result) => {
              console.log('Payment completed!', result);
              window.location.href = '/confirmation?orderId=' + result.orderId;
            },
            onCheckoutFail: (error) => {
              console.error('Payment failed:', error);
            },
          });
          
          console.log('Primer checkout initialized:', checkout);
        }
      } catch (error) {
        console.error('Failed to initialize Primer:', error);
      }
    }
    
    initializePrimer();
    
    return () => {
    };
  }, []);
  
  return (
    <div className="checkout-wrapper">
      <div id="primer-payment-container" ref={containerRef} 
        className="min-h-48 rounded-md border border-gray-200 p-4 transition-all">
        {/* Primer will render the checkout UI here */}
      </div>
    </div>
  );
}`;
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
