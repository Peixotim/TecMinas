"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { trackModalOpen, trackModalClose } from "@/components/lib/metaEvents";

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  modalType?: string;
  courseName?: string;
};

export default function Modal({
  isOpen,
  onClose,
  children,
  modalType = "subscription",
  courseName,
}: ModalProps) {
  const modalContentRef = useRef<HTMLDivElement>(null);
  const hasTrackedOpen = useRef(false);

  useEffect(() => {
    if (isOpen && !hasTrackedOpen.current) {
      hasTrackedOpen.current = true;
      trackModalOpen(modalType);
    } else if (!isOpen) {
      hasTrackedOpen.current = false;
    }
  }, [isOpen, modalType, courseName]);

  useEffect(() => {
    if (!isOpen && hasTrackedOpen.current) {
      trackModalClose(modalType);
      hasTrackedOpen.current = false;
    }
  }, [isOpen, modalType]);

  useEffect(() => {
    const handleEscKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEscKeyDown);
    return () => document.removeEventListener("keydown", handleEscKeyDown);
  }, [onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-md"
          onClick={onClose}
        >
          <motion.div
            ref={modalContentRef}
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="relative w-full max-w-lg mx-4 bg-white rounded-2xl shadow-2xl p-8"
            onClick={(e) => e.stopPropagation()}
          >
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
