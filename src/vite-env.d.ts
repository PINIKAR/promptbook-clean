/// <reference types="vite/client" />

interface PayPalHostedButton {
  render(selector: string): void;
}

interface PayPalHostedButtons {
  (options: { hostedButtonId: string }): PayPalHostedButton;
}

interface PayPalNamespace {
  HostedButtons: PayPalHostedButtons;
}

interface Window {
  paypal?: PayPalNamespace;
}
