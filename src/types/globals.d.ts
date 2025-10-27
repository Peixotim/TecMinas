
export {};

declare global {
  interface Window {
    fbq?: (
      event: string,
      action: string,
      options?: Record<string, any>
    ) => void;
  }
}