
import React from "react";
import { DragDropContext } from "react-beautiful-dnd";
import Navbar from "@/components/Navbar";
import LayoutBuilder from "@/components/checkout-builder/LayoutBuilder";
import CodeGenerator from "@/components/checkout-builder/CodeGenerator";
import Preview from "@/components/checkout-builder/Preview";
import BuilderTabs from "@/components/checkout-builder/BuilderTabs";
import { useCheckoutBuilder } from "@/hooks/useCheckoutBuilder";
import { StyleVariables } from "@/components/checkout-builder/types";

const CheckoutBuilder: React.FC = () => {
  const {
    rows,
    styleVariables,
    addRow,
    removeRow,
    handleStyleChange,
    updateComponentConfig,
    onDragEnd
  } = useCheckoutBuilder();

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      <main className="flex-1 py-8">
        <div className="max-w-6xl mx-auto px-4 md:px-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout Builder</h1>
          
          <DragDropContext onDragEnd={onDragEnd}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
              <div className="lg:col-span-2">
                <LayoutBuilder 
                  rows={rows} 
                  onRemoveRow={removeRow} 
                  updateComponentConfig={updateComponentConfig}
                  styleVariables={styleVariables}
                />
              </div>
              
              <BuilderTabs 
                rows={rows}
                onAddRow={addRow}
                onRemoveRow={removeRow}
                styleVariables={styleVariables}
                handleStyleChange={handleStyleChange}
                updateComponentConfig={updateComponentConfig}
              />
            </div>
            
            <div className="mb-8">
              <Preview rows={rows} styleVariables={styleVariables} />
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
