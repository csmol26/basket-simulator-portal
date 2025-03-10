
import React, { useState } from "react";
import { DragDropContext } from "react-beautiful-dnd";
import Navbar from "@/components/Navbar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ComponentList, { availableComponents } from "@/components/checkout-builder/ComponentList";
import StyleEditor, { initialStyleVariables, jsonToCssVariable } from "@/components/checkout-builder/StyleEditor";
import LayoutBuilder from "@/components/checkout-builder/LayoutBuilder";
import CodeGenerator from "@/components/checkout-builder/CodeGenerator";

interface DragItem {
  id: string;
  content: string;
}

const CheckoutBuilder: React.FC = () => {
  const [cardFirst, setCardFirst] = useState<boolean>(true);
  const [styleVariables, setStyleVariables] = useState(initialStyleVariables);
  
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
    
    // Then remove the row
    setRows(rows.filter(row => row.id !== rowId));
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
      const componentId = result.draggableId;
      const component = availableComponents.find(c => c.id === componentId);
      
      if (component && destination.droppableId.startsWith("row-")) {
        // Moving to a row
        const newItem: DragItem = {
          id: `${component.id}-${Date.now()}`,
          content: component.element,
        };
        
        const newRows = [...rows];
        const rowIndex = newRows.findIndex(row => row.id === destination.droppableId);
        
        if (rowIndex !== -1) {
          newRows[rowIndex].components.splice(destination.index, 0, newItem);
          setRows(newRows);
        }
      }
    } else if (source.droppableId.startsWith("row-")) {
      // Dragging from a row
      const sourceRowIndex = rows.findIndex(row => row.id === source.droppableId);
      
      if (sourceRowIndex !== -1) {
        const newRows = [...rows];
        const [movedItem] = newRows[sourceRowIndex].components.splice(source.index, 1);
        
        if (destination.droppableId.startsWith("row-")) {
          // Moving to another row
          const destRowIndex = newRows.findIndex(row => row.id === destination.droppableId);
          
          if (destRowIndex !== -1) {
            newRows[destRowIndex].components.splice(destination.index, 0, movedItem);
          }
        } else if (destination.droppableId === "trash") {
          // Component was dropped in trash - we don't need to do anything else
          // as we've already removed it from its source
        }
        
        setRows(newRows);
      }
    }
  };

  // Preview of the checkout
  const renderPreview = () => {
    // Create the checkout visual preview components
    const renderCardFormComponents = () => {
      if (rows.length === 0 || rows.every(row => row.components.length === 0)) {
        return (
          <div className="text-center p-4 text-gray-400 italic">
            Drag components here to build your card form
          </div>
        );
      }
      
      return rows.map((row, rowIndex) => {
        if (row.components.length === 0) return null;
        
        if (row.components.length === 1) {
          // Single component in the row - parse the HTML content
          const content = row.components[0].content;
          const componentName = content.match(/<primer-input-([^>]+)>/)?.[1] || "component";
          
          // Return a visual representation based on component type
          return (
            <div key={row.id} className="mb-4">
              {content.includes('card-number') && (
                <div className="bg-white border border-gray-300 rounded-md p-2 h-10 flex items-center px-3">
                  <span className="text-gray-400">•••• •••• •••• ••••</span>
                </div>
              )}
              {content.includes('card-expiry') && (
                <div className="bg-white border border-gray-300 rounded-md p-2 h-10 flex items-center px-3">
                  <span className="text-gray-400">MM/YY</span>
                </div>
              )}
              {content.includes('cvv') && (
                <div className="bg-white border border-gray-300 rounded-md p-2 h-10 flex items-center px-3">
                  <span className="text-gray-400">123</span>
                </div>
              )}
              {content.includes('card-form-submit') && (
                <button className="bg-green-600 hover:bg-green-700 text-white rounded-md p-2 h-10 w-full font-medium transition-colors">
                  Pay Now
                </button>
              )}
            </div>
          );
        } else {
          // Multiple components in a row should be displayed side by side
          return (
            <div key={row.id} className="flex gap-4 mb-4">
              {row.components.map((component, compIndex) => {
                const content = component.content;
                
                return (
                  <div key={component.id} className="flex-1">
                    {content.includes('card-number') && (
                      <div className="bg-white border border-gray-300 rounded-md p-2 h-10 flex items-center px-3">
                        <span className="text-gray-400">•••• •••• •••• ••••</span>
                      </div>
                    )}
                    {content.includes('card-expiry') && (
                      <div className="bg-white border border-gray-300 rounded-md p-2 h-10 flex items-center px-3">
                        <span className="text-gray-400">MM/YY</span>
                      </div>
                    )}
                    {content.includes('cvv') && (
                      <div className="bg-white border border-gray-300 rounded-md p-2 h-10 flex items-center px-3">
                        <span className="text-gray-400">123</span>
                      </div>
                    )}
                    {content.includes('card-form-submit') && (
                      <button className="bg-green-600 hover:bg-green-700 text-white rounded-md p-2 h-10 w-full font-medium transition-colors">
                        Pay Now
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          );
        }
      });
    };
    
    // Apply custom styles to the preview
    const previewStyles = Object.entries(styleVariables)
      .filter(([_, value]) => value !== '')
      .reduce((acc, [key, value]) => {
        // @ts-ignore
        acc[jsonToCssVariable[key]] = value;
        return acc;
      }, {} as Record<string, string>);

    return (
      <div 
        className="bg-white border border-gray-200 rounded-md p-6 shadow-sm"
        style={previewStyles}
      >
        <h3 className="text-lg font-medium mb-4">Checkout Preview</h3>
        
        <div className="border border-gray-200 rounded-md p-6">
          <div className="mb-6">
            <div className="flex items-center mb-4">
              <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center mr-2 text-xs font-bold">1</div>
              <p className="text-base font-medium text-gray-700">Card Payment</p>
            </div>
            
            <div className="pl-8">
              {cardFirst && renderCardFormComponents()}
            </div>
          </div>
          
          <div className="mb-6">
            <div className="flex items-center mb-4">
              <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center mr-2 text-xs font-bold">2</div>
              <p className="text-base font-medium text-gray-700">Alternative Payment Methods</p>
            </div>
            
            <div className="pl-8">
              <div className="flex gap-3 items-center">
                <button className="bg-blue-600 hover:bg-blue-700 text-white rounded-md p-2 h-10 px-4 font-medium transition-colors flex items-center gap-2">
                  <span className="font-bold">Pay</span>
                  <span className="font-light">Pal</span>
                </button>
                <button className="bg-yellow-500 hover:bg-yellow-600 text-black rounded-md p-2 h-10 px-4 font-medium transition-colors">
                  APM
                </button>
                <button className="bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-md p-2 h-10 px-4 font-medium transition-colors">
                  Other
                </button>
              </div>
            </div>
          </div>
          
          {!cardFirst && (
            <div className="mb-6">
              <div className="flex items-center mb-4">
                <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center mr-2 text-xs font-bold">3</div>
                <p className="text-base font-medium text-gray-700">Card Payment</p>
              </div>
              
              <div className="pl-8">
                {renderCardFormComponents()}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      <main className="flex-1 py-8">
        <div className="max-w-6xl mx-auto px-4 md:px-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout Builder</h1>
          
          <DragDropContext onDragEnd={onDragEnd}>
            {/* Top Row - Layout Builder (2/3) and Options (1/3) */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
              {/* Layout Builder - 2/3 */}
              <div className="lg:col-span-2">
                <LayoutBuilder rows={rows} onRemoveRow={removeRow} />
              </div>
              
              {/* Options - 1/3 */}
              <div className="lg:col-span-1">
                <Tabs defaultValue="components" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="components">Components</TabsTrigger>
                    <TabsTrigger value="styles">Style Variables</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="components" className="mt-4">
                    <ComponentList 
                      onCardPositionToggle={toggleCardPosition}
                      cardFirst={cardFirst}
                      onAddRow={addRow}
                    />
                  </TabsContent>
                  
                  <TabsContent value="styles" className="mt-4">
                    <StyleEditor 
                      styleVariables={styleVariables}
                      onStyleChange={handleStyleChange}
                    />
                  </TabsContent>
                </Tabs>
              </div>
            </div>
            
            {/* Middle Row - Preview */}
            <div className="mb-8">
              {renderPreview()}
            </div>
            
            {/* Bottom Row - Generated Code */}
            <div>
              <CodeGenerator 
                rows={rows}
                styleVariables={styleVariables}
                cardFirst={cardFirst}
              />
            </div>
          </DragDropContext>
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
