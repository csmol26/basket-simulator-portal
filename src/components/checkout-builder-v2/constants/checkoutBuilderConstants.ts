
import { APMItem } from "../types";

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
