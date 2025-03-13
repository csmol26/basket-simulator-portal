
import React from "react";
import { Row, StyleVariables, CheckoutConfig } from "./types";
import CheckoutPreview from "./CheckoutPreview";
import ComponentPalette from "./ComponentPalette";
import CheckoutLayoutConfigPanel from "./CheckoutLayoutConfigPanel";
import CodePreviewPanel from "./CodePreviewPanel";
import { generatePaymentMethodsHtml } from "./CodeGenerator";
import GeneratedCode from "./GeneratedCode";

interface CheckoutBuilderPanelProps {
  checkoutRows: Row[];
  styleVariables: StyleVariables;
  checkoutConfig: CheckoutConfig;
  addCheckoutRow: () => void;
  removeCheckoutRow: (rowId: string) => void;
  updateCheckoutComponentConfig: (rowId: string, componentId: string, config: any) => void;
  changeCardFormLayout: (layout: any) => void;
  changePaymentMethodDisplay: (display: any) => void;
  toggleCardholderName: (show: boolean) => void;
  onDragEnd: (result: any) => void;
  cardFormRows: Row[];
}

const CheckoutBuilderPanel: React.FC<CheckoutBuilderPanelProps> = ({
  checkoutRows,
  styleVariables,
  checkoutConfig,
  addCheckoutRow,
  changeCardFormLayout,
  changePaymentMethodDisplay,
  toggleCardholderName,
  onDragEnd,
  cardFormRows
}) => {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-[1fr_3fr] gap-6">
      <div className="w-full space-y-6">
        <ComponentPalette onAddRow={addCheckoutRow} onDragEnd={onDragEnd} />
        <CheckoutLayoutConfigPanel 
          checkoutConfig={checkoutConfig}
          onChangeCardFormLayout={changeCardFormLayout}
          onChangePaymentMethodDisplay={changePaymentMethodDisplay}
          onToggleCardholderName={toggleCardholderName}
        />
      </div>
      
      <div className="space-y-6">
        <CheckoutPreview 
          rows={checkoutRows} 
          styleVariables={styleVariables}
          checkoutConfig={checkoutConfig}
          onDragEnd={onDragEnd}
        />
        
        <CodePreviewPanel 
          checkoutRows={checkoutRows}
          cardFormRows={cardFormRows}
          checkoutConfig={checkoutConfig}
          generateCode={() => generatePaymentMethodsHtml(cardFormRows, checkoutRows, checkoutConfig)} 
        />
        
        <GeneratedCode
          cardFormRows={cardFormRows}
          checkoutRows={checkoutRows}
          styleVariables={styleVariables}
          checkoutConfig={checkoutConfig}
        />
      </div>
    </div>
  );
};

export default CheckoutBuilderPanel;
