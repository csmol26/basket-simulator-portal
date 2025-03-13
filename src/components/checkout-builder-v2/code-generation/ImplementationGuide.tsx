
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";

const ImplementationGuide: React.FC = () => {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="text-sm space-y-4 text-gray-500">
          <h3 className="text-base font-medium text-gray-700">Implementation Instructions</h3>
          <ol className="list-decimal list-inside space-y-2">
            <li>Download the generated files or copy the code to your project.</li>
            <li>Replace 'YOUR_CLIENT_ID' in main.ts with your actual Primer client ID.</li>
            <li>Implement the fetchClientToken function to get a token from your backend.</li>
            <li>Customize the styles in styles.css as needed to match your site's design.</li>
            <li>Include the primer-js and primer-checkout components in your application.</li>
          </ol>
          <p className="mt-4 text-xs">
            Note: This generated code provides a starting point. You may need to make additional adjustments based on your specific requirements and environment.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ImplementationGuide;
