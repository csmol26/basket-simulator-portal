
import { useState } from "react";
import { DragItem, Row, StyleVariables, CheckoutConfig, CardFormLayout, PaymentMethodDisplay, APMItem } from "@/components/checkout-builder-v2/types";
import { availableComponents } from "@/components/checkout-builder-v2/ComponentPalette";
import { initialStyleVariables } from "@/components/checkout-builder-v2/StyleVarsEditor";

// Available APMs for the checkout
export const availableAPMs: APMItem[] = [
  { id: 'paypal', name: 'PayPal', type: 'PAYPAL' },
  { id: 'applepay', name: 'Apple Pay', type: 'APPLE_PAY' },
  { id: 'googlepay', name: 'Google Pay', type: 'GOOGLE_PAY' },
  { id: 'klarna', name: 'Klarna', type: 'KLARNA' },
  { id: 'ideal', name: 'iDEAL', type: 'IDEAL' },
  { id: 'sofort', name: 'Sofort', type: 'SOFORT' },
  { id: 'afterpay', name: 'Afterpay', type: 'AFTERPAY' },
  { id: 'clearpay', name: 'Clearpay', type: 'CLEARPAY' },
  { id: 'bancontact', name: 'Bancontact', type: 'BANCONTACT' },
  { id: 'giropay', name: 'Giropay', type: 'GIROPAY' },
  { id: 'hoolah', name: 'Hoolah', type: 'HOOLAH' },
  { id: 'atome', name: 'Atome', type: 'ATOME' },
];

export const useCheckoutBuilderV2 = () => {
  const [styleVariables, setStyleVariables] = useState(initialStyleVariables);
  
  const [rows, setRows] = useState<Row[]>([
    { id: "row-1", components: [] }
  ]);

  // Checkout builder rows for APMs and card form
  const [checkoutRows, setCheckoutRows] = useState<Row[]>([
    { id: "checkout-row-1", components: [] }
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

  const addCheckoutRow = () => {
    setCheckoutRows([...checkoutRows, { id: `checkout-row-${checkoutRows.length + 1}`, components: [] }]);
  };

  const removeRow = (rowId: string) => {
    if (rows.length > 1) {
      setRows(rows.filter(row => row.id !== rowId));
    }
  };

  const removeCheckoutRow = (rowId: string) => {
    if (checkoutRows.length > 1) {
      setCheckoutRows(checkoutRows.filter(row => row.id !== rowId));
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

  const updateCheckoutComponentConfig = (rowId: string, componentId: string, config: Partial<DragItem['config']>) => {
    const newRows = checkoutRows.map(row => {
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
    setCheckoutRows(newRows);
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
    
    // Handle card form components drop
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
    } 
    // Handle items drag within card form rows
    else if (source.droppableId.startsWith("row-")) {
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
    // Handle APMs drag from palette to checkout
    else if (source.droppableId === "apm-palette") {
      // First, find the original APM data
      const apmId = result.draggableId.replace('palette-', '');
      const apm = availableAPMs.find(a => a.id === apmId);
      
      if (apm && destination.droppableId.startsWith('checkout-row-')) {
        const newItem: DragItem = {
          id: `apm-${apm.id}-${Date.now()}`,
          content: `<primer-payment-method type="${apm.type}"></primer-payment-method>`,
          originalComponent: {
            id: apm.id,
            name: apm.name,
            element: `<primer-payment-method type="${apm.type}"></primer-payment-method>`,
            isAPM: true,
            apmType: apm.type
          },
          config: {
            displayMode: "default",
          }
        };
        
        const newRows = [...checkoutRows];
        const rowIndex = newRows.findIndex(row => row.id === destination.droppableId);
        
        if (rowIndex !== -1) {
          newRows[rowIndex].components.splice(destination.index, 0, newItem);
          setCheckoutRows(newRows);
        }
      }
    }
    // Handle card form drop to checkout builder
    else if (source.droppableId === "card-form-component") {
      if (destination.droppableId.startsWith('checkout-row-')) {
        const newItem: DragItem = {
          id: `card-form-${Date.now()}`,
          content: `<primer-payment-method type="PAYMENT_CARD"></primer-payment-method>`,
          originalComponent: {
            id: 'card-form',
            name: 'Card Form',
            element: `<primer-payment-method type="PAYMENT_CARD"></primer-payment-method>`,
            isCardForm: true
          },
          config: {
            displayMode: "default",
          }
        };
        
        const newRows = [...checkoutRows];
        const rowIndex = newRows.findIndex(row => row.id === destination.droppableId);
        
        if (rowIndex !== -1) {
          newRows[rowIndex].components.splice(destination.index, 0, newItem);
          setCheckoutRows(newRows);
        }
      }
    }
    // Handle reordering components within checkout rows
    else if (source.droppableId.startsWith("checkout-row-")) {
      const sourceRowIndex = checkoutRows.findIndex(row => row.id === source.droppableId);
      
      if (sourceRowIndex !== -1) {
        const newRows = [...checkoutRows];
        const [movedItem] = newRows[sourceRowIndex].components.splice(source.index, 1);
        
        if (destination.droppableId.startsWith("checkout-row-")) {
          const destRowIndex = newRows.findIndex(row => row.id === destination.droppableId);
          
          if (destRowIndex !== -1) {
            newRows[destRowIndex].components.splice(destination.index, 0, movedItem);
          }
        } else if (destination.droppableId === "checkout-trash") {
          // Item dropped in trash, already removed from source
        }
        
        setCheckoutRows(newRows);
      }
    }
  };

  return {
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
  };
};
