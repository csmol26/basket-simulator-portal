
import { useState } from "react";
import { CheckoutConfig, CardFormLayout, PaymentMethodDisplay } from "@/components/checkout-builder-v2/types";

export const useConfigManager = () => {
  const [checkoutConfig, setCheckoutConfig] = useState<CheckoutConfig>({
    layout: "single-page",
    cardFormLayout: "three-line",
    paymentMethodsDisplay: "radio",
    showCardholderName: true
  });

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

  return {
    checkoutConfig,
    updateCheckoutConfig,
    changeCardFormLayout,
    changePaymentMethodDisplay,
    toggleCardholderName
  };
};
