import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import type { BookingModalOptions, BookingModalContextType } from "@/types/booking";

const BookingModalContext = createContext<BookingModalContextType | undefined>(undefined);

export function BookingModalProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [options, setOptions] = useState<BookingModalOptions>({
    source: "direct",
  });

  const openBookingModal = useCallback((opts?: BookingModalOptions) => {
    setOptions(opts || { source: "direct" });
    setIsOpen(true);
  }, []);

  const closeBookingModal = useCallback(() => {
    setIsOpen(false);
  }, []);

  return (
    <BookingModalContext.Provider
      value={{
        isOpen,
        options,
        openBookingModal,
        closeBookingModal,
      }}
    >
      {children}
    </BookingModalContext.Provider>
  );
}

const defaultContext: BookingModalContextType = {
  isOpen: false,
  options: { source: "direct" },
  openBookingModal: () => {},
  closeBookingModal: () => {},
};

export function useBookingModal(): BookingModalContextType {
  const context = useContext(BookingModalContext);
  return context ?? defaultContext;
}
