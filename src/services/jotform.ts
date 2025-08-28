import React from 'react';
import { JotformConfig } from '../types';

export class JotformService {
  private static config: JotformConfig = {
    contactFormId: import.meta.env.VITE_JOTFORM_CONTACT_ID || '240000000000000',
    newsletterFormId: import.meta.env.VITE_JOTFORM_NEWSLETTER_ID || '240000000000001',
    bookOrderFormId: import.meta.env.VITE_JOTFORM_BOOK_ORDER_ID || '240000000000002',
    feedbackFormId: import.meta.env.VITE_JOTFORM_FEEDBACK_ID || '240000000000003',
    certificateFormId: import.meta.env.VITE_JOTFORM_CERTIFICATE_ID || '240000000000004',
  };

  // Generate Jotform embed URL
  static getEmbedUrl(formType: keyof JotformConfig, options: {
    height?: number;
    width?: number;
    theme?: 'light' | 'dark';
    hideTitle?: boolean;
  } = {}): string {
    const formId = this.config[formType];
    const { height = 500, width = 100, theme = 'light', hideTitle = true } = options;
    
    const params = new URLSearchParams({
      formHeight: height.toString(),
      formWidth: width.toString(),
      formTitle: hideTitle ? '0' : '1',
      theme: theme,
    });

    return `https://form.jotform.com/${formId}?${params.toString()}`;
  }

  // Generate Jotform iframe HTML
  static getIframeHtml(formType: keyof JotformConfig, options: {
    height?: number;
    width?: string;
    className?: string;
    theme?: 'light' | 'dark';
  } = {}): string {
    const { height = 500, width = '100%', className = '', theme = 'light' } = options;
    const embedUrl = this.getEmbedUrl(formType, { height, theme });
    
    return `
      <iframe
        id="JotFormIFrame-${this.config[formType]}"
        title="Jotform"
        onload="window.parent.scrollTo(0,0)"
        allowtransparency="true"
        allowfullscreen="true"
        allow="geolocation; microphone; camera"
        src="${embedUrl}"
        frameborder="0"
        style="min-width:100%;max-width:100%;height:${height}px;border:none;"
        scrolling="no"
        class="${className}"
      >
      </iframe>
    `;
  }

  // Create Jotform React component
  static createJotformComponent(formType: keyof JotformConfig, options: {
    height?: number;
    className?: string;
    theme?: 'light' | 'dark';
    onLoad?: () => void;
    onSubmit?: (data: any) => void;
  } = {}) {
    const { height = 500, className = '', theme = 'light', onLoad, onSubmit } = options;
    
    return function JotformEmbed() {
      React.useEffect(() => {
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
          document.head.removeChild(script);
          window.removeEventListener('message', handleMessage);
        };
      }, []);

      return React.createElement('div', {
        className: `jotform-container ${className}`,
        dangerouslySetInnerHTML: {
          __html: JotformService.getIframeHtml(formType, { height, theme })
        }
      });
    };
  }

  // Open Jotform in popup
  static openPopup(formType: keyof JotformConfig, options: {
    width?: number;
    height?: number;
    theme?: 'light' | 'dark';
  } = {}): Window | null {
    const { width = 600, height = 700, theme = 'light' } = options;
    const embedUrl = this.getEmbedUrl(formType, { theme });
    
    const left = (window.screen.width - width) / 2;
    const top = (window.screen.height - height) / 2;
    
    return window.open(
      embedUrl,
      'JotformPopup',
      `width=${width},height=${height},left=${left},top=${top},scrollbars=yes,resizable=yes`
    );
  }

  // Update form configuration (for admin panel)
  static updateConfig(newConfig: Partial<JotformConfig>): void {
    this.config = { ...this.config, ...newConfig };
  }

  // Get current configuration
  static getConfig(): JotformConfig {
    return { ...this.config };
  }

  // Validate form ID format
  static validateFormId(formId: string): boolean {
    return /^\d{15}$/.test(formId);
  }

  // Get form preview URL
  static getPreviewUrl(formId: string): string {
    return `https://form.jotform.com/${formId}`;
  }
}
