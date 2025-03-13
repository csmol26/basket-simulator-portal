import { StyleVariables, CheckoutConfig } from '../types';
import { jsonToCssVariable } from '../StyleVarsEditor';

/**
 * Generates HTML structure with checkout components
 */
export const generateHTMLCode = (checkoutConfig: CheckoutConfig) => {
  let paymentMethodsHtml = '';
  
  // Generate different payment method display based on config
  if (checkoutConfig.paymentMethodsDisplay === 'radio') {
    paymentMethodsHtml = `
  <!-- Radio Button Style Payment Methods -->
  <div class="payment-methods-radio">
    <div class="payment-method">
      <input type="radio" id="card-payment" name="payment-method" checked />
      <label for="card-payment">Card Payment</label>
      <primer-payment-method type="PAYMENT_CARD"></primer-payment-method>
    </div>
    
    <!-- Method for rendering specific APMs -->
    <div class="payment-method">
      <input type="radio" id="paypal" name="payment-method" />
      <label for="paypal">PayPal</label>
      <primer-payment-method type="PAYPAL"></primer-payment-method>
    </div>
    
    <!-- Generic method for rendering all other APMs -->
    {/* APMs can be rendered dynamically */}
    {/* 
    <div class="other-methods">
      {otherMethods.map((method) => (
        <div key={method.type} class="payment-method">
          <input type="radio" id={method.id} name="payment-method" />
          <label for={method.id}>{method.name}</label>
          <primer-payment-method type={method.type}></primer-payment-method>
        </div>
      ))}
    </div>
    */}
  </div>`;
  } else if (checkoutConfig.paymentMethodsDisplay === 'dropdown') {
    paymentMethodsHtml = `
  <!-- Dropdown Style Payment Methods -->
  <div class="payment-methods-dropdown">
    <select id="payment-method-select" class="payment-method-select">
      <option value="card" selected>Card Payment</option>
      <option value="paypal">PayPal</option>
      <option value="applepay">Apple Pay</option>
      {/* Other APMs can be added as options */}
      {/* 
      {otherMethods.map((method) => (
        <option key={method.id} value={method.id}>{method.name}</option>
      ))}
      */}
    </select>
    
    <div class="payment-method-content" id="card-content">
      <primer-payment-method type="PAYMENT_CARD"></primer-payment-method>
    </div>
    
    <div class="payment-method-content" id="paypal-content" style="display: none;">
      <primer-payment-method type="PAYPAL"></primer-payment-method>
    </div>
    
    <div class="payment-method-content" id="applepay-content" style="display: none;">
      <primer-payment-method type="APPLE_PAY"></primer-payment-method>
    </div>
    
    {/* Other APM method contents would go here */}
    {/* 
    {otherMethods.map((method) => (
      <div key={method.id} class="payment-method-content" id={\`\${method.id}-content\`} style="display: none;">
        <primer-payment-method type={method.type}></primer-payment-method>
      </div>
    ))}
    */}
  </div>`;
  } else if (checkoutConfig.paymentMethodsDisplay === 'buttons') {
    paymentMethodsHtml = `
  <!-- Button Style Payment Methods -->
  <div class="payment-methods-buttons">
    <div class="payment-methods-nav">
      <button class="payment-method-button active" data-method="card">Card Payment</button>
      <button class="payment-method-button" data-method="paypal">PayPal</button>
      <button class="payment-method-button" data-method="applepay">Apple Pay</button>
      {/* Other APM buttons can be added here */}
      {/* 
      {otherMethods.map((method) => (
        <button key={method.id} class="payment-method-button" data-method={method.id}>{method.name}</button>
      ))}
      */}
    </div>
    
    <div class="payment-method-content" id="card-content">
      <primer-payment-method type="PAYMENT_CARD"></primer-payment-method>
    </div>
    
    <div class="payment-method-content" id="paypal-content" style="display: none;">
      <primer-payment-method type="PAYPAL"></primer-payment-method>
    </div>
    
    <div class="payment-method-content" id="applepay-content" style="display: none;">
      <primer-payment-method type="APPLE_PAY"></primer-payment-method>
    </div>
    
    {/* Other APM contents would go here */}
    {/* 
    {otherMethods.map((method) => (
      <div key={method.id} class="payment-method-content" id={\`\${method.id}-content\`} style="display: none;">
        <primer-payment-method type={method.type}></primer-payment-method>
      </div>
    ))}
    */}
  </div>`;
  } else {
    // Tabs layout
    paymentMethodsHtml = `
  <!-- Tabbed Style Payment Methods -->
  <div class="payment-methods-tabs">
    <div class="payment-methods-nav">
      <div class="payment-method-tab active" data-tab="card">Card Payment</div>
      <div class="payment-method-tab" data-tab="paypal">PayPal</div>
      <div class="payment-method-tab" data-tab="applepay">Apple Pay</div>
      {/* Other APM tabs can be added here */}
      {/* 
      {otherMethods.map((method) => (
        <div key={method.id} class="payment-method-tab" data-tab={method.id}>{method.name}</div>
      ))}
      */}
    </div>
    
    <div class="payment-method-content" id="card-tab">
      <primer-payment-method type="PAYMENT_CARD"></primer-payment-method>
    </div>
    
    <div class="payment-method-content" id="paypal-tab" style="display: none;">
      <primer-payment-method type="PAYPAL"></primer-payment-method>
    </div>
    
    <div class="payment-method-content" id="applepay-tab" style="display: none;">
      <primer-payment-method type="APPLE_PAY"></primer-payment-method>
    </div>
    
    {/* Other APM tab contents would go here */}
    {/* 
    {otherMethods.map((method) => (
      <div key={method.id} class="payment-method-content" id={\`\${method.id}-tab\`} style="display: none;">
        <primer-payment-method type={method.type}></primer-payment-method>
      </div>
    ))}
    */}
  </div>`;
  }

  // Generate card form based on layout setting
  let cardFormContent = '';
  
  if (checkoutConfig.cardFormLayout === 'single-line') {
    cardFormContent = `
        <div class="single-line-form">
          <div class="form-row">
            <primer-input-card-number></primer-input-card-number>
            <primer-input-card-expiry></primer-input-card-expiry>
            <primer-input-cvv></primer-input-cvv>
          </div>
          ${checkoutConfig.showCardholderName ? `
          <div class="form-row">
            <primer-input-card-holder-name></primer-input-card-holder-name>
          </div>` : ''}
          <div class="form-row">
            <primer-card-form-submit></primer-card-form-submit>
          </div>
        </div>`;
  } else if (checkoutConfig.cardFormLayout === 'two-line') {
    cardFormContent = `
        <div class="two-line-form">
          <div class="form-row">
            <primer-input-card-number></primer-input-card-number>
          </div>
          <div class="form-row">
            <div class="form-col">
              <primer-input-card-expiry></primer-input-card-expiry>
            </div>
            <div class="form-col">
              <primer-input-cvv></primer-input-cvv>
            </div>
          </div>
          ${checkoutConfig.showCardholderName ? `
          <div class="form-row">
            <primer-input-card-holder-name></primer-input-card-holder-name>
          </div>` : ''}
          <div class="form-row">
            <primer-card-form-submit></primer-card-form-submit>
          </div>
        </div>`;
  } else {
    // Three-line layout - default
    cardFormContent = `
        <div class="three-line-form">
          <div class="form-row">
            <primer-input-card-number></primer-input-card-number>
          </div>
          <div class="form-row">
            <primer-input-card-expiry></primer-input-card-expiry>
          </div>
          <div class="form-row">
            <primer-input-cvv></primer-input-cvv>
          </div>
          ${checkoutConfig.showCardholderName ? `
          <div class="form-row">
            <primer-input-card-holder-name></primer-input-card-holder-name>
          </div>` : ''}
          <div class="form-row">
            <primer-card-form-submit></primer-card-form-submit>
          </div>
        </div>`;
  }

  // Full HTML structure with APM code examples
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="stylesheet" href="styles.css">
  <title>Custom Checkout</title>
  <link rel="stylesheet" href="https://sdk.primer.io/web/primer-js/v0-latest/styles.css">
</head>
<body>
  <div class="checkout-container">
    <h1>Complete Your Order</h1>
    
    <primer-checkout client-token="\${clientToken}">
      <primer-main slot="main">
        <div slot="payments">
          ${paymentMethodsHtml}
          
          <primer-card-form>
            <div slot="card-form-content" class="card-form-layout">
              ${cardFormContent}
            </div>
          </primer-card-form>
          
          <!-- APM Sections -->
          <!-- Example 1: Specifically placed APM -->
          <div class="quick-checkout-section">
            <h2>Quick Checkout</h2>
            <primer-payment-method type="PAYPAL"></primer-payment-method>
          </div>
          
          <!-- Example 2: Multiple APMs in a grid -->
          <div class="other-methods">
            <h2>Alternative Payment Methods</h2>
            <div class="methods-grid">
              <!-- Method 1: Render specific APMs -->
              <primer-payment-method type="APPLE_PAY"></primer-payment-method>
              <primer-payment-method type="GOOGLE_PAY"></primer-payment-method>
              
              <!-- Method 2: Dynamic APM rendering -->
              {/* 
              {otherMethods.map((method) => (
                <div key={method.type} className="method-item">
                  <primer-payment-method
                    type={method.type}
                  ></primer-payment-method>
                </div>
              ))}
              */}
            </div>
          </div>
        </div>
      </primer-main>
    </primer-checkout>
  </div>
  
  <script>
    // Checkout initialization will go here
    // See the main.ts/js file for implementation
  </script>
</body>
</html>`;
};

/**
 * Generate CSS code with styles and custom properties
 */
export const generateCSSCode = (styleVariables: StyleVariables) => {
  const styleVars = Object.entries(styleVariables)
    .filter(([_, value]) => value !== '')
    .map(([key, value]) => `  ${jsonToCssVariable[key as keyof typeof jsonToCssVariable]}: ${value};`)
    .join('\n');

  return `:root {
${styleVars}
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  margin: 0;
  padding: 0;
  background-color: #f7f9fc;
  color: #333;
}

.checkout-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
}

h1 {
  text-align: center;
  margin-bottom: 2rem;
}

/* Card Form Layout Styles */
.card-form-layout {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.form-row {
  display: flex;
  gap: 16px;
  width: 100%;
}

.form-col {
  flex: 1;
}

/* Payment Methods Display Styles */
.payment-methods-radio .payment-method {
  margin-bottom: 16px;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: var(--primer-radius-base, 8px);
}

.payment-methods-radio label {
  margin-left: 8px;
  font-weight: 500;
}

.payment-methods-dropdown .payment-method-select {
  width: 100%;
  padding: 12px;
  margin-bottom: 16px;
  border: 1px solid #ddd;
  border-radius: var(--primer-radius-base, 8px);
}

.payment-methods-buttons .payment-methods-nav,
.payment-methods-tabs .payment-methods-nav {
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
}

.payment-methods-buttons .payment-method-button {
  padding: 10px 16px;
  background-color: #f5f5f5;
  border: 1px solid #ddd;
  border-radius: var(--primer-radius-base, 8px);
  cursor: pointer;
}

.payment-methods-buttons .payment-method-button.active {
  background-color: var(--primer-color-brand, #18A94B);
  color: white;
}

.payment-methods-tabs .payment-method-tab {
  padding: 10px 16px;
  border-bottom: 2px solid transparent;
  cursor: pointer;
}

.payment-methods-tabs .payment-method-tab.active {
  border-bottom-color: var(--primer-color-brand, #18A94B);
  font-weight: 500;
}

/* Alternative Payment Methods Styles */
.quick-checkout-section {
  margin: 24px 0;
  padding: 16px;
  background-color: #f9f9f9;
  border-radius: var(--primer-radius-base, 8px);
}

.quick-checkout-section h2 {
  font-size: 18px;
  margin-bottom: 16px;
}

.other-methods {
  margin: 24px 0;
}

.other-methods h2 {
  font-size: 18px;
  margin-bottom: 16px;
}

.methods-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 16px;
}

.method-item {
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: var(--primer-radius-base, 8px);
  background-color: white;
}

/* Layout specific styles */
.single-line-form .form-row:first-child {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr;
  gap: 16px;
}

/* Responsive Adjustments */
@media (max-width: 768px) {
  .checkout-container {
    padding: 1rem;
  }
  
  .single-line-form .form-row:first-child {
    grid-template-columns: 1fr;
  }
  
  .form-row {
    flex-direction: column;
  }
  
  .methods-grid {
    grid-template-columns: 1fr;
  }
}`;
};

/**
 * Generate TypeScript code for checkout initialization
 */
export const generateTSCode = (checkoutConfig: CheckoutConfig) => {
  // Depending on payment method display, generate different JS
  let paymentMethodToggleCode = '';
  
  if (checkoutConfig.paymentMethodsDisplay === 'dropdown') {
    paymentMethodToggleCode = `
  // Handle payment method dropdown change
  const paymentMethodSelect = document.getElementById('payment-method-select') as HTMLSelectElement;
  const cardContent = document.getElementById('card-content') as HTMLElement;
  const paypalContent = document.getElementById('paypal-content') as HTMLElement;
  const applepayContent = document.getElementById('applepay-content') as HTMLElement;
  // You can add more payment method contents here
  
  paymentMethodSelect?.addEventListener('change', (event) => {
    const selectedMethod = (event.target as HTMLSelectElement).value;
    
    // Hide all content sections
    [cardContent, paypalContent, applepayContent].forEach(content => {
      if (content) content.style.display = 'none';
    });
    
    // Show the selected content
    const selectedContent = document.getElementById(\`\${selectedMethod}-content\`);
    if (selectedContent) selectedContent.style.display = 'block';
  });`;
  } else if (checkoutConfig.paymentMethodsDisplay === 'buttons') {
    paymentMethodToggleCode = `
  // Handle payment method button clicks
  const paymentMethodButtons = document.querySelectorAll('.payment-method-button');
  const paymentMethodContents = document.querySelectorAll('.payment-method-content');
  
  paymentMethodButtons.forEach(button => {
    button.addEventListener('click', () => {
      // Remove active class from all buttons
      paymentMethodButtons.forEach(btn => btn.classList.remove('active'));
      
      // Add active class to clicked button
      button.classList.add('active');
      
      // Hide all content sections
      paymentMethodContents.forEach(content => (content as HTMLElement).style.display = 'none');
      
      // Show the selected content
      const methodName = button.getAttribute('data-method');
      const contentToShow = document.getElementById(\`\${methodName}-content\`);
      if (contentToShow) contentToShow.style.display = 'block';
    });
  });`;
  } else if (checkoutConfig.paymentMethodsDisplay === 'tabs') {
    paymentMethodToggleCode = `
  // Handle payment method tab clicks
  const paymentMethodTabs = document.querySelectorAll('.payment-method-tab');
  const paymentMethodContents = document.querySelectorAll('.payment-method-content');
  
  paymentMethodTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      // Remove active class from all tabs
      paymentMethodTabs.forEach(t => t.classList.remove('active'));
      
      // Add active class to clicked tab
      tab.classList.add('active');
      
      // Hide all content sections
      paymentMethodContents.forEach(content => (content as HTMLElement).style.display = 'none');
      
      // Show the selected content
      const tabName = tab.getAttribute('data-tab');
      const contentToShow = document.getElementById(\`\${tabName}-tab\`);
      if (contentToShow) contentToShow.style.display = 'block';
    });
  });`;
  }

  return `import { loadPrimer } from '@primer-io/primer-js';

// Sample payment methods data - you would get this from your backend in a real implementation
const paymentMethods = [
  { id: 'paypal', name: 'PayPal', type: 'PAYPAL' },
  { id: 'applepay', name: 'Apple Pay', type: 'APPLE_PAY' },
  { id: 'googlepay', name: 'Google Pay', type: 'GOOGLE_PAY' },
  { id: 'klarna', name: 'Klarna', type: 'KLARNA' },
  { id: 'ideal', name: 'iDEAL', type: 'IDEAL' },
  { id: 'sofort', name: 'Sofort', type: 'SOFORT' },
  { id: 'afterpay', name: 'Afterpay', type: 'AFTERPAY' },
];

// Find specific payment methods (example)
const payPal = paymentMethods.find(method => method.id === 'paypal');
const applePay = paymentMethods.find(method => method.id === 'applepay');

// Get all other payment methods
const otherMethods = paymentMethods.filter(method => 
  !['paypal', 'applepay'].includes(method.id)
);

// You'll need to replace this with your actual API call to fetch client token
async function fetchClientToken(clientId: string): Promise<{ success: boolean; clientToken?: string; error?: string }> {
  try {
    // In a real implementation, this would be a fetch call to your backend
    const response = await fetch('/api/primer/client-token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ clientId }),
    });
    
    if (!response.ok) {
      throw new Error(\`HTTP error! status: \${response.status}\`);
    }
    
    const data = await response.json();
    return { success: true, clientToken: data.clientToken };
  } catch (error) {
    console.error('Error fetching client token:', error);
    return { success: false, error: 'Failed to fetch client token' };
  }
}

(async function() {
  // Load Primer components
  await loadPrimer();
  
  // Replace with your client ID
  const response = await fetchClientToken('YOUR_CLIENT_ID');
  
  if (!response.success) {
    console.error('Failed to fetch client token:', response.error);
    return;
  }
  
  // Set the client token on the checkout element
  const checkoutElement = document.querySelector('primer-checkout');
  if (checkoutElement) {
    checkoutElement.setAttribute('client-token', response.clientToken || '');
  }
  ${paymentMethodToggleCode}
})();`;
};
