
import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import { DragDropContext, Droppable, Draggable, DropResult } from "react-beautiful-dnd";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Trash2, MoveVertical, Type, CreditCard, LayoutGrid } from "lucide-react";
import { v4 as uuidv4 } from 'uuid';
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

// Define types for our drag and drop items
interface PaymentMethod {
  id: string;
  type: string;
  name: string;
}

interface CheckoutSlot {
  id: string;
  name: string;
  items: PaymentMethod[];
}

// Card Form Builder types
interface CardFormComponent {
  id: string;
  type: string;
  name: string;
  element: string;
  placeholder?: string;
  label?: string;
}

interface CardFormRow {
  id: string;
  components: CardFormComponent[];
}

const PerfectCheckout: React.FC = () => {
  // State for active tab
  const [activeTab, setActiveTab] = useState<string>("checkout-builder");

  // Available payment methods
  const availablePaymentMethods: PaymentMethod[] = [
    { id: 'card', type: 'PAYMENT_CARD', name: 'Credit Card' },
    { id: 'paypal', type: 'PAYPAL', name: 'PayPal' },
    { id: 'applepay', type: 'APPLE_PAY', name: 'Apple Pay' },
    { id: 'googlepay', type: 'GOOGLE_PAY', name: 'Google Pay' },
    { id: 'klarna', type: 'KLARNA', name: 'Klarna' },
    { id: 'ideal', type: 'IDEAL', name: 'iDEAL' },
    { id: 'sofort', type: 'SOFORT', name: 'Sofort' },
  ];

  // State for checkout slots
  const [slots, setSlots] = useState<CheckoutSlot[]>([
    { id: 'slot-1', name: 'Card Payment', items: [] }
  ]);

  // State for card form components
  const [cardFormRows, setCardFormRows] = useState<CardFormRow[]>([
    { id: 'row-1', components: [] }
  ]);

  // Available card form components
  const availableCardComponents: CardFormComponent[] = [
    { 
      id: 'card-number', 
      type: 'card-number', 
      name: 'Card Number',
      element: '<primer-input-card-number></primer-input-card-number>',
      placeholder: '4111 1111 1111 1111',
      label: 'Card Number'
    },
    { 
      id: 'card-expiry', 
      type: 'card-expiry', 
      name: 'Expiry Date',
      element: '<primer-input-card-expiry></primer-input-card-expiry>',
      placeholder: 'MM/YY',
      label: 'Expiry Date'
    },
    { 
      id: 'card-cvv', 
      type: 'card-cvv', 
      name: 'CVV',
      element: '<primer-input-cvv></primer-input-cvv>',
      placeholder: '123',
      label: 'CVV'
    },
    { 
      id: 'card-holder', 
      type: 'card-holder', 
      name: 'Cardholder Name',
      element: '<primer-input-card-holder-name></primer-input-card-holder-name>',
      placeholder: 'John Smith',
      label: 'Cardholder Name'
    },
    { 
      id: 'card-submit', 
      type: 'card-submit', 
      name: 'Submit Button',
      element: '<primer-card-form-submit></primer-card-form-submit>' 
    }
  ];

  // Handle adding a new slot
  const addSlot = () => {
    setSlots([...slots, { id: `slot-${uuidv4()}`, name: `Payment Option ${slots.length + 1}`, items: [] }]);
  };

  // Handle removing a slot
  const removeSlot = (slotId: string) => {
    if (slots.length > 1) {
      setSlots(slots.filter(slot => slot.id !== slotId));
    }
  };

  // Handle slot name change
  const handleSlotNameChange = (slotId: string, newName: string) => {
    setSlots(slots.map(slot => 
      slot.id === slotId ? { ...slot, name: newName } : slot
    ));
  };

  // Handle adding a new card form row
  const addCardFormRow = () => {
    setCardFormRows([...cardFormRows, { id: `row-${uuidv4()}`, components: [] }]);
  };

  // Handle removing a card form row
  const removeCardFormRow = (rowId: string) => {
    if (cardFormRows.length > 1) {
      setCardFormRows(cardFormRows.filter(row => row.id !== rowId));
    }
  };

  // Handle drag end
  const onDragEnd = (result: DropResult) => {
    const { source, destination } = result;

    // If dropped outside a droppable area
    if (!destination) return;

    // If dropped in the same position
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) return;

    // Handle drag and drop for Checkout Builder
    if (activeTab === "checkout-builder") {
      // If dragging from payment methods to a slot
      if (source.droppableId === 'payment-methods') {
        const method = availablePaymentMethods[source.index];
        const newMethod = { ...method, id: `${method.id}-${uuidv4()}` };
        
        const newSlots = [...slots];
        const destSlot = newSlots.find(slot => slot.id === destination.droppableId);
        
        if (destSlot) {
          destSlot.items.splice(destination.index, 0, newMethod);
          setSlots(newSlots);
        }
      }
      // If dragging between slots
      else if (source.droppableId.startsWith('slot-') && destination.droppableId.startsWith('slot-')) {
        const newSlots = [...slots];
        const sourceSlot = newSlots.find(slot => slot.id === source.droppableId);
        const destSlot = newSlots.find(slot => slot.id === destination.droppableId);
        
        if (sourceSlot && destSlot) {
          const [removed] = sourceSlot.items.splice(source.index, 1);
          destSlot.items.splice(destination.index, 0, removed);
          setSlots(newSlots);
        }
      }
      // If dragging to the trash
      else if (destination.droppableId === 'trash' && source.droppableId.startsWith('slot-')) {
        const newSlots = [...slots];
        const sourceSlot = newSlots.find(slot => slot.id === source.droppableId);
        
        if (sourceSlot) {
          sourceSlot.items.splice(source.index, 1);
          setSlots(newSlots);
        }
      }
    }
    // Handle drag and drop for Card Form Builder
    else if (activeTab === "card-form-builder") {
      // If dragging from card components to a row
      if (source.droppableId === 'card-components') {
        const component = availableCardComponents[source.index];
        const newComponent = { 
          ...component, 
          id: `${component.id}-${uuidv4()}` 
        };
        
        const newRows = [...cardFormRows];
        const destRow = newRows.find(row => row.id === destination.droppableId);
        
        if (destRow) {
          destRow.components.splice(destination.index, 0, newComponent);
          setCardFormRows(newRows);
        }
      }
      // If dragging between rows
      else if (source.droppableId.startsWith('row-') && destination.droppableId.startsWith('row-')) {
        const newRows = [...cardFormRows];
        const sourceRow = newRows.find(row => row.id === source.droppableId);
        const destRow = newRows.find(row => row.id === destination.droppableId);
        
        if (sourceRow && destRow) {
          const [removed] = sourceRow.components.splice(source.index, 1);
          destRow.components.splice(destination.index, 0, removed);
          setCardFormRows(newRows);
        }
      }
      // If dragging to the card-trash
      else if (destination.droppableId === 'card-trash' && source.droppableId.startsWith('row-')) {
        const newRows = [...cardFormRows];
        const sourceRow = newRows.find(row => row.id === source.droppableId);
        
        if (sourceRow) {
          sourceRow.components.splice(source.index, 1);
          setCardFormRows(newRows);
        }
      }
    }
  };

  // Generate HTML code preview for card form
  const generateCardFormHTML = () => {
    let html = '<primer-card-form>\n';
    html += '  <div slot="card-form-content" style="display: flex; flex-direction: column; gap: 16px;">\n';
    
    cardFormRows.forEach(row => {
      if (row.components.length === 0) return;

      if (row.components.length === 1) {
        // Single component
        const component = row.components[0];
        html += `    ${component.element}\n`;
      } else {
        // Multiple components in a row
        html += '    <div style="display: flex; gap: 16px;">\n';
        row.components.forEach(component => {
          html += `      <div style="flex: 1;">\n`;
          html += `        ${component.element}\n`;
          html += `      </div>\n`;
        });
        html += '    </div>\n';
      }
    });
    
    html += '  </div>\n';
    html += '</primer-card-form>';
    
    return html;
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 max-w-6xl mx-auto w-full px-4 py-8 md:px-6">
        <h1 className="text-3xl font-bold mb-6">Build Your Perfect Checkout</h1>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="checkout-builder" className="flex items-center gap-2">
              <LayoutGrid className="h-4 w-4" />
              Checkout Builder
            </TabsTrigger>
            <TabsTrigger value="card-form-builder" className="flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              Card Form Builder
            </TabsTrigger>
          </TabsList>
          
          {/* Checkout Builder Tab */}
          <TabsContent value="checkout-builder">
            <DragDropContext onDragEnd={onDragEnd}>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Payment Methods Panel */}
                <div className="lg:col-span-1">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Payment Methods</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Droppable droppableId="payment-methods" isDropDisabled={false}>
                        {(provided) => (
                          <div 
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                            className="space-y-2"
                          >
                            {availablePaymentMethods.map((method, index) => (
                              <Draggable key={method.id} draggableId={method.id} index={index}>
                                {(provided, snapshot) => (
                                  <div
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                    className={`p-3 bg-white rounded-md border border-gray-200 shadow-sm flex items-center justify-between transition-all duration-200
                                      ${snapshot.isDragging ? 'scale-105 shadow-lg border-primary' : 'hover:border-accent hover:shadow-md'}`}
                                  >
                                    <span className="font-medium">{method.name}</span>
                                    <code className="text-xs text-gray-500">{method.type}</code>
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
                </div>
                
                {/* Checkout Builder Area */}
                <div className="lg:col-span-2">
                  <Card className="mb-6">
                    <CardHeader>
                      <CardTitle className="text-lg">Checkout Layout</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {slots.map((slot, index) => (
                          <div 
                            key={slot.id} 
                            className="relative border border-dashed border-gray-300 p-4 rounded-md bg-gray-50"
                          >
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <MoveVertical className="h-4 w-4 text-gray-500" />
                                <span className="text-sm font-medium text-gray-600">Slot {index + 1}</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <div className="flex items-center space-x-1">
                                  <Type className="h-4 w-4 text-gray-500" />
                                  <Input
                                    value={slot.name}
                                    onChange={(e) => handleSlotNameChange(slot.id, e.target.value)}
                                    className="h-7 px-2 text-sm max-w-[200px]"
                                    placeholder="Slot name"
                                  />
                                </div>
                                {slots.length > 1 && (
                                  <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    className="h-6 w-6 text-red-500 hover:text-red-700 hover:bg-red-50"
                                    onClick={() => removeSlot(slot.id)}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                )}
                              </div>
                            </div>
                            
                            <Droppable droppableId={slot.id} direction="horizontal">
                              {(provided) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.droppableProps}
                                  className={`min-h-[100px] rounded-md flex gap-2 items-center p-3 bg-white border border-gray-200
                                    ${slot.items.length === 0 ? 'justify-center' : 'flex-wrap'}`}
                                >
                                  {slot.items.length === 0 && (
                                    <p className="text-gray-400 text-sm italic">Drop payment methods here</p>
                                  )}
                                  
                                  {slot.items.map((item, index) => (
                                    <Draggable key={item.id} draggableId={item.id} index={index}>
                                      {(provided, snapshot) => (
                                        <div
                                          ref={provided.innerRef}
                                          {...provided.draggableProps}
                                          {...provided.dragHandleProps}
                                          className={`p-2 bg-white border border-gray-200 rounded-md shadow-sm cursor-move hover:border-accent
                                            ${snapshot.isDragging ? 'shadow-lg border-primary' : ''}`}
                                        >
                                          {item.name}
                                        </div>
                                      )}
                                    </Draggable>
                                  ))}
                                  {provided.placeholder}
                                </div>
                              )}
                            </Droppable>
                          </div>
                        ))}
                        
                        <Button 
                          onClick={addSlot} 
                          variant="outline" 
                          className="w-full flex items-center justify-center gap-2"
                        >
                          <Plus className="h-4 w-4" />
                          Add Slot
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                  
                  {/* Trash Zone */}
                  <Card>
                    <CardContent className="p-4">
                      <Droppable droppableId="trash">
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                            className="min-h-[60px] border-2 border-dashed border-red-300 p-3 rounded-md bg-red-50 flex items-center justify-center"
                          >
                            <Trash2 className="h-5 w-5 text-red-400 mr-2" />
                            <span className="text-red-400 text-sm">Drag here to remove items</span>
                            {provided.placeholder}
                          </div>
                        )}
                      </Droppable>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </DragDropContext>
          </TabsContent>
          
          {/* Card Form Builder Tab */}
          <TabsContent value="card-form-builder">
            <DragDropContext onDragEnd={onDragEnd}>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Card Components Panel */}
                <div className="lg:col-span-1">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Card Form Components</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Droppable droppableId="card-components" isDropDisabled={false}>
                        {(provided) => (
                          <div 
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                            className="space-y-2"
                          >
                            {availableCardComponents.map((component, index) => (
                              <Draggable key={component.id} draggableId={component.id} index={index}>
                                {(provided, snapshot) => (
                                  <div
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                    className={`p-3 bg-white rounded-md border border-gray-200 shadow-sm flex items-center justify-between transition-all duration-200
                                      ${snapshot.isDragging ? 'scale-105 shadow-lg border-primary' : 'hover:border-accent hover:shadow-md'}`}
                                  >
                                    <span className="font-medium">{component.name}</span>
                                    <code className="text-xs text-gray-500">{component.type}</code>
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
                </div>
                
                {/* Card Form Builder Area */}
                <div className="lg:col-span-2">
                  <Card className="mb-6">
                    <CardHeader>
                      <CardTitle className="text-lg">Card Form Layout</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {cardFormRows.map((row, index) => (
                          <div 
                            key={row.id} 
                            className="relative border border-dashed border-gray-300 p-4 rounded-md bg-gray-50"
                          >
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <MoveVertical className="h-4 w-4 text-gray-500" />
                                <span className="text-sm font-medium text-gray-600">Row {index + 1}</span>
                              </div>
                              {cardFormRows.length > 1 && (
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  className="h-6 w-6 text-red-500 hover:text-red-700 hover:bg-red-50"
                                  onClick={() => removeCardFormRow(row.id)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              )}
                            </div>
                            
                            <Droppable droppableId={row.id} direction="horizontal">
                              {(provided) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.droppableProps}
                                  className={`min-h-[100px] rounded-md flex gap-2 items-center p-3 bg-white border border-gray-200
                                    ${row.components.length === 0 ? 'justify-center' : 'flex-wrap'}`}
                                >
                                  {row.components.length === 0 && (
                                    <p className="text-gray-400 text-sm italic">Drop card components here</p>
                                  )}
                                  
                                  {row.components.map((component, index) => (
                                    <Draggable key={component.id} draggableId={component.id} index={index}>
                                      {(provided, snapshot) => (
                                        <div
                                          ref={provided.innerRef}
                                          {...provided.draggableProps}
                                          {...provided.dragHandleProps}
                                          className={`p-2 bg-white border border-gray-200 rounded-md shadow-sm cursor-move hover:border-accent flex-1
                                            ${snapshot.isDragging ? 'shadow-lg border-primary' : ''}`}
                                        >
                                          {component.name}
                                        </div>
                                      )}
                                    </Draggable>
                                  ))}
                                  {provided.placeholder}
                                </div>
                              )}
                            </Droppable>
                          </div>
                        ))}
                        
                        <Button 
                          onClick={addCardFormRow} 
                          variant="outline" 
                          className="w-full flex items-center justify-center gap-2"
                        >
                          <Plus className="h-4 w-4" />
                          Add Row
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                  
                  {/* Card Form Preview */}
                  <Card className="mb-6">
                    <CardHeader>
                      <CardTitle className="text-lg">Card Form Preview</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="bg-white border border-gray-200 rounded-md p-6">
                        <h2 className="text-lg font-semibold mb-4">Card Payment Form</h2>
                        <div className="card-form-preview space-y-4">
                          {cardFormRows.map((row) => (
                            <div key={row.id} className={`flex gap-4 ${row.components.length > 0 ? 'items-center' : ''}`}>
                              {row.components.length === 0 ? (
                                <p className="text-gray-400 text-sm italic w-full">Empty row</p>
                              ) : row.components.map((component) => (
                                <div key={component.id} className="flex-1">
                                  <div className="text-sm font-medium text-gray-700 mb-1">{component.label || component.name}</div>
                                  {component.type === 'card-submit' ? (
                                    <button className="w-full bg-primary text-white rounded-md py-2 px-4 text-sm font-medium">
                                      Pay Now
                                    </button>
                                  ) : (
                                    <div className="h-10 px-3 py-2 rounded-md border border-gray-300 text-sm text-gray-500 bg-gray-50">
                                      {component.placeholder || component.name}
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  {/* Generated HTML Code */}
                  <Card className="mb-6">
                    <CardHeader>
                      <CardTitle className="text-lg">Generated HTML</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <pre className="bg-gray-900 text-gray-100 p-4 rounded-md overflow-x-auto text-xs">
                        <code>
                          {generateCardFormHTML()}
                        </code>
                      </pre>
                    </CardContent>
                  </Card>
                  
                  {/* Trash Zone */}
                  <Card>
                    <CardContent className="p-4">
                      <Droppable droppableId="card-trash">
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                            className="min-h-[60px] border-2 border-dashed border-red-300 p-3 rounded-md bg-red-50 flex items-center justify-center"
                          >
                            <Trash2 className="h-5 w-5 text-red-400 mr-2" />
                            <span className="text-red-400 text-sm">Drag here to remove components</span>
                            {provided.placeholder}
                          </div>
                        )}
                      </Droppable>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </DragDropContext>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default PerfectCheckout;
