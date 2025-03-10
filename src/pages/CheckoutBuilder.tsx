
import React, { useState, useRef } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Copy } from "lucide-react";

// Define available checkout components
const availableComponents = [
  { id: "card-number", name: "Card Number", element: "<primer-input-card-number placeholder=\"4444 3333 2222 1111\"></primer-input-card-number>" },
  { id: "card-expiry", name: "Card Expiry", element: "<primer-input-card-expiry placeholder=\"12/30\"></primer-input-card-expiry>" },
  { id: "card-cvv", name: "Card CVV", element: "<primer-input-cvv placeholder=\"123\"></primer-input-cvv>" },
  { id: "card-holder", name: "Card Holder Name", element: "<primer-input-card-holder-name placeholder=\"Cardholder Name\"></primer-input-card-holder-name>" },
  { id: "card-submit", name: "Submit Button", element: "<primer-card-form-submit style=\"height: 40px; width: 100%; font-weight: 500;\"></primer-card-form-submit>" },
];

// Payment methods
const paymentMethods = [
  { id: "card", name: "Card Payment", element: `<p class="text-base font-medium text-gray-700 mb-4">Card</p>
<primer-card-form>
  <div slot="card-form-content" style="--primer-input-height: 40px; --primer-space-medium: 16px; display: flex; flex-direction: column; gap: 16px;">
    <!-- Card components will be placed here -->
  </div>
</primer-card-form>` },
  { id: "paypal", name: "PayPal", element: `<div class="mt-8 pt-6 border-t border-gray-200">
  <p class="text-base font-medium text-gray-700 mb-4">PayPal</p>
  <primer-payment-method type="PAYPAL">
    <!-- PayPal payment method will be rendered automatically -->
  </primer-payment-method>
</div>` },
];

// Style variables with default values
const initialStyleVariables = {
  primerColorBrand: "#18A94B",
  primerTypographyBrand: "'Poppins', sans-serif",
  primerColorBackground: "transparent",
  primerRadiusBase: "16px",
  primerSpaceBase: "4px",
  primerSizeBase: "4px",
  primerColorLoader: "",
  primerColorFocus: "#DE00D1",
};

const variableDescriptions = {
  primerColorBrand: "Controls the brand color across the checkout",
  primerTypographyBrand: "Controls the brand font family across the checkout",
  primerColorBackground: "Controls the background color across the checkout",
  primerRadiusBase: "Controls the base radius unit across the checkout",
  primerSpaceBase: "Controls the base spacing unit across the checkout",
  primerSizeBase: "Controls the base size unit across the checkout",
  primerColorLoader: "Controls the loader color across the checkout (leave empty to use brand color)",
  primerColorFocus: "Controls the interactive focus color across the checkout",
};

const jsonToCssVariable = {
  primerColorBrand: "--primer-color-brand",
  primerTypographyBrand: "--primer-typography-brand",
  primerColorBackground: "--primer-color-background",
  primerRadiusBase: "--primer-radius-base",
  primerSpaceBase: "--primer-space-base",
  primerSizeBase: "--primer-size-base",
  primerColorLoader: "--primer-color-loader",
  primerColorFocus: "--primer-color-focus",
};

interface DragItem {
  id: string;
  content: string;
  inContainer?: boolean;
  row?: number;
}

const CheckoutBuilder: React.FC = () => {
  const [selectedComponents, setSelectedComponents] = useState<DragItem[]>([]);
  const [cardFirst, setCardFirst] = useState<boolean>(true);
  const [styleVariables, setStyleVariables] = useState(initialStyleVariables);
  const previewRef = useRef<HTMLDivElement>(null);
  
  // State for rows (containers that can hold components horizontally)
  const [rows, setRows] = useState<{ id: string; components: DragItem[] }[]>([
    { id: "row-1", components: [] }
  ]);

  // Add a new empty row
  const addRow = () => {
    setRows([...rows, { id: `row-${rows.length + 1}`, components: [] }]);
  };

  // Remove a row
  const removeRow = (rowId: string) => {
    // First move any components in this row back to the component list
    const rowToRemove = rows.find(row => row.id === rowId);
    if (rowToRemove && rowToRemove.components.length > 0) {
      setSelectedComponents([...selectedComponents, ...rowToRemove.components]);
    }
    
    // Then remove the row
    setRows(rows.filter(row => row.id !== rowId));
  };

  // Handle drag and drop logic
  const onDragEnd = (result: any) => {
    const { source, destination } = result;
    
    // Dropped outside any droppable area
    if (!destination) return;
    
    // If source and destination are the same, do nothing
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) return;
    
    // Handle drag between different areas (component list, rows, etc.)
    if (source.droppableId === "components") {
      // Dragging from component list
      const component = {...availableComponents.find(c => c.id === result.draggableId)!};
      const newItem: DragItem = {
        id: `${component.id}-${Date.now()}`,
        content: component.element,
      };
      
      if (destination.droppableId.startsWith("row-")) {
        // Moving to a row
        const newRows = [...rows];
        const rowIndex = newRows.findIndex(row => row.id === destination.droppableId);
        newRows[rowIndex].components.splice(destination.index, 0, newItem);
        setRows(newRows);
      }
    } else if (source.droppableId.startsWith("row-")) {
      // Dragging from a row
      const sourceRowIndex = rows.findIndex(row => row.id === source.droppableId);
      const [movedItem] = rows[sourceRowIndex].components.splice(source.index, 1);
      
      if (destination.droppableId.startsWith("row-")) {
        // Moving to another row
        const destRowIndex = rows.findIndex(row => row.id === destination.droppableId);
        rows[destRowIndex].components.splice(destination.index, 0, movedItem);
      } else if (destination.droppableId === "trash") {
        // Component was dropped in trash - we don't need to do anything else
        // as we've already removed it from its source
      }
      
      setRows([...rows]);
    }
  };

  // Toggle card form position relative to alternative payment methods
  const toggleCardPosition = () => {
    setCardFirst(!cardFirst);
  };

  // Update style variable
  const handleStyleChange = (variableName: string, value: string) => {
    setStyleVariables({
      ...styleVariables,
      [variableName]: value
    });
  };

  // Generate CSS variables from the style settings
  const generateCssVariables = () => {
    let css = '';
    Object.entries(styleVariables).forEach(([key, value]) => {
      if (value && jsonToCssVariable[key as keyof typeof jsonToCssVariable]) {
        css += `${jsonToCssVariable[key as keyof typeof jsonToCssVariable]}: ${value};\n  `;
      }
    });
    return css;
  };

  // Generate UI code for PaymentSection
  const generateUICode = () => {
    const variableString = Object.entries(styleVariables)
      .filter(([_, value]) => value !== '')
      .map(([key, value]) => `${jsonToCssVariable[key as keyof typeof jsonToCssVariable]}: ${value};`)
      .join('\n    ');
    
    return `<div id="primer-payment-container" ref={containerRef} 
  className="min-h-48 rounded-md border border-gray-200 p-4 transition-all duration-300 ease-in-out"
  style={{ ${variableString ? '\n    ' + variableString + '\n  ' : ''} }}
>
  {/* Primer checkout will be rendered here */}
</div>`;
  };

  // Generate code for primer.ts (checkout structure)
  const generatePrimerCode = () => {
    // Create the HTML structure based on the rows and components
    let cardFormContent = rows.map(row => {
      if (row.components.length === 0) return '';
      
      if (row.components.length === 1) {
        return row.components[0].content;
      } else {
        // Multiple components in a row should be rendered in a flex container
        return `<div style="display: flex; gap: 16px;">
  ${row.components.map(comp => `  <div style="flex: 1;">\n    ${comp.content}\n  </div>`).join('\n  ')}
</div>`;
      }
    }).filter(content => content).join('\n');
    
    const cardPaymentHtml = `<primer-card-form>
  <div slot="card-form-content" style="--primer-input-height: 40px; --primer-space-medium: 16px; display: flex; flex-direction: column; gap: 16px;">
    ${cardFormContent}
  </div>
</primer-card-form>`;

    const paypalHtml = `<div class="mt-8 pt-6 border-t border-gray-200">
  <p class="text-base font-medium text-gray-700 mb-4">Alternative Payment Method</p>
  <primer-payment-method type="PAYPAL">
    <!-- PayPal payment method will be rendered automatically -->
  </primer-payment-method>
</div>`;

    const checkoutHtml = `
      <primer-checkout client-token="\${clientSession.clientToken}">
        <primer-main slot="main">
          <!-- Payment methods -->
          <div slot="payments">
            <!-- Card payment method display 1 -->
            <p class="text-base font-medium text-gray-700 mb-4">Card</p>
            ${cardFirst ? cardPaymentHtml : paypalHtml}
            
            ${cardFirst ? paypalHtml : cardPaymentHtml}
          </div>
          
          <!-- Custom completion screen -->
          <div slot="checkout-complete">
            <h2 class="text-xl font-bold text-green-600 text-center my-4">Thank you for your purchase!</h2>
            <p class="text-center text-gray-600">Your order has been processed successfully.</p>
          </div>
        </primer-main>
      </primer-checkout>
    `;
    
    return checkoutHtml;
  };

  // Copy code to clipboard
  const copyToClipboard = (code: string) => {
    navigator.clipboard.writeText(code);
    toast.success("Code copied to clipboard!");
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      <main className="flex-1 py-8">
        <div className="max-w-6xl mx-auto px-4 md:px-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout Builder</h1>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Components and Style Variables */}
            <div className="lg:col-span-1 space-y-6">
              <Tabs defaultValue="components" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="components">Components</TabsTrigger>
                  <TabsTrigger value="styles">Style Variables</TabsTrigger>
                </TabsList>
                
                <TabsContent value="components" className="mt-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Available Components</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <DragDropContext onDragEnd={onDragEnd}>
                        <Droppable droppableId="components">
                          {(provided) => (
                            <div
                              {...provided.droppableProps}
                              ref={provided.innerRef}
                              className="space-y-2"
                            >
                              {availableComponents.map((component, index) => (
                                <Draggable
                                  key={component.id}
                                  draggableId={component.id}
                                  index={index}
                                >
                                  {(provided) => (
                                    <div
                                      ref={provided.innerRef}
                                      {...provided.draggableProps}
                                      {...provided.dragHandleProps}
                                      className="p-3 bg-white rounded-md border border-gray-200 shadow-sm cursor-move hover:border-accent hover:shadow-md transition-all"
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
                      </DragDropContext>
                      
                      <div className="mt-8 pt-4 border-t border-gray-200">
                        <p className="text-sm font-medium text-gray-700 mb-4">Payment Method Order</p>
                        <Button 
                          onClick={toggleCardPosition} 
                          variant="outline" 
                          className="w-full justify-between"
                        >
                          {cardFirst ? "Card → PayPal" : "PayPal → Card"}
                          <span className="text-xs text-gray-500">Click to toggle</span>
                        </Button>
                      </div>
                      
                      <div className="mt-8 pt-4 border-t border-gray-200">
                        <p className="text-sm font-medium text-gray-700 mb-4">Row Management</p>
                        <div className="flex gap-2">
                          <Button onClick={addRow} variant="outline" className="flex-1">
                            Add Row
                          </Button>
                          <Droppable droppableId="trash">
                            {(provided) => (
                              <div
                                {...provided.droppableProps}
                                ref={provided.innerRef}
                                className="p-2 bg-red-50 border border-red-200 rounded-md text-center flex-1 flex items-center justify-center"
                              >
                                <span className="text-red-500 text-sm">Drop here to remove</span>
                                {provided.placeholder}
                              </div>
                            )}
                          </Droppable>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="styles" className="mt-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Style Variables</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {Object.entries(styleVariables).map(([key, value]) => (
                          <div key={key} className="space-y-2">
                            <Label htmlFor={key} className="text-sm flex justify-between">
                              <span>{jsonToCssVariable[key as keyof typeof jsonToCssVariable]}</span>
                              {key === "primerColorBrand" || key === "primerColorBackground" || key === "primerColorLoader" || key === "primerColorFocus" ? (
                                <input 
                                  type="color" 
                                  value={value || '#000000'} 
                                  onChange={(e) => handleStyleChange(key, e.target.value)}
                                  className="w-8 h-8 p-0 border-0"
                                />
                              ) : null}
                            </Label>
                            <Input 
                              id={key}
                              value={value}
                              onChange={(e) => handleStyleChange(key, e.target.value)}
                              placeholder={`Enter ${key}`}
                            />
                            <p className="text-xs text-gray-500">{variableDescriptions[key as keyof typeof variableDescriptions]}</p>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
            
            {/* Middle Column - Checkout Preview */}
            <div className="lg:col-span-1">
              <Card className="h-full">
                <CardHeader>
                  <CardTitle className="text-lg">Layout Builder</CardTitle>
                </CardHeader>
                <CardContent>
                  <DragDropContext onDragEnd={onDragEnd}>
                    <div className="space-y-4">
                      {rows.map((row, rowIndex) => (
                        <div key={row.id} className="relative border border-dashed border-gray-300 p-3 rounded-md">
                          <Droppable droppableId={row.id} direction="horizontal">
                            {(provided) => (
                              <div
                                {...provided.droppableProps}
                                ref={provided.innerRef}
                                className={`min-h-[60px] flex gap-2 ${row.components.length > 0 ? '' : 'justify-center items-center'}`}
                              >
                                {row.components.length === 0 && (
                                  <span className="text-gray-400 text-sm">Drag components here</span>
                                )}
                                
                                {row.components.map((component, index) => (
                                  <Draggable
                                    key={component.id}
                                    draggableId={component.id}
                                    index={index}
                                  >
                                    {(provided) => (
                                      <div
                                        ref={provided.innerRef}
                                        {...provided.draggableProps}
                                        {...provided.dragHandleProps}
                                        className="p-2 bg-white border border-gray-200 rounded-md shadow-sm flex-1 cursor-move hover:border-accent"
                                      >
                                        <div className="text-xs text-center overflow-hidden text-ellipsis whitespace-nowrap">
                                          {availableComponents.find(c => component.content.includes(c.element))?.name || "Component"}
                                        </div>
                                      </div>
                                    )}
                                  </Draggable>
                                ))}
                                {provided.placeholder}
                              </div>
                            )}
                          </Droppable>
                          
                          {rows.length > 1 && (
                            <button
                              onClick={() => removeRow(row.id)}
                              className="absolute -right-2 -top-2 w-5 h-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center"
                              title="Remove row"
                            >
                              ×
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </DragDropContext>
                </div>
              </Card>
            </div>
            
            {/* Right Column - Generated Code */}
            <div className="lg:col-span-1">
              <Card className="h-full">
                <CardHeader>
                  <CardTitle className="text-lg">Generated Code</CardTitle>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="uiCode" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="uiCode">UI Code</TabsTrigger>
                      <TabsTrigger value="primerCode">Primer Code</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="uiCode" className="mt-4">
                      <div className="relative">
                        <pre className="p-4 bg-gray-900 text-gray-100 rounded-md text-sm overflow-x-auto">
                          <code>{generateUICode()}</code>
                        </pre>
                        <Button 
                          size="sm" 
                          variant="secondary" 
                          className="absolute top-2 right-2"
                          onClick={() => copyToClipboard(generateUICode())}
                        >
                          <Copy size={16} />
                        </Button>
                      </div>
                      <p className="text-xs text-gray-500 mt-2">Copy this code to your PaymentSection.tsx file</p>
                    </TabsContent>
                    
                    <TabsContent value="primerCode" className="mt-4">
                      <div className="relative">
                        <pre className="p-4 bg-gray-900 text-gray-100 rounded-md text-sm overflow-x-auto">
                          <code>{generatePrimerCode()}</code>
                        </pre>
                        <Button 
                          size="sm" 
                          variant="secondary" 
                          className="absolute top-2 right-2"
                          onClick={() => copyToClipboard(generatePrimerCode())}
                        >
                          <Copy size={16} />
                        </Button>
                      </div>
                      <p className="text-xs text-gray-500 mt-2">Copy this code to the initPrimer function in primer.ts</p>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      
      <footer className="bg-white border-t border-gray-100 py-8 mt-12">
        <div className="max-w-6xl mx-auto px-4 md:px-6">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500">
                © 2023 PrimerBasket. All rights reserved.
              </p>
            </div>
            <div className="text-sm text-gray-500">
              <p>Secured by Primer.io</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default CheckoutBuilder;
