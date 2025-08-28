interface LogoProps {
  variant?: 'light' | 'dark';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export default function Logo({ variant = 'dark', size = 'md', className = '' }: LogoProps) {
  const iconSizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12'
  };

  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg'
  };

  const textColor = variant === 'light' ? 'text-white' : 'text-gray-900 dark:text-white';

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      {/* Logo Icon */}
      <div className={`${iconSizeClasses[size]} flex-shrink-0`}>
        <svg
          viewBox="0 0 40 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
        >
          {/* Globe/Earth Icon */}
          <circle
            cx="20"
            cy="20"
            r="18"
            stroke="currentColor"
            strokeWidth="2"
            className={variant === 'light' ? 'text-white' : 'text-primary-600'}
          />
          
          {/* Continents */}
          <path
            d="M8 20c0-1.5 1-3 2.5-4s3.5-1 5.5-0.5c1 0.25 2 1 2.5 2s0.5 2.5 0 3.5c-0.5 1-1.5 1.5-2.5 1.5s-2-0.5-2.5-1.5"
            fill="currentColor"
            className={variant === 'light' ? 'text-white' : 'text-primary-600'}
            opacity="0.7"
          />
          
          <path
            d="M22 12c1 0 2 0.5 2.5 1.5s0.5 2 0 3c-0.5 1-1.5 1.5-2.5 1.5s-2-0.5-2.5-1.5c-0.5-1-0.5-2 0-3s1.5-1.5 2.5-1.5"
            fill="currentColor"
            className={variant === 'light' ? 'text-white' : 'text-primary-600'}
            opacity="0.5"
          />
          
          <path
            d="M28 25c0.5 0 1 0.25 1.25 0.75s0.25 1 0 1.5c-0.25 0.5-0.75 0.75-1.25 0.75s-1-0.25-1.25-0.75c-0.25-0.5-0.25-1 0-1.5s0.75-0.75 1.25-0.75"
            fill="currentColor"
            className={variant === 'light' ? 'text-white' : 'text-primary-600'}
            opacity="0.6"
          />
          
          {/* Travel Path */}
          <path
            d="M10 15 Q20 8 30 15 Q35 20 30 25 Q20 32 10 25 Q5 20 10 15"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeDasharray="2,2"
            fill="none"
            className={variant === 'light' ? 'text-white' : 'text-secondary-500'}
            opacity="0.8"
          />
          
          {/* Airplane */}
          <g transform="translate(25, 10) rotate(45)">
            <path
              d="M0 2 L4 0 L6 1 L4 2 L6 3 L4 4 L0 2 Z"
              fill="currentColor"
              className={variant === 'light' ? 'text-white' : 'text-accent-600'}
            />
          </g>
        </svg>
      </div>
      
      {/* Logo Text */}
      <div className="flex flex-col">
        <span className={`font-serif font-bold ${textSizeClasses[size]} leading-tight ${textColor}`}>
          The Sunday
        </span>
        <span className={`font-serif font-bold ${textSizeClasses[size]} leading-tight ${textColor}`}>
          Traveller
        </span>
      </div>
    </div>
  );
}

// Separate components for specific use cases
export function LogoLight({ size = 'md', className = '' }: Omit<LogoProps, 'variant'>) {
  return <Logo variant="light" size={size} className={className} />;
}

export function LogoDark({ size = 'md', className = '' }: Omit<LogoProps, 'variant'>) {
  return <Logo variant="dark" size={size} className={className} />;
}

// Icon only version
export function LogoIcon({ variant = 'dark', size = 'md', className = '' }: LogoProps) {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12'
  };

  return (
    <div className={`${sizeClasses[size]} flex-shrink-0 ${className}`}>
      <svg
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        <circle
          cx="20"
          cy="20"
          r="18"
          stroke="currentColor"
          strokeWidth="2"
          className={variant === 'light' ? 'text-white' : 'text-primary-600'}
        />
        
        <path
          d="M8 20c0-1.5 1-3 2.5-4s3.5-1 5.5-0.5c1 0.25 2 1 2.5 2s0.5 2.5 0 3.5c-0.5 1-1.5 1.5-2.5 1.5s-2-0.5-2.5-1.5"
          fill="currentColor"
          className={variant === 'light' ? 'text-white' : 'text-primary-600'}
          opacity="0.7"
        />
        
        <path
          d="M10 15 Q20 8 30 15 Q35 20 30 25 Q20 32 10 25 Q5 20 10 15"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeDasharray="2,2"
          fill="none"
          className={variant === 'light' ? 'text-white' : 'text-secondary-500'}
          opacity="0.8"
        />
        
        <g transform="translate(25, 10) rotate(45)">
          <path
            d="M0 2 L4 0 L6 1 L4 2 L6 3 L4 4 L0 2 Z"
            fill="currentColor"
            className={variant === 'light' ? 'text-white' : 'text-accent-600'}
          />
        </g>
      </svg>
    </div>
  );
}
