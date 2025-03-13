
import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import { DragDropContext, Droppable, Draggable, DropResult } from "react-beautiful-dnd";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Trash2, MoveVertical } from "lucide-react";
import { v4 as uuidv4 } from 'uuid';

// Define types for our drag and drop items
interface PaymentMethod {
  id: string;
  type: string;
  name: string;
}

interface CheckoutSlot {
  id: string;
  items: PaymentMethod[];
}

const PerfectCheckout: React.FC = () => {
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
    { id: 'slot-1', items: [] }
  ]);

  // Handle adding a new slot
  const addSlot = () => {
    setSlots([...slots, { id: `slot-${uuidv4()}`, items: [] }]);
  };

  // Handle removing a slot
  const removeSlot = (slotId: string) => {
    if (slots.length > 1) {
      setSlots(slots.filter(slot => slot.id !== slotId));
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
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 max-w-6xl mx-auto w-full px-4 py-8 md:px-6">
        <h1 className="text-3xl font-bold mb-6">Build Your Perfect Checkout</h1>
        
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
                        
                        <Droppable droppableId={slot.id} direction="horizontal">
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.droppableProps}
                              className={`min-h-[100px] rounded-md flex gap-2 items-center p-3 bg-white border border-gray-200
                                ${slot.items.length === 0 ? 'justify-center' : 'flex-wrap'}`}
                            >
                              {slot.items.length === 0 && (
                                <p className="text-gray-400 text-sm">Drop payment methods here</p>
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
      </div>
    </div>
  );
};

export default PerfectCheckout;
