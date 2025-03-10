import React, { useState } from "react";
import { DragDropContext } from "react-beautiful-dnd";
import Navbar from "@/components/Navbar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ComponentList, { availableComponents, ComponentConfig } from "@/components/checkout-builder/ComponentList";
import StyleEditor, { initialStyleVariables } from "@/components/checkout-builder/StyleEditor";
import LayoutBuilder from "@/components/checkout-builder/LayoutBuilder";
import CodeGenerator from "@/components/checkout-builder/CodeGenerator";

interface DragItem {
  id: string;
  content: string;
  config?: {
    label?: string;
    placeholder?: string;
    ariaLabel?: string;
    spaceSmall?: string;
  };
  originalComponent: ComponentConfig;
}

const CheckoutBuilder: React.FC = () => {
  const [styleVariables, setStyleVariables] = useState(initialStyleVariables);
  
  const [rows, setRows] = useState<{ id: string; components: DragItem[] }[]>([
    { id: "row-1", components: [] }
  ]);

  const addRow = () => {
    setRows([...rows, { id: `row-${rows.length + 1}`, components: [] }]);
  };

  const removeRow = (rowId: string) => {
    const rowToRemove = rows.find(row => row.id === rowId);
    
    setRows(rows.filter(row => row.id !== rowId));
  };

  const handleStyleChange = (variableName: string, value: string) => {
    setStyleVariables({
      ...styleVariables,
      [variableName]: value
    });
  };

  const onDragEnd = (result: any) => {
    const { source, destination } = result;
    
    if (!destination) return;
    
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) return;
    
    if (source.droppableId === "components") {
      const componentId = result.draggableId;
      const component = availableComponents.find(c => c.id === componentId);
      
      if (component && destination.droppableId.startsWith("row-")) {
        const newItem: DragItem = {
          id: `${component.id}-${Date.now()}`,
          content: component.element,
          originalComponent: component,
          config: {
            label: component.defaultLabel,
            placeholder: component.defaultPlaceholder,
            ariaLabel: component.defaultAriaLabel,
          }
        };
        
        const newRows = [...rows];
        const rowIndex = newRows.findIndex(row => row.id === destination.droppableId);
        
        if (rowIndex !== -1) {
          newRows[rowIndex].components.splice(destination.index, 0, newItem);
          setRows(newRows);
        }
      }
    } else if (source.droppableId.startsWith("row-")) {
      const sourceRowIndex = rows.findIndex(row => row.id === source.droppableId);
      
      if (sourceRowIndex !== -1) {
        const newRows = [...rows];
        const [movedItem] = newRows[sourceRowIndex].components.splice(source.index, 1);
        
        if (destination.droppableId.startsWith("row-")) {
          const destRowIndex = newRows.findIndex(row => row.id === destination.droppableId);
          
          if (destRowIndex !== -1) {
            newRows[destRowIndex].components.splice(destination.index, 0, movedItem);
          }
        } else if (destination.droppableId === "trash") {
          setRows(newRows);
        }
        
        setRows(newRows);
      }
    }
  };

  const updateComponentConfig = (rowId: string, componentId: string, config: Partial<DragItem['config']>) => {
    const newRows = rows.map(row => {
      if (row.id === rowId) {
        return {
          ...row,
          components: row.components.map(comp => {
            if (comp.id === componentId) {
              return {
                ...comp,
                config: { ...comp.config, ...config }
              };
            }
            return comp;
          })
        };
      }
      return row;
    });
    setRows(newRows);
  };

  const renderPreview = () => {
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
          const content = row.components[0].content;
          
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
              {content.includes('card-holder-name') && (
                <div className="bg-white border border-gray-300 rounded-md p-2 h-10 flex items-center px-3">
                  <span className="text-gray-400">Cardholder Name</span>
                </div>
              )}
              {content.includes('card-form-submit') && (
                <button 
                  className="bg-green-600 hover:bg-green-700 text-white rounded-md p-2 h-10 w-full font-medium transition-colors"
                  style={{ 
                    backgroundColor: styleVariables.primerColorBrand || "#18A94B",
                    borderRadius: styleVariables.primerRadiusBase || "16px" 
                  }}
                >
                  Pay Now
                </button>
              )}
            </div>
          );
        } else {
          return (
            <div key={row.id} className="flex gap-4 mb-4">
              {row.components.map((component, compIndex) => {
                const content = component.content;
                
                return (
                  <div key={component.id} className="flex-1">
                    {content.includes('card-number') && (
                      <div 
                        className="bg-white border border-gray-300 rounded-md p-2 h-10 flex items-center px-3"
                        style={{ 
                          borderRadius: styleVariables.primerRadiusBase || "16px",
                          backgroundColor: styleVariables.primerColorBackground || "white" 
                        }}
                      >
                        <span className="text-gray-400">•••• •••• •••• ••••</span>
                      </div>
                    )}
                    {content.includes('card-expiry') && (
                      <div 
                        className="bg-white border border-gray-300 rounded-md p-2 h-10 flex items-center px-3"
                        style={{ 
                          borderRadius: styleVariables.primerRadiusBase || "16px",
                          backgroundColor: styleVariables.primerColorBackground || "white"
                        }}
                      >
                        <span className="text-gray-400">MM/YY</span>
                      </div>
                    )}
                    {content.includes('cvv') && (
                      <div 
                        className="bg-white border border-gray-300 rounded-md p-2 h-10 flex items-center px-3"
                        style={{ 
                          borderRadius: styleVariables.primerRadiusBase || "16px",
                          backgroundColor: styleVariables.primerColorBackground || "white"
                        }}
                      >
                        <span className="text-gray-400">123</span>
                      </div>
                    )}
                    {content.includes('card-holder-name') && (
                      <div 
                        className="bg-white border border-gray-300 rounded-md p-2 h-10 flex items-center px-3"
                        style={{ 
                          borderRadius: styleVariables.primerRadiusBase || "16px",
                          backgroundColor: styleVariables.primerColorBackground || "white"
                        }}
                      >
                        <span className="text-gray-400">Cardholder Name</span>
                      </div>
                    )}
                    {content.includes('card-form-submit') && (
                      <button 
                        className="hover:opacity-90 text-white p-2 h-10 w-full font-medium transition-colors"
                        style={{ 
                          backgroundColor: styleVariables.primerColorBrand || "#18A94B",
                          borderRadius: styleVariables.primerRadiusBase || "16px" 
                        }}
                      >
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

    const previewStyle: React.CSSProperties = {
      fontFamily: styleVariables.primerTypographyBrand || "'Poppins', sans-serif",
      padding: `calc(${styleVariables.primerSpaceBase || "4px"} * 4)`,
      borderRadius: styleVariables.primerRadiusBase || "16px",
      backgroundColor: styleVariables.primerColorBackground || "transparent",
    };

    const focusStyle = {
      boxShadow: `0 0 0 2px ${styleVariables.primerColorFocus || "#DE00D1"}`,
    };

    return (
      <div 
        className="bg-white border border-gray-200 rounded-md p-6 shadow-sm"
        style={previewStyle}
      >
        <h3 
          className="text-lg font-medium mb-4"
          style={{ fontFamily: styleVariables.primerTypographyBrand || "'Poppins', sans-serif" }}
        >
          Checkout Preview
        </h3>
        
        <div 
          className="border border-gray-200 rounded-md p-6"
          style={{ borderRadius: styleVariables.primerRadiusBase || "16px" }}
        >
          <div className="mb-6">
            <p 
              className="text-base font-medium text-gray-700 mb-4"
              style={{ fontFamily: styleVariables.primerTypographyBrand || "'Poppins', sans-serif" }}
            >
              Card Payment
            </p>
            <div>
              {renderCardFormComponents()}
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
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
              <div className="lg:col-span-2">
                <LayoutBuilder rows={rows} onRemoveRow={removeRow} />
              </div>
              
              <div className="lg:col-span-1">
                <Tabs defaultValue="components" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="components">Components</TabsTrigger>
                    <TabsTrigger value="styles">Style Variables</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="components" className="mt-4">
                    <ComponentList onAddRow={addRow} />
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
            
            <div className="mb-8">
              {renderPreview()}
            </div>
            
            <div>
              <CodeGenerator 
                rows={rows}
                styleVariables={styleVariables}
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

