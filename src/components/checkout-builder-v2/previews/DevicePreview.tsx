
import React from "react";
import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Row, StyleVariables, CheckoutConfig } from "../types";
import CheckoutSlotPreview from "./CheckoutSlotPreview";

interface DevicePreviewProps {
  rows: Row[];
  cardFormRows: Row[];
  styleVariables: StyleVariables;
  checkoutConfig: CheckoutConfig;
  devicePreview: "desktop" | "mobile";
  setDevicePreview: (device: "desktop" | "mobile") => void;
}

const DevicePreview: React.FC<DevicePreviewProps> = ({
  rows,
  cardFormRows,
  styleVariables,
  checkoutConfig,
  devicePreview,
  setDevicePreview
}) => {
  return (
    <>
      <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-2 sm:space-y-0">
        <div>
          <CardTitle>Checkout Preview</CardTitle>
          <p className="text-sm text-gray-500">
            Preview of your merged checkout configuration
          </p>
        </div>
        <TabsList>
          <TabsTrigger 
            value="desktop" 
            onClick={() => setDevicePreview("desktop")}
            className={devicePreview === "desktop" ? "bg-primary text-primary-foreground" : ""}
          >
            Desktop
          </TabsTrigger>
          <TabsTrigger 
            value="mobile" 
            onClick={() => setDevicePreview("mobile")}
            className={devicePreview === "mobile" ? "bg-primary text-primary-foreground" : ""}
          >
            Mobile
          </TabsTrigger>
        </TabsList>
      </CardHeader>
      <CardContent>
        <div className={devicePreview === "mobile" ? "max-w-[375px] mx-auto" : ""}>
          <div 
            className="border rounded-lg p-6"
            style={{
              backgroundColor: styleVariables.primerColorBackground || "white",
              fontFamily: styleVariables.primerTypographyBrand,
              borderRadius: styleVariables.primerRadiusBase,
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
              borderColor: styleVariables.primerColorBorder,
              color: styleVariables.primerColorTextPrimary
            }}
          >
            <div className="text-center mb-6">
              <h2 className="text-2xl font-semibold" style={{ color: styleVariables.primerColorBrand }}>
                Checkout
              </h2>
              <p className="text-sm text-gray-500">
                Secure checkout powered by Primer
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Order Summary */}
              <div className="space-y-4">
                <h3 className="font-medium" style={{ color: styleVariables.primerColorTextPrimary }}>Order Summary</h3>
                <div 
                  className="bg-gray-50 p-4 rounded-md" 
                  style={{ 
                    borderRadius: styleVariables.primerRadiusBase,
                    borderColor: styleVariables.primerColorBorder
                  }}
                >
                  <div className="flex justify-between mb-2">
                    <span style={{ color: styleVariables.primerColorTextPrimary }}>Product</span>
                    <span style={{ color: styleVariables.primerColorTextPrimary }}>$99.00</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span style={{ color: styleVariables.primerColorTextPrimary }}>Tax</span>
                    <span style={{ color: styleVariables.primerColorTextPrimary }}>$9.90</span>
                  </div>
                  <div 
                    className="border-t pt-2 mt-2 flex justify-between font-medium"
                    style={{ borderColor: styleVariables.primerColorBorder }}
                  >
                    <span style={{ color: styleVariables.primerColorTextPrimary }}>Total</span>
                    <span style={{ color: styleVariables.primerColorTextPrimary }}>$108.90</span>
                  </div>
                </div>
              </div>
              
              {/* Payment Methods */}
              <div className="space-y-4">
                <h3 className="font-medium" style={{ color: styleVariables.primerColorTextPrimary }}>
                  Payment Methods
                </h3>
                <CheckoutSlotPreview 
                  rows={rows} 
                  cardFormRows={cardFormRows} 
                  styleVariables={styleVariables} 
                />
              </div>
            </div>
            
            <div className="mt-6 text-center text-xs text-gray-500">
              <p>Secured by Primer</p>
            </div>
          </div>
        </div>
      </CardContent>
    </>
  );
};

export default DevicePreview;
