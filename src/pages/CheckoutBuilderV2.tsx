
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Copy, Code, Paintbrush, LayoutGrid, CreditCard, Eye } from "lucide-react";
import { toast } from "sonner";

import Navbar from "@/components/Navbar";
import CheckoutBuilder from "@/components/checkout-builder-v2/CheckoutBuilder";
import { useCheckoutBuilderV2 } from "@/hooks/useCheckoutBuilderV2";

const CheckoutBuilderV2: React.FC = () => {
  const {
    rows,
    checkoutRows,
    styleVariables,
    checkoutConfig,
    activeTheme,
    addRow,
    addCheckoutRow,
    removeRow,
    removeCheckoutRow,
    handleStyleChange,
    updateComponentConfig,
    updateCheckoutComponentConfig,
    updateCheckoutConfig,
    changeCardFormLayout,
    changePaymentMethodDisplay,
    toggleCardholderName,
    changeTheme,
    onDragEnd
  } = useCheckoutBuilderV2();

  // State for main tab view
  const [activeMainTab, setActiveMainTab] = useState<string>("checkout-builder");

  // Export functionality
  const handleExportCode = () => {
    try {
      // In a real implementation, this would generate and download files
      const blob = new Blob([JSON.stringify({
        rows,
        checkoutRows,
        styleVariables,
        checkoutConfig
      }, null, 2)], { type: 'application/json' });
      
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'checkout-config.json';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast.success("Checkout configuration exported successfully!");
    } catch (error) {
      toast.error("Failed to export configuration");
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      <main className="flex-1 py-8">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Checkout Builder V2</h1>
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleExportCode}
                className="flex items-center gap-2"
              >
                <Download size={16} />
                Export Code
              </Button>
              <div className="text-sm text-gray-500 ml-4">Powered by Primer.io</div>
            </div>
          </div>
          
          <Tabs value={activeMainTab} onValueChange={setActiveMainTab} className="w-full mb-8">
            <TabsList className="grid w-full grid-cols-4 mb-8">
              <TabsTrigger value="checkout-builder" className="flex items-center gap-2">
                <LayoutGrid size={16} />
                Checkout Builder
              </TabsTrigger>
              <TabsTrigger value="card-form" className="flex items-center gap-2">
                <CreditCard size={16} />
                Card Form
              </TabsTrigger>
              <TabsTrigger value="styles" className="flex items-center gap-2">
                <Paintbrush size={16} />
                UI Styles
              </TabsTrigger>
              <TabsTrigger value="code" className="flex items-center gap-2">
                <Code size={16} />
                Code
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="checkout-builder" className="mt-0">
              <CheckoutBuilder />
            </TabsContent>
            
            <TabsContent value="card-form" className="mt-0">
              {/* Main checkout builder component contains all functionality */}
              <CheckoutBuilder />
            </TabsContent>
            
            <TabsContent value="styles" className="mt-0">
              {/* Main checkout builder component contains all functionality */}
              <CheckoutBuilder />
            </TabsContent>
            
            <TabsContent value="code" className="mt-0">
              {/* Main checkout builder component contains all functionality */}
              <CheckoutBuilder />
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <footer className="bg-white border-t border-gray-100 py-6 mt-6">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
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

export default CheckoutBuilderV2;
