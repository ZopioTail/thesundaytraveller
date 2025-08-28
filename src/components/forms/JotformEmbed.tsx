import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { JotformService } from '../../services/jotform';
import { JotformConfig } from '../../types';

interface JotformEmbedProps {
  formType: keyof JotformConfig;
  height?: number;
  className?: string;
  theme?: 'light' | 'dark';
  onLoad?: () => void;
  onSubmit?: (data: any) => void;
}

export function JotformEmbed({
  formType,
  height = 500,
  className = '',
  theme = 'light',
  onLoad,
  onSubmit,
}: JotformEmbedProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Load Jotform script
    const script = document.createElement('script');
    script.src = 'https://cdn.jotfor.ms/s/umd/latest/for-form-embed-handler.js';
    script.async = true;
    document.head.appendChild(script);

    // Handle form events
    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== 'https://form.jotform.com') return;
      
      if (event.data.type === 'form-loaded' && onLoad) {
        onLoad();
      }
      
      if (event.data.type === 'form-submit' && onSubmit) {
        onSubmit(event.data);
      }
    };

    window.addEventListener('message', handleMessage);
    
    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
      window.removeEventListener('message', handleMessage);
    };
  }, [onLoad, onSubmit]);

  const iframeHtml = JotformService.getIframeHtml(formType, { height, theme, className });

  return (
    <div 
      ref={containerRef}
      className={`jotform-container ${className}`}
      dangerouslySetInnerHTML={{ __html: iframeHtml }}
    />
  );
}

interface JotformModalProps {
  isOpen: boolean;
  onClose: () => void;
  formType: keyof JotformConfig;
  title: string;
  description?: string;
  height?: number;
  theme?: 'light' | 'dark';
}

export function JotformModal({
  isOpen,
  onClose,
  formType,
  title,
  description,
  height = 600,
  theme = 'light',
}: JotformModalProps) {
  const [isLoading, setIsLoading] = useState(true);

  const handleFormLoad = () => {
    setIsLoading(false);
  };

  const handleFormSubmit = (data: any) => {
    console.log('Form submitted:', data);
    // Show success message
    setTimeout(() => {
      onClose();
    }, 2000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <div>
                <h3 className="text-xl font-serif font-bold text-gray-900 dark:text-white">
                  {title}
                </h3>
                {description && (
                  <p className="text-gray-600 dark:text-gray-400 mt-1">
                    {description}
                  </p>
                )}
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="relative">
              {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-white dark:bg-gray-800 z-10">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
                </div>
              )}
              
              <div className="overflow-y-auto" style={{ maxHeight: `${height}px` }}>
                <JotformEmbed
                  formType={formType}
                  height={height}
                  theme={theme}
                  onLoad={handleFormLoad}
                  onSubmit={handleFormSubmit}
                />
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

interface JotformButtonProps {
  formType: keyof JotformConfig;
  title: string;
  description?: string;
  buttonText: string;
  buttonClassName?: string;
  icon?: React.ComponentType<any>;
  height?: number;
  theme?: 'light' | 'dark';
}

export function JotformButton({
  formType,
  title,
  description,
  buttonText,
  buttonClassName = 'btn-primary',
  icon: Icon,
  height = 600,
  theme = 'light',
}: JotformButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className={buttonClassName}
      >
        {Icon && <Icon className="mr-2 h-5 w-5" />}
        {buttonText}
      </button>

      <JotformModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        formType={formType}
        title={title}
        description={description}
        height={height}
        theme={theme}
      />
    </>
  );
}
