
import { 
  useCardFormBuilder 
} from './checkout-builder/useCardFormBuilder';
import { 
  useCheckoutRowsManager 
} from './checkout-builder/useCheckoutRowsManager';
import { 
  useStylesManager 
} from './checkout-builder/useStylesManager';
import { 
  useConfigManager 
} from './checkout-builder/useConfigManager';
import { 
  useDragAndDrop 
} from './checkout-builder/useDragAndDrop';
import { availableAPMs } from '@/components/checkout-builder-v2/constants/checkoutBuilderConstants';

// Export the availableAPMs for backward compatibility
export { availableAPMs };

export const useCheckoutBuilderV2 = () => {
  // Separate hooks for different parts of the state
  const { 
    rows,
    setRows,
    addRow,
    removeRow,
    updateComponentConfig 
  } = useCardFormBuilder();

  const { 
    checkoutRows,
    setCheckoutRows,
    addCheckoutRow,
    removeCheckoutRow,
    updateCheckoutComponentConfig 
  } = useCheckoutRowsManager();

  const { 
    styleVariables,
    activeTheme,
    handleStyleChange,
    changeTheme 
  } = useStylesManager();

  const { 
    checkoutConfig,
    updateCheckoutConfig,
    changeCardFormLayout,
    changePaymentMethodDisplay,
    toggleCardholderName 
  } = useConfigManager();

  // Drag and drop handler
  const { onDragEnd } = useDragAndDrop(
    setRows,
    rows,
    setCheckoutRows,
    checkoutRows,
    styleVariables
  );

  // Return all the properties and methods for use in components
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
