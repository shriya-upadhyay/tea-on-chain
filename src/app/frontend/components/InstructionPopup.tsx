"use client";

import { useState, useEffect } from "react";

interface InstructionPopupProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  showCloseButton?: boolean;
  autoClose?: boolean;
  autoCloseDelay?: number;
}

export default function InstructionPopup({
  isOpen,
  onClose,
  title,
  children,
  showCloseButton = true,
  autoClose = false,
  autoCloseDelay = 5000,
}: InstructionPopupProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      
      if (autoClose) {
        const timer = setTimeout(() => {
          onClose();
        }, autoCloseDelay);
        
        return () => clearTimeout(timer);
      }
    } else {
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, 200);
      
      return () => clearTimeout(timer);
    }
  }, [isOpen, onClose, autoClose, autoCloseDelay]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className={`absolute inset-0 bg-black/50 transition-opacity duration-200 ${
          isOpen ? "opacity-100" : "opacity-0"
        }`}
        onClick={onClose}
      />
      
      {/* Popup Content */}
      <div
        className={`relative bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[80vh] overflow-y-auto transition-all duration-200 ${
          isOpen ? "scale-100 opacity-100" : "scale-95 opacity-0"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-green-800">{title}</h2>
          {showCloseButton && (
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
        
        {/* Content */}
        <div className="p-6">
          {children}
        </div>
        
        {/* Footer */}
        {!autoClose && (
          <div className="flex justify-end p-6 border-t border-gray-200">
            <button
              onClick={onClose}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md font-medium transition-colors"
            >
              Got it
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// Example usage component
export function ExampleInstructionPopup() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="text-center">
      <button
        onClick={() => setIsOpen(true)}
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium transition-colors"
      >
        Show Instructions
      </button>

      <InstructionPopup
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="How to Use This Feature"
      >
        <div className="space-y-4 text-left">
          <div className="flex items-start space-x-3">
            <div className="w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0 mt-0.5">
              1
            </div>
            <div>
              <h4 className="font-medium text-gray-900">Connect Your Wallet</h4>
              <p className="text-sm text-gray-600 mt-1">
                Make sure you have a compatible wallet connected to the platform.
              </p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3">
            <div className="w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0 mt-0.5">
              2
            </div>
            <div>
              <h4 className="font-medium text-gray-900">Select Amount</h4>
              <p className="text-sm text-gray-600 mt-1">
                Choose how many tokens you want to stake or trade.
              </p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3">
            <div className="w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0 mt-0.5">
              3
            </div>
            <div>
              <h4 className="font-medium text-gray-900">Confirm Transaction</h4>
              <p className="text-sm text-gray-600 mt-1">
                Review the details and confirm your transaction in your wallet.
              </p>
            </div>
          </div>
        </div>
      </InstructionPopup>
    </div>
  );
} 