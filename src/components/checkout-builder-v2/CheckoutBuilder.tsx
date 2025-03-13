
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Row, StyleVariables, CheckoutConfig } from './types';
import DropRow from './card-form/DropRow';

interface CheckoutBuilderProps {
  rows: Row[];
  styleVariables: StyleVariables;
  checkoutConfig: CheckoutConfig;
  onAddRow: () => void;
  onRemoveRow: (rowId: string) => void;
  updateComponentConfig: (rowId: string, componentId: string, config: any) => void;
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

const CheckoutBuilder: React.FC<CheckoutBuilderProps> = ({ 
  rows, 
  styleVariables, 
  checkoutConfig,
  onAddRow,
  onRemoveRow,
  updateComponentConfig,
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
      
      {/* Card Form as a draggable component */}
      <div className="mt-6">
        <h3 className="text-sm font-medium mb-3">Card Form</h3>
        <Droppable droppableId="card-form-component" isDropDisabled={true}>
          {(provided) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
            >
              <Draggable
                draggableId="card-form-component"
                index={0}
              >
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    className={`p-3 bg-white rounded-md border border-gray-200 shadow-sm cursor-move transition-all duration-200
                      ${snapshot.isDragging ? 'scale-105 shadow-lg border-primary' : 'hover:border-accent hover:shadow-md'}`}
                    style={{
                      ...provided.draggableProps.style,
                      opacity: snapshot.isDragging ? 0.9 : 1,
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Card Form</span>
                      <div className="text-xs text-gray-500">
                        <code>{`<primer-payment-method type="PAYMENT_CARD"></primer-payment-method>`}</code>
                      </div>
                    </div>
                  </div>
                )}
              </Draggable>
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Checkout Builder</CardTitle>
        </CardHeader>
          
        <CardContent className="pt-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left column for available payment methods */}
            <div className="lg:col-span-1">
              {renderAPMPalette()}
            </div>
              
            {/* Right columns for checkout builder */}
            <div className="lg:col-span-2">
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-medium mb-3">Checkout Layout</h3>
                  <div className="space-y-3">
                    {rows.map((row) => (
                      <DropRow
                        key={row.id}
                        row={row}
                        onRemoveRow={onRemoveRow}
                        updateComponentConfig={updateComponentConfig}
                        styleVariables={styleVariables}
                        canRemove={rows.length > 1}
                      />
                    ))}
                  </div>
                  
                  <Button
                    onClick={onAddRow}
                    variant="outline"
                    size="sm"
                    className="mt-4 w-full flex items-center justify-center gap-1"
                  >
                    <Plus size={16} />
                    Add Row
                  </Button>
                </div>
                
                <div className="mt-6">
                  <h3 className="text-sm font-medium mb-2">Trash</h3>
                  <Droppable droppableId="checkout-trash" direction="horizontal">
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className="min-h-[60px] border-2 border-dashed border-red-300 p-3 rounded-md bg-red-50 flex items-center justify-center"
                      >
                        <span className="text-red-400 text-sm">Drag here to remove</span>
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="pt-6">
          <h3 className="text-md font-medium mb-4">Usage Notes</h3>
          <ul className="list-disc list-inside text-sm text-gray-600 space-y-2">
            <li>Drag payment methods from the left panel into the checkout rows.</li>
            <li>You can arrange APMs into rows or display them individually.</li>
            <li>Drag the Card Form component into your checkout layout.</li>
            <li>Card form details are configured in the "Card Form" tab.</li>
            <li>Generated code will include both generic and specific APM rendering examples.</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default CheckoutBuilder;
