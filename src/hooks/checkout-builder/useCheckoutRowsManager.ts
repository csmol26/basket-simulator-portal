
import { useState } from "react";
import { DragItem, Row } from "@/components/checkout-builder-v2/types";

export const useCheckoutRowsManager = () => {
  const [checkoutRows, setCheckoutRows] = useState<Row[]>([
    { id: "checkout-row-1", components: [] }
  ]);

  const addCheckoutRow = () => {
    setCheckoutRows([...checkoutRows, { id: `checkout-row-${checkoutRows.length + 1}`, components: [] }]);
  };

  const removeCheckoutRow = (rowId: string) => {
    if (checkoutRows.length > 1) {
      setCheckoutRows(checkoutRows.filter(row => row.id !== rowId));
    }
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

  return {
    checkoutRows,
    setCheckoutRows,
    addCheckoutRow,
    removeCheckoutRow,
    updateCheckoutComponentConfig
  };
};
