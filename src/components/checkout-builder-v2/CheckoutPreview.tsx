
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Row, StyleVariables, CheckoutConfig } from './types';

interface CheckoutPreviewProps {
  rows: Row[];
  styleVariables: StyleVariables;
  checkoutConfig: CheckoutConfig;
  onDragEnd: (result: any) => void;
}

// Available APMs for the checkout
const availableAPMs = [
  { id: 'paypal', name: 'PayPal', type: 'PAYPAL' },
  { id: 'applepay', name: 'Apple Pay', type: 'APPLE_PAY' },
  { id: 'googlepay', name: 'Google Pay', type: 'GOOGLE_PAY' },
  { id: 'klarna', name: 'Klarna', type: 'KLARNA' },
  { id: 'ideal', name: 'iDEAL', type: 'IDEAL' },
  { id: 'sofort', name: 'Sofort', type: 'SOFORT' },
  { id: 'afterpay', name: 'Afterpay', type: 'AFTERPAY' },
];

const CheckoutPreview: React.FC<CheckoutPreviewProps> = ({ 
  rows, 
  styleVariables, 
  checkoutConfig,
  onDragEnd
}) => {
  // Simple placeholder for the card form
  const renderCardFormPlaceholder = () => (
    <div 
      className="bg-gray-100 rounded-md p-4 text-center border-2 border-dashed border-gray-300"
      style={{ borderRadius: styleVariables.primerRadiusBase }}
    >
      <div className="text-gray-500">Card Form</div>
      <div className="text-xs text-gray-400 mt-1">
        (Configured in Card Form Builder tab)
      </div>
    </div>
  );

  // Render a generic APM component
  const renderAPM = (apm: any, index: number) => (
    <Draggable draggableId={`apm-${apm.id}`} index={index} key={`apm-${apm.id}`}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className="bg-white p-3 rounded-md border shadow-sm mb-3 cursor-move"
          style={{ 
            borderRadius: styleVariables.primerRadiusBase,
            ...provided.draggableProps.style
          }}
        >
          <div className="flex items-center justify-between">
            <span className="font-medium">{apm.name}</span>
            <div className="text-xs text-gray-500">
              <code>{`<primer-payment-method type="${apm.type}"></primer-payment-method>`}</code>
            </div>
          </div>
        </div>
      )}
    </Draggable>
  );

  // Render APMs available for drag and drop
  const renderAPMPalette = () => (
    <div className="bg-gray-50 p-4 rounded-md">
      <h3 className="text-sm font-medium mb-3">Available Payment Methods</h3>
      <Droppable droppableId="apm-palette" isDropDisabled={true}>
        {(provided) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className="space-y-2"
          >
            {availableAPMs.map((apm, index) => (
              <Draggable
                key={`palette-${apm.id}`}
                draggableId={`palette-${apm.id}`}
                index={index}
              >
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    className={`p-2 bg-white rounded-md border border-gray-200 shadow-sm cursor-move transition-all duration-200
                      ${snapshot.isDragging ? 'scale-105 shadow-lg border-primary' : 'hover:border-accent hover:shadow-md'}`}
                    style={{
                      ...provided.draggableProps.style,
                      opacity: snapshot.isDragging ? 0.9 : 1,
                    }}
                  >
                    {apm.name}
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );

  return (
    <div className="space-y-8">
      <Tabs defaultValue="desktop">
        <Card>
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <CardTitle className="text-lg">Checkout Builder</CardTitle>
              <TabsList>
                <TabsTrigger value="desktop">Desktop</TabsTrigger>
                <TabsTrigger value="mobile">Mobile</TabsTrigger>
              </TabsList>
            </div>
          </CardHeader>
          
          <CardContent className="pt-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left column for available payment methods */}
              <div className="lg:col-span-1">
                {renderAPMPalette()}
              </div>
              
              {/* Center and right columns for preview */}
              <div className="lg:col-span-2">
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
                        {/* Card Form Placeholder */}
                        {renderCardFormPlaceholder()}
                        
                        {/* Drop zones for APMs */}
                        <div className="mt-6">
                          <h3 className="text-sm font-medium mb-3">Alternative Payment Methods</h3>
                          <Droppable droppableId="checkout-apms" direction="vertical">
                            {(provided) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.droppableProps}
                                className="min-h-[100px] border-2 border-dashed border-gray-300 rounded-md p-4"
                              >
                                {/* This will be populated with dragged APMs */}
                                {provided.placeholder}
                              </div>
                            )}
                          </Droppable>
                        </div>
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
                        {/* Card Form Placeholder */}
                        {renderCardFormPlaceholder()}
                        
                        {/* Drop zones for APMs */}
                        <div className="mt-4">
                          <h3 className="text-sm font-medium mb-2">Alternative Payment Methods</h3>
                          <Droppable droppableId="checkout-apms-mobile" direction="vertical">
                            {(provided) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.droppableProps}
                                className="min-h-[100px] border-2 border-dashed border-gray-300 rounded-md p-3"
                              >
                                {/* This will be populated with dragged APMs */}
                                {provided.placeholder}
                              </div>
                            )}
                          </Droppable>
                        </div>
                      </div>
                      
                      <div className="mt-6 text-center text-xs text-gray-500">
                        <p>Secured by Primer</p>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </div>
            </div>
          </CardContent>
        </Card>
      </Tabs>
      
      <Card>
        <CardContent className="pt-6">
          <h3 className="text-md font-medium mb-4">Usage Notes</h3>
          <ul className="list-disc list-inside text-sm text-gray-600 space-y-2">
            <li>Drag payment methods from the left panel into the checkout area.</li>
            <li>You can arrange APMs into rows or display them individually.</li>
            <li>In the generated code, APMs can be rendered generically (using a map) or individually for specific styling.</li>
            <li>Card form details are configured in the "Card Form" tab.</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default CheckoutPreview;
