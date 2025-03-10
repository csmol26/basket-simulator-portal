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
    // Create the HTML structure based on the rows and components
    const cardFormContent = rows.map(row => {
      if (row.components.length === 0) return '';
      
      if (row.components.length === 1) {
        return row.components[0].content;
      } else {
        // Multiple components in a row should be rendered in a flex container
        return `<div style="display: flex; gap: 16px;">
    ${row.components.map(comp => `<div style="flex: 1;">${comp.content}</div>`).join('\n    ')}
  </div>`;
      }
    }).filter(content => content).join('\n');

    const cardPaymentHtml = `<primer-card-form>
  <div slot="card-form-content" style="--primer-input-height: 40px; --primer-space-medium: 16px; display: flex; flex-direction: column; gap: 16px;">
    ${cardFormContent || '<p class="text-center text-gray-400">Drag components here</p>'}
  </div>
</primer-card-form>`;

    const apmHtml = `<div class="mt-8 pt-6 border-t border-gray-200">
  <p class="text-base font-medium text-gray-700 mb-4">Alternative Payment Method</p>
  <primer-payment-method type="PAYPAL">
    <!-- APM will be rendered automatically -->
  </primer-payment-method>
</div>`;

    return (
      <div 
        className="bg-white border border-gray-200 rounded-md p-6 shadow-sm"
        style={{
          ...Object.entries(styleVariables)
            .filter(([_, value]) => value !== '')
            .reduce((acc, [key, value]) => {
              // @ts-ignore
              acc[jsonToCssVariable[key]] = value;
              return acc;
            }, {} as Record<string, string>)
        }}
      >
        <h3 className="text-lg font-medium mb-4">Checkout Preview</h3>
        <div className="border border-gray-200 rounded-md p-4">
          <div className="mb-4">
            <p className="text-base font-medium text-gray-700 mb-4">Card</p>
            <div className="bg-gray-100 p-4 rounded-md">
              <pre className="text-xs overflow-auto whitespace-pre-wrap">
                {cardPaymentHtml}
              </pre>
            </div>
          </div>
          
          <div>
            <p className="text-base font-medium text-gray-700 mb-4">Alternative Payment Method</p>
            <div className="bg-gray-100 p-4 rounded-md">
              <pre className="text-xs overflow-auto whitespace-pre-wrap">
                {apmHtml}
              </pre>
            </div>
          </div>
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
