import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import { DragDropContext, Droppable, Draggable, DropResult } from "react-beautiful-dnd";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Trash2, MoveVertical, Type, CreditCard, LayoutGrid, Palette } from "lucide-react";
import { v4 as uuidv4 } from 'uuid';
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";

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

interface StyleVariables {
  primerColorBrand: string;
  primerRadiusBase: string;
  primerSpaceBase: string;
  primerTypographyBrand: string;
  background: string;
  textColor: string;
}

const PerfectCheckout: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>("checkout-builder");
  const [styleVariables, setStyleVariables] = useState<StyleVariables>({
    primerColorBrand: "#18A94B",
    primerRadiusBase: "16px",
    primerSpaceBase: "4px",
    primerTypographyBrand: "Poppins, sans-serif",
    background: "#ffffff",
    textColor: "#333333"
  });

  const availablePaymentMethods: PaymentMethod[] = [
    { id: 'card', type: 'PAYMENT_CARD', name: 'Credit Card' },
    { id: 'paypal', type: 'PAYPAL', name: 'PayPal' },
    { id: 'applepay', type: 'APPLE_PAY', name: 'Apple Pay' },
    { id: 'googlepay', type: 'GOOGLE_PAY', name: 'Google Pay' },
    { id: 'klarna', type: 'KLARNA', name: 'Klarna' },
    { id: 'ideal', type: 'IDEAL', name: 'iDEAL' },
    { id: 'sofort', type: 'SOFORT', name: 'Sofort' },
  ];

  const [slots, setSlots] = useState<CheckoutSlot[]>([
    { id: 'slot-1', name: 'Card Payment', items: [] }
  ]);

  const [cardFormRows, setCardFormRows] = useState<CardFormRow[]>([
    { id: 'row-1', components: [] }
  ]);

  const [currentTheme, setCurrentTheme] = useState<string>("default");

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

  const themeOptions = [
    { id: "default", name: "Default", description: "The standard Primer checkout theme with green accents and rounded corners." },
    { id: "minimal", name: "Minimal", description: "A minimalist grayscale theme with subtle styling and small radius." },
    { id: "high-contrast", name: "High Contrast", description: "Maximum accessibility with strong black borders and high contrast elements." },
    { id: "kawaii", name: "Kawaii", description: "Playful pink theme with soft rounded corners and Comic Sans font." },
    { id: "retro-90s", name: "Retro 90s", description: "Nostalgic 90s web design with bright colors, sharp edges, and monospace font." },
  ];

  const addSlot = () => {
    setSlots([...slots, { id: `slot-${uuidv4()}`, name: `Payment Option ${slots.length + 1}`, items: [] }]);
  };

  const removeSlot = (slotId: string) => {
    if (slots.length > 1) {
      setSlots(slots.filter(slot => slot.id !== slotId));
    }
  };

  const handleSlotNameChange = (slotId: string, newName: string) => {
    setSlots(slots.map(slot => 
      slot.id === slotId ? { ...slot, name: newName } : slot
    ));
  };

  const addCardFormRow = () => {
    setCardFormRows([...cardFormRows, { id: `row-${uuidv4()}`, components: [] }]);
  };

  const removeCardFormRow = (rowId: string) => {
    if (cardFormRows.length > 1) {
      setCardFormRows(cardFormRows.filter(row => row.id !== rowId));
    }
  };

  const handleStyleChange = (variable: keyof StyleVariables, value: string) => {
    setStyleVariables({
      ...styleVariables,
      [variable]: value
    });
  };

  const handleThemeChange = (theme: string) => {
    setCurrentTheme(theme);
    
    switch (theme) {
      case "minimal":
        setStyleVariables({
          primerColorBrand: "#666666",
          primerRadiusBase: "2px",
          primerSpaceBase: "4px",
          primerTypographyBrand: "Inter, sans-serif",
          background: "#ffffff",
          textColor: "#333333"
        });
        break;
      case "high-contrast":
        setStyleVariables({
          primerColorBrand: "#000000",
          primerRadiusBase: "0px",
          primerSpaceBase: "6px",
          primerTypographyBrand: "Inter, sans-serif",
          background: "#ffffff",
          textColor: "#000000"
        });
        break;
      case "kawaii":
        setStyleVariables({
          primerColorBrand: "#ff70b5",
          primerRadiusBase: "12px",
          primerSpaceBase: "6px",
          primerTypographyBrand: "'Comic Sans MS', cursive, sans-serif",
          background: "#fff0f7",
          textColor: "#994068"
        });
        break;
      case "retro-90s":
        setStyleVariables({
          primerColorBrand: "#00ccff",
          primerRadiusBase: "0px",
          primerSpaceBase: "8px",
          primerTypographyBrand: "'VT323', 'Courier New', monospace",
          background: "#000000",
          textColor: "#00ccff"
        });
        break;
      default:
        setStyleVariables({
          primerColorBrand: "#18A94B",
          primerRadiusBase: "16px",
          primerSpaceBase: "4px",
          primerTypographyBrand: "Poppins, sans-serif",
          background: "#ffffff",
          textColor: "#333333"
        });
    }
  };

  const onDragEnd = (result: DropResult) => {
    const { source, destination } = result;

    if (!destination) return;

    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) return;

    if (activeTab === "checkout-builder") {
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
      else if (destination.droppableId === 'trash' && source.droppableId.startsWith('slot-')) {
        const newSlots = [...slots];
        const sourceSlot = newSlots.find(slot => slot.id === source.droppableId);
        
        if (sourceSlot) {
          sourceSlot.items.splice(source.index, 1);
          setSlots(newSlots);
        }
      }
    }
    else if (activeTab === "card-form-builder") {
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

  const generateCardFormHTML = () => {
    let html = '<primer-card-form>\n';
    html += '  <div slot="card-form-content" style="display: flex; flex-direction: column; gap: 16px;">\n';
    
    cardFormRows.forEach(row => {
      if (row.components.length === 0) return;

      if (row.components.length === 1) {
        const component = row.components[0];
        html += `    ${component.element}\n`;
      } else {
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

  const themeStyles: React.CSSProperties = {
    "--primer-color-brand": styleVariables.primerColorBrand,
    "--primer-radius-base": styleVariables.primerRadiusBase,
    "--primer-space-base": styleVariables.primerSpaceBase,
    "--primer-typography-brand": styleVariables.primerTypographyBrand,
    "--page-background-color": styleVariables.background,
    "--page-text-color": styleVariables.textColor,
  } as React.CSSProperties;

  return (
    <div className="min-h-screen flex flex-col" style={themeStyles}>
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
            <TabsTrigger value="theme-preview" className="flex items-center gap-2">
              <Palette className="h-4 w-4" />
              Theme and Preview
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="checkout-builder">
            <DragDropContext onDragEnd={onDragEnd}>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
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
          
          <TabsContent value="card-form-builder">
            <DragDropContext onDragEnd={onDragEnd}>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
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
          
          <TabsContent value="theme-preview">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="lg:col-span-1">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Checkout Preview</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div 
                      className={`p-6 rounded-lg border ${
                        currentTheme === 'kawaii' ? 'bg-pink-50 border-pink-200' : 
                        currentTheme === 'retro-90s' ? 'bg-black text-cyan-400 border-pink-500 border-2' : 
                        currentTheme === 'high-contrast' ? 'bg-white border-black border-2' : 
                        'bg-white border-gray-200'
                      }`}
                    >
                      <h2 className="text-xl font-semibold mb-4">Checkout</h2>
                      
                      <div className="space-y-4 mb-6">
                        <div className="font-medium">Payment Method</div>
                        {slots.map((slot, index) => (
                          <div 
                            key={slot.id} 
                            className={`p-3 rounded-md border ${
                              currentTheme === 'kawaii' ? 'border-pink-300 bg-white' : 
                              currentTheme === 'retro-90s' ? 'border-cyan-500 bg-gray-900' : 
                              currentTheme === 'high-contrast' ? 'border-black bg-white' : 
                              'border-gray-200 bg-white'
                            }`}
                          >
                            <div className="font-medium">{slot.name}</div>
                            <div className="flex flex-wrap gap-2 mt-2">
                              {slot.items.length > 0 ? (
                                slot.items.map((item) => (
                                  <div 
                                    key={item.id} 
                                    className={`px-3 py-1 text-sm rounded-md ${
                                      currentTheme === 'kawaii' ? 'bg-pink-100 text-pink-800' : 
                                      currentTheme === 'retro-90s' ? 'bg-cyan-900 text-cyan-300 border border-cyan-500' : 
                                      currentTheme === 'high-contrast' ? 'bg-black text-white' : 
                                      'bg-gray-100 text-gray-800'
                                    }`}
                                  >
                                    {item.name}
                                  </div>
                                ))
                              ) : (
                                <div 
                                  className={`px-3 py-1 text-sm rounded-md w-full ${
                                    currentTheme === 'kawaii' ? 'bg-pink-100 text-pink-800' : 
                                    currentTheme === 'retro-90s' ? 'bg-cyan-900 text-cyan-300 border border-cyan-500' : 
                                    currentTheme === 'high-contrast' ? 'bg-black text-white' : 
                                    'bg-gray-100 text-gray-800'
                                  }`}
                                >
                                  [Empty Payment Method Slot]
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      <div className="space-y-4">
                        <div className="font-medium">Card Details</div>
                        <div 
                          className={`p-4 rounded-md border ${
                            currentTheme === 'kawaii' ? 'border-pink-300 bg-white' : 
                            currentTheme === 'retro-90s' ? 'border-cyan-500 bg-gray-900' : 
                            currentTheme === 'high-contrast' ? 'border-black bg-white' : 
                            'border-gray-200 bg-white'
                          }`}
                        >
                          {cardFormRows.map((row, rowIndex) => (
                            <div key={row.id} className={`${rowIndex > 0 ? 'mt-4' : ''} flex gap-4`}>
                              {row.components.length > 0 ? (
                                row.components.map((component) => (
                                  <div key={component.id} className="flex-1">
                                    {component.label && (
                                      <label 
                                        className={`block text-sm font-medium mb-1 ${
                                          currentTheme === 'kawaii' ? 'text-pink-800' : 
                                          currentTheme === 'retro-90s' ? 'text-cyan-300' : 
                                          'text-gray-700'
                                        }`}
                                      >
                                        {component.label}
                                      </label>
                                    )}
                                    {component.type === 'card-submit' ? (
                                      <button 
                                        className={`w-full rounded-md py-2 px-4 text-sm font-medium ${
                                          currentTheme === 'kawaii' ? 'bg-pink-500 text-white' : 
                                          currentTheme === 'retro-90s' ? 'bg-cyan-500 text-black border border-white' : 
                                          currentTheme === 'high-contrast' ? 'bg-black text-white' : 
                                          'bg-green-500 text-white'
                                        }`}
                                      >
                                        Pay Now
                                      </button>
                                    ) : (
                                      <div 
                                        className={`h-10 px-3 py-2 rounded-md text-sm ${
                                          currentTheme === 'kawaii' ? 'bg-pink-50 border border-pink-200 text-pink-800' : 
                                          currentTheme === 'retro-90s' ? 'bg-gray-800 border border-cyan-500 text-cyan-300' : 
                                          currentTheme === 'high-contrast' ? 'bg-white border-2 border-black text-black' : 
                                          'bg-gray-50 border border-gray-300 text-gray-500'
                                        }`}
                                      >
                                        {component.placeholder || component.name}
                                      </div>
                                    )}
                                  </div>
                                ))
                              ) : (
                                <div 
                                  className={`w-full h-10 px-3 py-2 rounded-md text-sm ${
                                    currentTheme === 'kawaii' ? 'bg-pink-50 border border-pink-200 text-pink-300' : 
                                    currentTheme === 'retro-90s' ? 'bg-gray-800 border border-cyan-500 text-cyan-600' : 
                                    currentTheme === 'high-contrast' ? 'bg-white border-2 border-black text-gray-400' : 
                                    'bg-gray-50 border border-gray-300 text-gray-400'
                                  }`}
                                >
                                  [Empty row]
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <div className="lg:col-span-1">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Theme Configuration</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div>
                        <label htmlFor="theme-select" className="text-sm font-medium block mb-2">
                          Select Theme
                        </label>
                        <select 
                          id="theme-select"
                          className="w-full p-2 border border-gray-200 rounded-md"
                          value={currentTheme}
                          onChange={(e) => handleThemeChange(e.target.value)}
                        >
                          {themeOptions.map(theme => (
                            <option key={theme.id} value={theme.id}>
                              {theme.name}
                            </option>
                          ))}
                        </select>
                        <p className="mt-2 text-sm text-gray-500">
                          {themeOptions.find(t => t.id === currentTheme)?.description}
                        </p>
                      </div>
                      
                      <div>
                        <label className="text-sm font-medium block mb-2">
                          Brand Color
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="color"
                            value={styleVariables.primerColorBrand}
                            onChange={(e) => handleStyleChange('primerColorBrand', e.target.value)}
                            className="w-12 h-10 rounded overflow-hidden"
                          />
                          <Input
                            value={styleVariables.primerColorBrand}
                            onChange={(e) => handleStyleChange('primerColorBrand', e.target.value)}
                            className="flex-1"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label className="text-sm font-medium block mb-2">
                          Background Color
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="color"
                            value={styleVariables.background}
                            onChange={(e) => handleStyleChange('background', e.target.value)}
                            className="w-12 h-10 rounded overflow-hidden"
                          />
                          <Input
                            value={styleVariables.background}
                            onChange={(e) => handleStyleChange('background', e.target.value)}
                            className="flex-1"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label className="text-sm font-medium block mb-2">
                          Text Color
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="color"
                            value={styleVariables.textColor}
                            onChange={(e) => handleStyleChange('textColor', e.target.value)}
                            className="w-12 h-10 rounded overflow-hidden"
                          />
                          <Input
                            value={styleVariables.textColor}
                            onChange={(e) => handleStyleChange('textColor', e.target.value)}
                            className="flex-1"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label className="text-sm font-medium block mb-2">
                          Border Radius: {styleVariables.primerRadiusBase}
                        </label>
                        <Slider
                          value={[parseInt(styleVariables.primerRadiusBase)]}
                          min={0}
                          max={24}
                          step={1}
                          onValueChange={(values) => handleStyleChange('primerRadiusBase', `${values[0]}px`)}
                          className="mb-4"
                        />
                      </div>
                      
                      <div>
                        <label className="text-sm font-medium block mb-2">
                          Base Spacing: {styleVariables.primerSpaceBase}
                        </label>
                        <Slider
                          value={[parseInt(styleVariables.primerSpaceBase)]}
                          min={2}
                          max={16}
                          step={1}
                          onValueChange={(values) => handleStyleChange('primerSpaceBase', `${values[0]}px`)}
                          className="mb-4"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="font-select" className="text-sm font-medium block mb-2">
                          Font Family
                        </label>
                        <select 
                          id="font-select"
                          className="w-full p-2 border border-gray-200 rounded-md"
                          value={styleVariables.primerTypographyBrand}
                          onChange={(e) => handleStyleChange('primerTypographyBrand', e.target.value)}
                        >
                          <option value="Poppins, sans-serif">Poppins</option>
                          <option value="'Comic Sans MS', cursive, sans-serif">Comic Sans MS</option>
                          <option value="'VT323', 'Courier New', monospace">VT323 (Retro)</option>
                          <option value="Georgia, serif">Georgia</option>
                          <option value="'Courier New', monospace">Courier New</option>
                          <option value="Arial, sans-serif">Arial</option>
                          <option value="Inter, sans-serif">Inter</option>
                        </select>
                      </div>
                      
                      <div>
                        <div className="text-sm font-medium mb-2">CSS Variables</div>
                        <pre className="bg-gray-900 text-gray-100 p-4 rounded-md overflow-x-auto text-xs">
                          {`/* Theme CSS Variables */
:root {
  --primer-color-brand: ${styleVariables.primerColorBrand};
  --primer-radius-base: ${styleVariables.primerRadiusBase};
  --primer-space-base: ${styleVariables.primerSpaceBase};
  --primer-typography-brand: ${styleVariables.primerTypographyBrand};
  --page-background-color: ${styleVariables.background};
  --page-text-color: ${styleVariables.textColor};
}`}
                        </pre>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default PerfectCheckout;
