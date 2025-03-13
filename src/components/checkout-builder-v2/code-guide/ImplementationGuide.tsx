
import React from "react";

const ImplementationGuide: React.FC = () => {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-medium mb-2">1. Backend Setup</h3>
        <p className="text-sm text-gray-600">
          Create an API endpoint on your server to generate a Primer client session token. This endpoint should:
        </p>
        <ul className="list-disc list-inside text-sm text-gray-600 mt-2 ml-4 space-y-1">
          <li>Accept details about the order (amount, currency, etc.)</li>
          <li>Call Primer's API to create a client session</li>
          <li>Return the client token to your frontend</li>
        </ul>
      </div>
      
      <div>
        <h3 className="text-lg font-medium mb-2">2. Frontend Integration</h3>
        <p className="text-sm text-gray-600">
          Choose the appropriate implementation based on your tech stack:
        </p>
        <ul className="list-disc list-inside text-sm text-gray-600 mt-2 ml-4 space-y-1">
          <li>HTML: Use for static sites or server-rendered pages</li>
          <li>JavaScript: Use for dynamic websites without a framework</li>
          <li>React: Use for React applications</li>
        </ul>
      </div>
      
      <div>
        <h3 className="text-lg font-medium mb-2">3. Handling Checkout Events</h3>
        <p className="text-sm text-gray-600">
          The code examples include event listeners for:
        </p>
        <ul className="list-disc list-inside text-sm text-gray-600 mt-2 ml-4 space-y-1">
          <li><code>primer-checkout-initialized</code>: When the SDK is ready</li>
          <li><code>primer-state-changed</code>: When the checkout state changes</li>
        </ul>
        <p className="text-sm text-gray-600 mt-2">
          Expand the event handlers to match your application needs, such as redirecting to a confirmation page after successful payment.
        </p>
      </div>
    </div>
  );
};

export default ImplementationGuide;
