
import React from "react";
import { Row, StyleVariables, CheckoutConfig } from "./types";

interface CodeGeneratorProps {
  cardFormRows: Row[];
  checkoutRows: Row[];
  styleVariables: StyleVariables;
  checkoutConfig: CheckoutConfig;
}

export const generatePaymentMethodsHtml = (
  cardFormRows: Row[],
  checkoutRows: Row[],
  checkoutConfig: CheckoutConfig
): string => {
  let html = '<primer-checkout client-token="${clientSession.clientToken}">\n';
  html += '  <primer-main slot="main">\n';
  html += '    <!-- Payment methods -->\n';
  html += '    <div slot="payments">\n';
  
  const hasComponents = checkoutRows.some(row => row.components.length > 0);
  
  if (hasComponents) {
    checkoutRows.forEach((row, rowIndex) => {
      if (row.components.length > 0) {
        html += `      <!-- Slot ${rowIndex + 1} -->\n`;
        
        row.components.forEach(component => {
          if (component.originalComponent.isAPM) {
            html += `      <primer-payment-method type="${component.originalComponent.apmType}"></primer-payment-method>\n`;
          } else if (component.originalComponent.isCardForm) {
            html += '      <!-- Card Form Payment Method -->\n';
            html += '      <primer-payment-method type="PAYMENT_CARD">\n';
            html += '        <primer-card-form>\n';
            html += '          <div slot="card-form-content" style="--primer-input-height: 40px; --primer-space-medium: 16px; display: flex; flex-direction: column; gap: 16px;">\n';
            
            if (cardFormRows.length > 0) {
              cardFormRows.forEach(cardRow => {
                if (cardRow.components.length === 1) {
                  const cardComp = cardRow.components[0];
                  const componentId = cardComp.originalComponent.id;
                  const label = cardComp.config?.label ? ` label="${cardComp.config.label}"` : '';
                  const placeholder = cardComp.config?.placeholder ? ` placeholder="${cardComp.config.placeholder}"` : '';
                  
                  if (componentId === 'card-number') {
                    html += `            <primer-input-card-number${label}${placeholder}></primer-input-card-number>\n`;
                  } else if (componentId === 'card-expiry') {
                    html += `            <primer-input-card-expiry${label}${placeholder}></primer-input-card-expiry>\n`;
                  } else if (componentId === 'card-cvv') {
                    html += `            <primer-input-cvv${label}${placeholder}></primer-input-cvv>\n`;
                  } else if (componentId === 'card-holder') {
                    html += `            <primer-input-card-holder-name${label}${placeholder}></primer-input-card-holder-name>\n`;
                  } else if (componentId === 'card-submit') {
                    const btnText = cardComp.config?.buttonText ? ` buttonText="${cardComp.config.buttonText}"` : '';
                    const variant = cardComp.config?.variant ? ` variant="${cardComp.config.variant}"` : '';
                    html += `            <primer-card-form-submit${btnText}${variant} style="height: 40px; width: 100%; font-weight: 500;"></primer-card-form-submit>\n`;
                  }
                } else if (cardRow.components.length > 1) {
                  html += '            <div style="display: flex; gap: 16px;">\n';
                  
                  cardRow.components.forEach(cardComp => {
                    const componentId = cardComp.originalComponent.id;
                    const label = cardComp.config?.label ? ` label="${cardComp.config.label}"` : '';
                    const placeholder = cardComp.config?.placeholder ? ` placeholder="${cardComp.config.placeholder}"` : '';
                    
                    html += '              <div style="flex: 1;">\n';
                    
                    if (componentId === 'card-number') {
                      html += `                <primer-input-card-number${label}${placeholder}></primer-input-card-number>\n`;
                    } else if (componentId === 'card-expiry') {
                      html += `                <primer-input-card-expiry${label}${placeholder}></primer-input-card-expiry>\n`;
                    } else if (componentId === 'card-cvv') {
                      html += `                <primer-input-cvv${label}${placeholder}></primer-input-cvv>\n`;
                    } else if (componentId === 'card-holder') {
                      html += `                <primer-input-card-holder-name${label}${placeholder}></primer-input-card-holder-name>\n`;
                    } else if (componentId === 'card-submit') {
                      const btnText = cardComp.config?.buttonText ? ` buttonText="${cardComp.config.buttonText}"` : '';
                      const variant = cardComp.config?.variant ? ` variant="${cardComp.config.variant}"` : '';
                      html += `                <primer-card-form-submit${btnText}${variant} style="height: 40px; width: 100%; font-weight: 500;"></primer-card-form-submit>\n`;
                    }
                    
                    html += '              </div>\n';
                  });
                  
                  html += '            </div>\n';
                }
              });
            } else {
              html += '            <primer-input-card-number label="Card Number" placeholder="4444 3333 2222 1111"></primer-input-card-number>\n';
              html += '            <div style="display: flex; gap: 16px;">\n';
              html += '              <div style="flex: 1;">\n';
              html += '                <primer-input-card-expiry label="Expiry Date" placeholder="MM/YY"></primer-input-card-expiry>\n';
              html += '              </div>\n';
              html += '              <div style="flex: 1;">\n';
              html += '                <primer-input-cvv label="CVV" placeholder="123"></primer-input-cvv>\n';
              html += '              </div>\n';
              html += '            </div>\n';
              if (checkoutConfig.showCardholderName) {
                html += '            <primer-input-card-holder-name label="Cardholder Name" placeholder="John Smith"></primer-input-card-holder-name>\n';
              }
              html += '            <primer-card-form-submit buttonText="Pay" style="height: 40px; width: 100%; font-weight: 500;"></primer-card-form-submit>\n';
            }
            
            html += '          </div>\n';
            html += '        </primer-card-form>\n';
            html += '      </primer-payment-method>\n';
          }
        });
      }
    });
  } else {
    html += '      <!-- Default Payment Methods -->\n';
    html += '      <primer-payment-method type="PAYMENT_CARD">\n';
    html += '        <primer-card-form>\n';
    html += '          <div slot="card-form-content" style="--primer-input-height: 40px; --primer-space-medium: 16px; display: flex; flex-direction: column; gap: 16px;">\n';
    html += '            <primer-input-card-number label="Card Number" placeholder="4444 3333 2222 1111"></primer-input-card-number>\n';
    html += '            <div style="display: flex; gap: 16px;">\n';
    html += '              <div style="flex: 1;">\n';
    html += '                <primer-input-card-expiry label="Expiry Date" placeholder="MM/YY"></primer-input-card-expiry>\n';
    html += '              </div>\n';
    html += '              <div style="flex: 1;">\n';
    html += '                <primer-input-cvv label="CVV" placeholder="123"></primer-input-cvv>\n';
    html += '              </div>\n';
    html += '            </div>\n';
    if (checkoutConfig.showCardholderName) {
      html += '            <primer-input-card-holder-name label="Cardholder Name" placeholder="John Smith"></primer-input-card-holder-name>\n';
    }
    html += '            <primer-card-form-submit buttonText="Pay" style="height: 40px; width: 100%; font-weight: 500;"></primer-card-form-submit>\n';
    html += '          </div>\n';
    html += '        </primer-card-form>\n';
    html += '      </primer-payment-method>\n';
    html += '      <primer-payment-method type="PAYPAL"></primer-payment-method>\n';
  }
  
  html += '    </div>\n';
  html += '    <!-- Custom completion screen -->\n';
  html += '    <div slot="checkout-complete">\n';
  html += '      <h2 class="text-xl font-bold text-green-600 text-center my-4">Thank you for your purchase!</h2>\n';
  html += '      <p class="text-center text-gray-600">Your order has been processed successfully.</p>\n';
  html += '    </div>\n';
  html += '  </primer-main>\n';
  html += '</primer-checkout>';
  
  return html;
};

const CodeGenerator: React.FC<CodeGeneratorProps> = ({ 
  cardFormRows, 
  checkoutRows, 
  checkoutConfig 
}) => {
  return (
    <div className="code-generator">
      {/* This component doesn't render anything directly */}
    </div>
  );
};

export default CodeGenerator;
