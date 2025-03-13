
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Droppable, Draggable } from "react-beautiful-dnd";
import { Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Row, StyleVariables, CheckoutConfig, DragItem } from './types';
import { availableAPMs } from '@/hooks/useCheckoutBuilderV2';

interface CheckoutBuilderProps {
  checkoutRows: Row[];
  styleVariables: StyleVariables;
  onAddRow: () => void;
  onRemoveRow: (rowId: string) => void;
  updateComponentConfig: (rowId: string, componentId: string, config: Partial<DragItem['config']>) => void;
}

const CheckoutBuilder: React.FC<CheckoutBuilderProps> = ({ 
  checkoutRows, 
  styleVariables,
  onAddRow,
  onRemoveRow,
  updateComponentConfig
}) => {
  // Render a generic APM component in the palette
  const renderAPMPalette = () => (
    <Card className="mb-6">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Available Payment Methods</CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        <Droppable droppableId="apm-palette" isDropDisabled={true}>
          {(provided) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className="space-y-2 p-2 bg-gray-50 rounded-md border border-gray-200"
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
                      className={`p-3 bg-white rounded-md border border-gray-200 shadow-sm cursor-move transition-all duration-200
                        ${snapshot.isDragging ? 'scale-105 shadow-lg border-primary' : 'hover:border-accent hover:shadow-md'}`}
                      style={{
                        ...provided.draggableProps.style,
                        opacity: snapshot.isDragging ? 0.9 : 1,
                      }}
                    >
                      <div className="flex items-center">
                        <span className="font-medium">{apm.name}</span>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        <code>{apm.type}</code>
                      </div>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </CardContent>
    </Card>
  );

  // Render card form as a component that can be dragged
  const renderCardFormComponent = () => (
    <Card className="mb-6">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Card Form</CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        <Droppable droppableId="card-form-component" isDropDisabled={true}>
          {(provided) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className="p-2 bg-gray-50 rounded-md border border-gray-200"
            >
              <Draggable
                key="card-form-draggable"
                draggableId="card-form-draggable"
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
                    <div className="flex items-center">
                      <span className="font-medium">Card Payment Form</span>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      <code>PAYMENT_CARD</code>
                    </div>
                  </div>
                )}
              </Draggable>
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </CardContent>
    </Card>
  );

  // Render a component in the checkout builder
  const renderBuilderComponent = (component: DragItem, index: number, rowId: string) => (
    <Draggable
      key={component.id}
      draggableId={component.id}
      index={index}
    >
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`p-3 bg-white rounded-md border border-gray-200 shadow-sm flex-1 cursor-move transition-all duration-200
            ${snapshot.isDragging ? 'scale-105 shadow-lg border-primary' : 'hover:border-accent hover:shadow-md'}`}
          style={{
            ...provided.draggableProps.style,
            opacity: snapshot.isDragging ? 0.9 : 1,
          }}
        >
          <div className="flex items-center justify-between">
            <span className="font-medium">{component.originalComponent.name}</span>
          </div>
          <div className="text-xs text-gray-500 mt-1">
            {component.originalComponent.isAPM && (
              <code>{`<primer-payment-method type="${component.originalComponent.apmType}"></primer-payment-method>`}</code>
            )}
            {component.originalComponent.isCardForm && (
              <code>{`<primer-payment-method type="PAYMENT_CARD"></primer-payment-method>`}</code>
            )}
          </div>
        </div>
      )}
    </Draggable>
  );

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-lg">Checkout Builder</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left column for available payment methods */}
          <div className="lg:col-span-1 space-y-4">
            {renderAPMPalette()}
            {renderCardFormComponent()}

            <Droppable droppableId="checkout-trash">
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="p-4 bg-red-50 border border-red-200 rounded-md text-center flex items-center justify-center min-h-[80px]"
                >
                  <span className="text-red-500 text-sm">Drop here to remove</span>
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>
          
          {/* Right columns for checkout builder */}
          <div className="lg:col-span-2 space-y-4">
            <div className="space-y-4">
              {checkoutRows.map((row) => (
                <div key={row.id} className="relative border border-dashed border-gray-300 p-3 rounded-md">
                  <Droppable droppableId={row.id} direction="horizontal">
                    {(provided) => (
                      <div
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        className={`min-h-[60px] flex gap-2 ${row.components.length > 0 ? '' : 'justify-center items-center'}`}
                      >
                        {row.components.length === 0 && (
                          <span className="text-gray-400 text-sm">Drag payment methods or card form here</span>
                        )}
                        
                        {row.components.map((component, index) => (
                          renderBuilderComponent(component, index, row.id)
                        ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                  
                  {checkoutRows.length > 1 && (
                    <button
                      onClick={() => onRemoveRow(row.id)}
                      className="absolute -right-2 -top-2 w-5 h-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center"
                      title="Remove row"
                    >
                      <X size={12} />
                    </button>
                  )}
                </div>
              ))}

              <Button onClick={onAddRow} variant="outline" className="w-full flex items-center justify-center gap-1">
                <Plus size={16} /> Add Row
              </Button>
            </div>

            <Card className="mt-8 bg-gray-50">
              <CardContent className="pt-6">
                <h3 className="text-md font-medium mb-4">Checkout Layout Notes</h3>
                <ul className="list-disc list-inside text-sm text-gray-600 space-y-2">
                  <li>Drag payment methods from the left panel into rows.</li>
                  <li>Create multiple rows to organize payment methods vertically or horizontally.</li>
                  <li>The order of items determines the display order in the checkout.</li>
                  <li>You can place card form and APMs in any order you prefer.</li>
                  <li>Configure detailed card form appearance in the "Card Form" tab.</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CheckoutBuilder;
