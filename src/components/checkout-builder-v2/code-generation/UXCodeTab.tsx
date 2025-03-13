
import React from 'react';
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import { toast } from "sonner";
import { Row, StyleVariables, CheckoutConfig } from '../types';

interface UXCodeTabProps {
  cardFormRows: Row[];
  checkoutRows: Row[];
  styleVariables: StyleVariables;
  checkoutConfig: CheckoutConfig;
}

const UXCodeTab: React.FC<UXCodeTabProps> = ({ 
  cardFormRows,
  checkoutRows,
  styleVariables,
  checkoutConfig
}) => {
  const generateUXCode = () => {
    // Generate card form content based on rows
    let cardFormContent = '';
    
    for (const row of cardFormRows) {
      if (row.components.length === 0) continue;
      
      if (row.components.length === 1) {
        const component = row.components[0];
        const componentType = component.originalComponent.id;
        const placeholder = component.config?.placeholder ? ` placeholder="${component.config.placeholder}"` : '';
        const label = component.config?.label ? ` label="${component.config.label}"` : '';
        
        switch (componentType) {
          case 'card-number':
            cardFormContent += `                <primer-input-card-number${label}${placeholder}></primer-input-card-number>\n`;
            break;
          case 'card-expiry':
            cardFormContent += `                <primer-input-card-expiry${label}${placeholder}></primer-input-card-expiry>\n`;
            break;
          case 'card-cvv':
            cardFormContent += `                <primer-input-cvv${label}${placeholder}></primer-input-cvv>\n`;
            break;
          case 'card-holder':
            cardFormContent += `                <primer-input-card-holder-name${label}${placeholder}></primer-input-card-holder-name>\n`;
            break;
          case 'card-submit':
            const buttonText = component.config?.buttonText ? ` buttonText="${component.config.buttonText}"` : '';
            const variant = component.config?.variant ? ` variant="${component.config.variant}"` : '';
            cardFormContent += `                <primer-card-form-submit${buttonText}${variant} style="height: 40px; width: 100%; font-weight: 500;"></primer-card-form-submit>\n`;
            break;
        }
      } else if (row.components.length > 1) {
        cardFormContent += `                <div style="display: flex; gap: 16px;">\n`;
        
        for (const component of row.components) {
          const componentType = component.originalComponent.id;
          const placeholder = component.config?.placeholder ? ` placeholder="${component.config.placeholder}"` : '';
          const label = component.config?.label ? ` label="${component.config.label}"` : '';
          
          cardFormContent += `                  <div style="flex: 1;">\n`;
          
          switch (componentType) {
            case 'card-number':
              cardFormContent += `                    <primer-input-card-number${label}${placeholder}></primer-input-card-number>\n`;
              break;
            case 'card-expiry':
              cardFormContent += `                    <primer-input-card-expiry${label}${placeholder}></primer-input-card-expiry>\n`;
              break;
            case 'card-cvv':
              cardFormContent += `                    <primer-input-cvv${label}${placeholder}></primer-input-cvv>\n`;
              break;
            case 'card-holder':
              cardFormContent += `                    <primer-input-card-holder-name${label}${placeholder}></primer-input-card-holder-name>\n`;
              break;
            case 'card-submit':
              const buttonText = component.config?.buttonText ? ` buttonText="${component.config.buttonText}"` : '';
              const variant = component.config?.variant ? ` variant="${component.config.variant}"` : '';
              cardFormContent += `                    <primer-card-form-submit${buttonText}${variant} style="height: 40px; width: 100%; font-weight: 500;"></primer-card-form-submit>\n`;
              break;
          }
          
          cardFormContent += `                  </div>\n`;
        }
        
        cardFormContent += `                </div>\n`;
      }
    }
    
    // If no card form content, use a default layout
    if (!cardFormContent) {
      cardFormContent = `                <primer-input-card-number placeholder="4444 3333 2222 1111"></primer-input-card-number>
                
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
    
    // Generate APM sections if any
    let apmSections = '';
    const hasAPMs = checkoutRows.some(row => 
      row.components.some(component => component.originalComponent.isAPM)
    );
    
    if (hasAPMs) {
      apmSections += `
        <div class="mt-8 pt-6 border-t border-gray-200">
          <p class="text-base font-medium text-gray-700 mb-4">Alternative Payment Methods</p>`;
          
      // Add each APM
      checkoutRows.forEach(row => {
        row.components.forEach(component => {
          if (component.originalComponent.isAPM) {
            apmSections += `
          <primer-payment-method type="${component.originalComponent.apmType}"></primer-payment-method>`;
          }
        });
      });
      
      apmSections += `
        </div>`;
    }
    
    // Generate the complete UX code
    let layoutAttribute = '';
    if (checkoutConfig.layout === 'multi-step') {
      layoutAttribute = ' data-layout="stepped"';
    }
    
    let methodDisplayAttribute = '';
    switch (checkoutConfig.paymentMethodsDisplay) {
      case 'radio':
        methodDisplayAttribute = ' data-payment-method-display="radio"';
        break;
      case 'buttons':
        methodDisplayAttribute = ' data-payment-method-display="buttons"';
        break;
      case 'tabs':
        methodDisplayAttribute = ' data-payment-method-display="tabs"';
        break;
      case 'dropdown':
        methodDisplayAttribute = ' data-payment-method-display="dropdown"';
        break;
    }
    
    return `<primer-checkout client-token="\${clientToken}"${layoutAttribute}${methodDisplayAttribute}>
  <primer-main slot="main">
    <!-- Payment methods -->
    <div slot="payments">
      <!-- Card payment method -->
      <p class="text-base font-medium text-gray-700 mb-4">Card</p>
      <primer-card-form>
        <div slot="card-form-content" style="--primer-input-height: 40px; --primer-space-medium: 16px; display: flex; flex-direction: column; gap: 16px;">
${cardFormContent}
        </div>
      </primer-card-form>${apmSections}
    </div>
    
    <!-- Custom completion screen -->
    <div slot="checkout-complete">
      <h2 class="text-xl font-bold text-green-600 text-center my-4">Thank you for your purchase!</h2>
      <p class="text-center text-gray-600">Your order has been processed successfully.</p>
    </div>
  </primer-main>
</primer-checkout>`;
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generateUXCode());
    toast.success('UX code copied to clipboard!');
  };

  return (
    <div className="relative mt-4 p-4 rounded-md bg-gray-900 text-gray-200 overflow-auto max-h-[500px]">
      <Button 
        variant="outline" 
        size="sm" 
        className="absolute top-2 right-2 bg-gray-800 hover:bg-gray-700 text-white"
        onClick={copyToClipboard}
      >
        <Copy size={16} />
      </Button>
      <pre className="text-sm">
        <code>{generateUXCode()}</code>
      </pre>
    </div>
  );
};

export default UXCodeTab;
