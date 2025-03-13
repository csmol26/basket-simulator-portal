
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { DragDropContext } from "react-beautiful-dnd";
import ComponentPalette from "./ComponentPalette";
import CardFormBuilder from "./CardFormBuilder";
import CheckoutPreview from "./CheckoutPreview";
import GeneratedCode from "./GeneratedCode";
import CheckoutLayoutConfig from "./CheckoutLayoutConfig";
import ThemeAndPreview from "./ThemeAndPreview";
import ComposableCheckoutSlots from "./ComposableCheckoutSlots";
import { useCheckoutBuilderV2 } from "@/hooks/useCheckoutBuilderV2";
import { Button } from "@/components/ui/button";
import { ClipboardCopy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const CheckoutBuilder: React.FC = () => {
  const [activeTab, setActiveTab] = useState("checkout-builder");
  const { toast } = useToast();
  
  const {
    rows: cardFormRows,
    checkoutRows,
    styleVariables,
    checkoutConfig,
    activeTheme,
    addRow,
    addCheckoutRow,
    removeRow,
    removeCheckoutRow,
    handleStyleChange,
    updateComponentConfig,
    updateCheckoutComponentConfig,
    updateCheckoutConfig,
    changeCardFormLayout,
    changePaymentMethodDisplay,
    toggleCardholderName,
    changeTheme,
    onDragEnd
  } = useCheckoutBuilderV2();

  // Generate the payment method HTML code
  const generatePaymentMethodsHtml = () => {
    let html = '<primer-checkout client-token="${clientSession.clientToken}">\n';
    html += '  <primer-main slot="main">\n';
    html += '    <!-- Payment methods -->\n';
    html += '    <div slot="payments">\n';
    
    // Check if any rows have components
    const hasComponents = checkoutRows.some(row => row.components.length > 0);
    
    if (hasComponents) {
      // Generate HTML for each payment method in each row
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
              
              // Generate the card form components based on cardFormRows
              if (cardFormRows.length > 0) {
                cardFormRows.forEach(cardRow => {
                  if (cardRow.components.length === 1) {
                    // Single component
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
                    // Multiple components in a row
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
                // Default card form if no components are defined
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
      // Default configuration if no components added
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

  const handleCopyCode = () => {
    const code = generatePaymentMethodsHtml();
    navigator.clipboard.writeText(code);
    toast({
      title: "Code copied",
      description: "HTML code has been copied to clipboard"
    });
  };

  return (
    <div className="container mx-auto px-4 py-6 max-w-screen-2xl">
      <DragDropContext onDragEnd={onDragEnd}>
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-2xl">Checkout Builder</CardTitle>
            <CardDescription>
              Design your perfect checkout experience with drag-and-drop components
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-4 mb-8">
                <TabsTrigger value="checkout-builder">Checkout Builder</TabsTrigger>
                <TabsTrigger value="card-form-builder">Card Form Builder</TabsTrigger>
                <TabsTrigger value="theme-preview">Theme & Preview</TabsTrigger>
                <TabsTrigger value="composable-slots">Composable Checkout Slots</TabsTrigger>
              </TabsList>
              
              <TabsContent value="checkout-builder" className="p-0">
                <div className="grid grid-cols-1 xl:grid-cols-[1fr_3fr] gap-6">
                  <div className="w-full space-y-6">
                    <ComponentPalette onAddRow={addCheckoutRow} />
                    <CheckoutLayoutConfig 
                      config={checkoutConfig}
                      onChangeCardFormLayout={changeCardFormLayout}
                      onChangePaymentMethodDisplay={changePaymentMethodDisplay}
                      onToggleCardholderName={toggleCardholderName}
                    />
                  </div>
                  
                  <div className="space-y-6">
                    <CheckoutPreview 
                      rows={checkoutRows} 
                      styleVariables={styleVariables}
                      checkoutConfig={checkoutConfig}
                      onDragEnd={onDragEnd}
                    />
                    
                    {/* Generated HTML Code for Checkout Builder */}
                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-md font-medium">
                          Generated HTML
                        </CardTitle>
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="h-8 gap-1"
                          onClick={handleCopyCode}
                        >
                          <ClipboardCopy className="h-3.5 w-3.5" />
                          <span>Copy</span>
                        </Button>
                      </CardHeader>
                      <CardContent>
                        <div className="relative">
                          <pre className="language-html rounded-md bg-slate-950 p-4 text-white text-sm overflow-x-auto">
                            <code dangerouslySetInnerHTML={{ __html: generatePaymentMethodsHtml().replace(/</g, '&lt;').replace(/>/g, '&gt;') }}></code>
                          </pre>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="card-form-builder" className="p-0">
                <CardFormBuilder 
                  rows={cardFormRows}
                  styleVariables={styleVariables}
                  addRow={addRow}
                  onRemoveRow={removeRow}
                  updateComponentConfig={updateComponentConfig}
                  onChangeLayout={changeCardFormLayout}
                  cardFormLayout={checkoutConfig.cardFormLayout}
                />
              </TabsContent>
              
              <TabsContent value="theme-preview" className="p-0">
                <ThemeAndPreview 
                  rows={checkoutRows}
                  cardFormRows={cardFormRows}
                  styleVariables={styleVariables}
                  checkoutConfig={checkoutConfig}
                  activeTheme={activeTheme}
                  onStyleChange={handleStyleChange}
                  onChangeTheme={changeTheme}
                />
              </TabsContent>
              
              <TabsContent value="composable-slots" className="p-0">
                <ComposableCheckoutSlots 
                  checkoutRows={checkoutRows}
                  cardFormRows={cardFormRows}
                  styleVariables={styleVariables}
                  checkoutConfig={checkoutConfig}
                />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
        
        <GeneratedCode 
          cardFormRows={cardFormRows}
          checkoutRows={checkoutRows}
          styleVariables={styleVariables}
          checkoutConfig={checkoutConfig}
        />
      </DragDropContext>
    </div>
  );
};

export default CheckoutBuilder;
