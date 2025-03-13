
import { useState } from "react";
import { DragItem, Row, StyleVariables, CheckoutConfig, CardFormLayout, PaymentMethodDisplay } from "@/components/checkout-builder-v2/types";
import { availableComponents } from "@/components/checkout-builder-v2/ComponentPalette";
import { initialStyleVariables } from "@/components/checkout-builder-v2/StyleVarsEditor";

export const useCheckoutBuilderV2 = () => {
  const [styleVariables, setStyleVariables] = useState(initialStyleVariables);
  
  const [rows, setRows] = useState<Row[]>([
    { id: "row-1", components: [] }
  ]);

  // New configuration state for checkout
  const [checkoutConfig, setCheckoutConfig] = useState<CheckoutConfig>({
    layout: "single-page",
    cardFormLayout: "three-line",
    paymentMethodsDisplay: "radio",
    showCardholderName: true
  });

  // Current active theme name
  const [activeTheme, setActiveTheme] = useState<string>("light");

  const addRow = () => {
    setRows([...rows, { id: `row-${rows.length + 1}`, components: [] }]);
  };

  const removeRow = (rowId: string) => {
    if (rows.length > 1) {
      setRows(rows.filter(row => row.id !== rowId));
    }
  };

  const handleStyleChange = (variableName: string, value: string) => {
    setStyleVariables({
      ...styleVariables,
      [variableName]: value
    });
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

  const updateCheckoutConfig = (updates: Partial<CheckoutConfig>) => {
    setCheckoutConfig({
      ...checkoutConfig,
      ...updates
    });
  };

  const changeCardFormLayout = (layout: CardFormLayout) => {
    updateCheckoutConfig({ cardFormLayout: layout });
  };

  const changePaymentMethodDisplay = (display: PaymentMethodDisplay) => {
    updateCheckoutConfig({ paymentMethodsDisplay: display });
  };

  const toggleCardholderName = (show: boolean) => {
    updateCheckoutConfig({ showCardholderName: show });
  };

  const changeTheme = (themeId: string) => {
    setActiveTheme(themeId);
    // In a real implementation, this would also update style variables
    // based on the selected theme
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
            spaceSmall: styleVariables.primerSpaceSmall,
            displayMode: "default",
            validation: {
              required: true,
              customErrorMessage: ""
            }
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
          // Item dropped in trash, already removed from source
        }
        
        setRows(newRows);
      }
    }
  };

  return {
    rows,
    styleVariables,
    checkoutConfig,
    activeTheme,
    addRow,
    removeRow,
    handleStyleChange,
    updateComponentConfig,
    updateCheckoutConfig,
    changeCardFormLayout,
    changePaymentMethodDisplay,
    toggleCardholderName,
    changeTheme,
    onDragEnd
  };
};
