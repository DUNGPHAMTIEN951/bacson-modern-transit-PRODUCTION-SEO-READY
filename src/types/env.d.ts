/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_BOOKING_FORM_ENDPOINT?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

interface Window {
  dataLayer?: unknown[];
  gtag?: {
    (
      command: "event",
      eventName: "conversion",
      parameters: {
        send_to: string;
        value: number;
        currency: "VND";
        transaction_id: string;
      },
    ): void;
    (
      command: "set",
      target: "user_data",
      parameters: {
        email?: string;
        phone_number?: string;
      },
    ): void;
  };
}
