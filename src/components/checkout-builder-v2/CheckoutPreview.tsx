
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Row, StyleVariables, CheckoutConfig } from './types';

interface CheckoutPreviewProps {
  rows: Row[];
  styleVariables: StyleVariables;
  checkoutConfig: CheckoutConfig;
}

const CheckoutPreview: React.FC<CheckoutPreviewProps> = ({ rows, styleVariables, checkoutConfig }) => {
  // Helper to render custom card form layout
  const renderCardForm = () => {
    const cardNumberComponent = rows.flatMap(row => row.components).find(c => c.originalComponent.id === 'card-number');
    const cardExpiryComponent = rows.flatMap(row => row.components).find(c => c.originalComponent.id === 'card-expiry');
    const cardCvvComponent = rows.flatMap(row => row.components).find(c => c.originalComponent.id === 'card-cvv');
    const cardHolderComponent = rows.flatMap(row => row.components).find(c => c.originalComponent.id === 'card-holder');
    const submitComponent = rows.flatMap(row => row.components).find(c => c.originalComponent.id === 'card-submit');
    
    const layout = checkoutConfig.cardFormLayout;
    
    if (layout === 'single-line') {
      return (
        <div className="space-y-4">
          <div className="flex flex-wrap md:flex-nowrap gap-4">
            <div className="flex-grow min-w-[40%]">
              <div className="h-12 bg-gray-100 rounded-md px-4 py-3 text-gray-400 text-sm">
                {cardNumberComponent?.config?.placeholder || 'Card number'}
              </div>
            </div>
            <div className="w-24 md:w-32">
              <div className="h-12 bg-gray-100 rounded-md px-4 py-3 text-gray-400 text-sm">
                {cardExpiryComponent?.config?.placeholder || 'MM/YY'}
              </div>
            </div>
            <div className="w-24 md:w-32">
              <div className="h-12 bg-gray-100 rounded-md px-4 py-3 text-gray-400 text-sm">
                {cardCvvComponent?.config?.placeholder || 'CVV'}
              </div>
            </div>
          </div>
          
          {checkoutConfig.showCardholderName && (
            <div className="h-12 bg-gray-100 rounded-md px-4 py-3 text-gray-400 text-sm">
              {cardHolderComponent?.config?.placeholder || 'Cardholder name'}
            </div>
          )}
          
          <button 
            className="w-full h-12 px-4 py-3 rounded-md text-white"
            style={{ 
              backgroundColor: styleVariables.primerColorBrand || '#18A94B',
              borderRadius: styleVariables.primerRadiusBase
            }}
          >
            Pay Now
          </button>
        </div>
      );
    } else if (layout === 'two-line') {
      return (
        <div className="space-y-4">
          <div className="h-12 bg-gray-100 rounded-md px-4 py-3 text-gray-400 text-sm">
            {cardNumberComponent?.config?.placeholder || 'Card number'}
          </div>
          
          <div className="flex gap-4">
            <div className="flex-1 h-12 bg-gray-100 rounded-md px-4 py-3 text-gray-400 text-sm">
              {cardExpiryComponent?.config?.placeholder || 'MM/YY'}
            </div>
            <div className="flex-1 h-12 bg-gray-100 rounded-md px-4 py-3 text-gray-400 text-sm">
              {cardCvvComponent?.config?.placeholder || 'CVV'}
            </div>
          </div>
          
          {checkoutConfig.showCardholderName && (
            <div className="h-12 bg-gray-100 rounded-md px-4 py-3 text-gray-400 text-sm">
              {cardHolderComponent?.config?.placeholder || 'Cardholder name'}
            </div>
          )}
          
          <button 
            className="w-full h-12 px-4 py-3 rounded-md text-white"
            style={{ 
              backgroundColor: styleVariables.primerColorBrand || '#18A94B',
              borderRadius: styleVariables.primerRadiusBase
            }}
          >
            Pay Now
          </button>
        </div>
      );
    } else {
      // Default to three-line layout
      return (
        <div className="space-y-4">
          <div className="h-12 bg-gray-100 rounded-md px-4 py-3 text-gray-400 text-sm">
            {cardNumberComponent?.config?.placeholder || 'Card number'}
          </div>
          
          <div className="h-12 bg-gray-100 rounded-md px-4 py-3 text-gray-400 text-sm">
            {cardExpiryComponent?.config?.placeholder || 'MM/YY'}
          </div>
          
          <div className="h-12 bg-gray-100 rounded-md px-4 py-3 text-gray-400 text-sm">
            {cardCvvComponent?.config?.placeholder || 'CVV'}
          </div>
          
          {checkoutConfig.showCardholderName && (
            <div className="h-12 bg-gray-100 rounded-md px-4 py-3 text-gray-400 text-sm">
              {cardHolderComponent?.config?.placeholder || 'Cardholder name'}
            </div>
          )}
          
          <button 
            className="w-full h-12 px-4 py-3 rounded-md text-white"
            style={{ 
              backgroundColor: styleVariables.primerColorBrand || '#18A94B',
              borderRadius: styleVariables.primerRadiusBase
            }}
          >
            Pay Now
          </button>
        </div>
      );
    }
  };

  // Render payment methods based on display preference
  const renderPaymentMethods = () => {
    const display = checkoutConfig.paymentMethodsDisplay;
    
    if (display === 'radio') {
      return (
        <div className="space-y-4">
          <div className="p-4 border rounded-md flex items-center gap-3 bg-white">
            <div className="w-4 h-4 rounded-full border-2 border-gray-500 flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-gray-500"></div>
            </div>
            <span className="text-sm font-medium">Card Payment</span>
          </div>
          
          <div className="p-4 border rounded-md flex items-center gap-3 bg-white">
            <div className="w-4 h-4 rounded-full border-2 border-gray-300"></div>
            <span className="text-sm font-medium">PayPal</span>
          </div>
          
          <div className="p-4 border rounded-md flex items-center gap-3 bg-white">
            <div className="w-4 h-4 rounded-full border-2 border-gray-300"></div>
            <span className="text-sm font-medium">Apple Pay</span>
          </div>
        </div>
      );
    } else if (display === 'dropdown') {
      return (
        <div className="space-y-6">
          <div>
            <select className="w-full p-3 border rounded-md bg-white">
              <option>Card Payment</option>
              <option>PayPal</option>
              <option>Apple Pay</option>
            </select>
          </div>
          
          {renderCardForm()}
        </div>
      );
    } else if (display === 'buttons') {
      return (
        <div className="space-y-6">
          <div className="flex flex-wrap gap-2">
            <button 
              className={`px-4 py-2 rounded-md text-white`}
              style={{ 
                backgroundColor: styleVariables.primerColorBrand || '#18A94B',
                borderRadius: styleVariables.primerRadiusBase
              }}
            >
              Card Payment
            </button>
            <button className="px-4 py-2 rounded-md bg-gray-100 text-gray-700">
              PayPal
            </button>
            <button className="px-4 py-2 rounded-md bg-gray-100 text-gray-700">
              Apple Pay
            </button>
          </div>
          
          {renderCardForm()}
        </div>
      );
    } else {
      // Tabs
      return (
        <div className="space-y-6">
          <div className="border-b">
            <div className="flex">
              <div 
                className="px-4 py-2 border-b-2 font-medium text-sm"
                style={{ borderColor: styleVariables.primerColorBrand || '#18A94B' }}
              >
                Card Payment
              </div>
              <div className="px-4 py-2 text-gray-500 text-sm">
                PayPal
              </div>
              <div className="px-4 py-2 text-gray-500 text-sm">
                Apple Pay
              </div>
            </div>
          </div>
          
          {renderCardForm()}
        </div>
      );
    }
  };

  return (
    <div className="space-y-8">
      <Tabs defaultValue="desktop">
        <Card>
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <CardTitle className="text-lg">Checkout Preview</CardTitle>
              <TabsList>
                <TabsTrigger value="desktop">Desktop</TabsTrigger>
                <TabsTrigger value="mobile">Mobile</TabsTrigger>
              </TabsList>
            </div>
          </CardHeader>
          
          <CardContent className="pt-4">
            <TabsContent value="desktop">
              <div
                className="p-8 border rounded-lg shadow-sm"
                style={{
                  backgroundColor: styleVariables.primerColorBackground || 'white',
                  fontFamily: styleVariables.primerTypographyBrand,
                  borderRadius: styleVariables.primerRadiusBase
                }}
              >
                <div className="max-w-2xl mx-auto">
                  <h2 className="text-2xl font-semibold mb-6 text-center">Complete Your Purchase</h2>
                  
                  <div className="bg-gray-50 rounded-lg p-6">
                    {renderPaymentMethods()}
                  </div>
                  
                  <div className="mt-8 text-center text-xs text-gray-500">
                    <p>Secured by Primer</p>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="mobile">
              <div className="mx-auto" style={{ maxWidth: '375px' }}>
                <div
                  className="p-4 border rounded-lg shadow-sm"
                  style={{
                    backgroundColor: styleVariables.primerColorBackground || 'white',
                    fontFamily: styleVariables.primerTypographyBrand,
                    borderRadius: styleVariables.primerRadiusBase
                  }}
                >
                  <h2 className="text-xl font-semibold mb-4 text-center">Complete Your Purchase</h2>
                  
                  <div className="bg-gray-50 rounded-lg p-4">
                    {renderPaymentMethods()}
                  </div>
                  
                  <div className="mt-6 text-center text-xs text-gray-500">
                    <p>Secured by Primer</p>
                  </div>
                </div>
              </div>
            </TabsContent>
          </CardContent>
        </Card>
      </Tabs>
      
      <Card>
        <CardContent className="pt-6">
          <h3 className="text-md font-medium mb-4">Preview Notes</h3>
          <ul className="list-disc list-inside text-sm text-gray-600 space-y-2">
            <li>This is a visual representation of how your checkout may appear.</li>
            <li>The actual appearance might vary slightly based on the browser and device.</li>
            <li>Interactions like switching between payment methods are not functional in this preview.</li>
            <li>For the complete experience, download and implement the generated code.</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default CheckoutPreview;
