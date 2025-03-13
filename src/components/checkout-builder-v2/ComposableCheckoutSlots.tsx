
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Row, StyleVariables, CheckoutConfig } from "./types";
import CodeTabs from "./code-tabs/CodeTabs";
import ImplementationGuide from "./code-guide/ImplementationGuide";

export interface ComposableCheckoutSlotsProps {
  rows: Row[];
  cardFormRows: Row[];
  styleVariables: StyleVariables;
  checkoutConfig: CheckoutConfig;
}

const ComposableCheckoutSlots: React.FC<ComposableCheckoutSlotsProps> = ({
  rows,
  cardFormRows,
  styleVariables,
  checkoutConfig
}) => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Composable Checkout Slots Implementation</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600 mb-4">
            Use these code snippets to implement a checkout with Primer's Composable Checkout Web Components.
            The code is based on your configuration from the Checkout Builder and Card Form Builder.
          </p>
          
          <CodeTabs />
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Implementation Guide</CardTitle>
        </CardHeader>
        <CardContent>
          <ImplementationGuide />
        </CardContent>
      </Card>
    </div>
  );
};

export default ComposableCheckoutSlots;
