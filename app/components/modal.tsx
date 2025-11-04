"use client";
import React, { useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

// --- Types ---
interface Route {
  type: string;
  number: string;
  details: string;
  stops: string[];
  fare:   number;
  duration?: string;
  frequency?: string;
}

interface ModalProps {
  isOpen: boolean;
  onCloseAction: () => void;
  route: Route | null;
  showBackdrop?: boolean;
  closeOnBackdropClick?: boolean;
}

// --- Custom Hook for Accessibility and Focus Management (Retained) ---
const useModalAccessibility = (
  isOpen: boolean,
  onCloseAction: () => void,
  modalRef: React.RefObject<HTMLDivElement | null>
) => {
  const previousFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.stopPropagation();
        onCloseAction();
      }

      if (event.key === "Tab" && isOpen && modalRef.current) {
        const focusableElements = modalRef.current.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );

        if (focusableElements.length === 0) return;

        const firstElement = focusableElements[0] as HTMLElement;
        const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

        if (event.shiftKey) {
          if (document.activeElement === firstElement) {
            lastElement.focus();
            event.preventDefault();
          }
        } else {
          if (document.activeElement === lastElement) {
            firstElement.focus();
            event.preventDefault();
          }
        }
      }
    };

    if (isOpen) {
      previousFocusRef.current = document.activeElement as HTMLElement;

      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";

      requestAnimationFrame(() => {
        if (modalRef.current) {
          modalRef.current.focus();
        }
      });
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
      
      if (previousFocusRef.current && document.body.contains(previousFocusRef.current)) {
        setTimeout(() => {
          previousFocusRef.current?.focus();
        }, 100); 
      }
    };
  }, [isOpen, onCloseAction, modalRef]);
};

// --- Framer Motion Variants (Simplified) ---
const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.2 } },
  exit: { opacity: 0, transition: { duration: 0.15 } }
};

const modalVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: {
      type: "tween", // Simple tween transition
      duration: 0.3
    }
  },
  exit: { 
    opacity: 0, 
    y: 10,
    transition: { duration: 0.2 }
  }
};

const listItemVariants = {
  hidden: { opacity: 0 },
  visible: (index: number) => ({
    opacity: 1,
    transition: { delay: index * 0.05 } // Very subtle stagger
  }),
};

// --- Modal Component ---
export default function SimpleRouteModal({ 
  isOpen, 
  onCloseAction, 
  route, 
  showBackdrop = true,
  closeOnBackdropClick = true
}: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  
  // Custom hook usage
  useModalAccessibility(isOpen, onCloseAction, modalRef);

  const handleBackdropClick = useCallback((e: React.MouseEvent) => {
    if (closeOnBackdropClick && e.target === e.currentTarget) {
      onCloseAction();
    }
  }, [closeOnBackdropClick, onCloseAction]);

  if (!route) return null;
  
  // A single, neutral color palette for minimalist design
  const primaryColor = 'blue';

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <motion.div
          className="fixed inset-0 flex items-center justify-center z-[1000] p-4"
          variants={backdropVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          onClick={handleBackdropClick}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
          aria-describedby="modal-description"
        >
          {/* Backdrop */}
          {showBackdrop && (
            <div className="absolute inset-0 bg-blur bg-opacity-40 backdrop-blur-sm" />
          )}
          
          {/* Modal Content */}
          <motion.div
            ref={modalRef}
            tabIndex={0}
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            // Simplified styling: max-w-lg, clean white background, moderate shadow, simpler border radius
            className="relative bg-white rounded-xl shadow-lg w-full max-w-lg md:max-w-xl max-h-[95vh] overflow-hidden focus:outline-none"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button: Simple, square-ish design */}
            <motion.button
              onClick={onCloseAction}
              className="absolute top-3 right-3 bg-gray-50 hover:bg-gray-200 transition-all rounded-md w-8 h-8 flex items-center justify-center text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 z-20"
              aria-label="Close modal"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </motion.button>

            <div className="relative z-10 overflow-y-auto max-h-[95vh]">
              <div className="p-6"> 
                
                {/* Route Header */}
                <div className="border-b pb-4 mb-4">
                  <span className={`text-sm font-semibold text-${primaryColor}-600`}>
                    {route.type}
                  </span>
                  
                  <h1 id="modal-title" className="text-3xl font-bold text-gray-900 mt-1">
                    Route {route.number}
                  </h1>
                  
                  <p id="modal-description" className="text-gray-500 text-base mt-2">
                    {route.details}
                  </p>
                </div>

                {/* Route Information Cards (Simple grid, uniform subtle background) */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-gray-50 rounded-lg p-3 text-center border hover:bg-gray-100 hover:shadow-sm shadow-cyan-400   border-gray-100">
                    <p className={`text-xs text-${primaryColor}-600 font-medium mb-1`}>Min Fare</p>
                    <p className="text-lg font-bold text-gray-800">
                      Rs {route.fare} 
                    </p>
                  </div>
                  
                  {route.duration && (
                    <div className="bg-gray-50 rounded-lg p-3 text-center border border-gray-100">
                      <p className={`text-xs text-${primaryColor}-600 font-medium mb-1`}>Duration</p>
                      <p className="text-lg font-bold text-gray-800">{route.duration}</p>
                    </div>
                  )}
                  
                  {route.frequency && (
                    <div className="col-span-2 bg-gray-50 rounded-lg p-3 text-center border border-gray-100">
                      <p className={`text-xs text-${primaryColor}-600 font-medium mb-1`}>Frequency</p>
                      <p className="text-lg font-bold text-gray-800">{route.frequency}</p>
                    </div>
                  )}
                </div>

                {/* Stops Section */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold text-gray-800">Bus Stops</h2>
                    <span className="text-sm text-gray-500">
                      {route.stops.length} stops
                    </span>
                  </div>
                  
                  <div className="relative">
                    {/* Simple vertical line timeline */}
                    <div className="absolute left-[9px] top-0 bottom-0 w-0.5 bg-gray-300" />
                    
                    {/* Stops List */}
                    <ul className="space-y-3 max-h-72 overflow-y-auto pr-3">
                      {route.stops.map((stop, index) => {
                          const isFirst = index === 0;
                          const isLast = index === route.stops.length - 1;

                          return (
                            <motion.li
                              key={`${stop}-${index}`}
                              custom={index}
                              variants={listItemVariants}
                              initial="hidden"
                              animate="visible"
                              className="flex items-start space-x-4 relative pl-4" // Added left padding for stop content
                            >
                              {/* Simple Stop Marker */}
                              <div className={`absolute left-0 top-1 w-4 h-4 rounded-full border-2 z-10 
                                ${isFirst ? 'bg-green-500 border-green-700' : isLast ? 'bg-red-500 border-red-700' : 'bg-blue-100 border-blue-500'}`}
                              />
                              
                              <div className="flex-1 min-w-0 pt-0.5 pb-1">
                                <p className="text-gray-700 ml-1.5 font-medium text-base leading-snug">
                                   {stop}
                                </p>
                                {isFirst && (
                                  <span className="mt-0.5 text-xs text-green-600 bg-green-50 px-1.5 rounded">
                                    Start
                                  </span>
                                )}
                                {isLast && (
                                  <span className="mt-0.5 text-xs text-red-600 bg-red-50 px-1.5 rounded">
                                    End
                                  </span>
                                )}
                              </div>
                            </motion.li>
                          );
                      })}
                    </ul>
                  </div>
                </div>

                {/* Footer Action */}
                <div className="mt-6 pt-4 border-t border-gray-100">
                    <button 
                        onClick={onCloseAction}
                        className={`w-full py-2.5 rounded-lg text-base font-semibold text-white bg-${primaryColor}-600 hover:bg-${primaryColor}-700 transition focus:outline-none focus:ring-2 focus:ring-${primaryColor}-500 focus:ring-offset-2`}
                    >
                        Close Details
                    </button>
                </div>

              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
