import React from 'react';

interface DashboardCardProps {
  title: string;
  value: string | number;
  subtitle: string;
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info';
  trend?: {
    value: number;
    label: string;
    direction?: 'up' | 'down' | 'neutral';
  };
  icon?: React.ReactNode;
  loading?: boolean;
  onClick?: () => void;
  className?: string;
}

// Built-in icon components
const TrendingUpIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
  </svg>
);

const TrendingDownIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
  </svg>
);

const MinusIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
  </svg>
);

// Default icon components that can be used
const DefaultIcons = {
  Money: ({ className = "w-6 h-6" }: { className?: string }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  Users: ({ className = "w-6 h-6" }: { className?: string }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5 0c-.281.02-.559.06-.833.117" />
    </svg>
  ),
  Document: ({ className = "w-6 h-6" }: { className?: string }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  ),
  Clock: ({ className = "w-6 h-6" }: { className?: string }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
};

const DashboardCard: React.FC<DashboardCardProps> = ({ 
  title, 
  value, 
  subtitle, 
  variant = 'default',
  trend,
  icon,
  loading = false,
  onClick,
  className = ''
}) => {
  
  const baseClasses = "rounded-xl shadow-sm p-6 transition-all duration-200 border";
  const clickableClasses = onClick ? "cursor-pointer hover:shadow-md active:scale-[0.98] hover:border-gray-300" : "";
  
  let variantClasses = {
    container: 'bg-white border-gray-200',
    title: 'text-gray-600',
    value: 'text-gray-900',
    subtitle: 'text-gray-500',
    trendUp: 'text-green-600',
    trendDown: 'text-red-600',
    trendNeutral: 'text-gray-500',
    iconBg: 'bg-blue-50 text-blue-600'
  };

  switch (variant) {
    case 'primary':
      variantClasses = {
        container: "bg-blue-50 border-blue-200",
        title: 'text-blue-700',
        value: 'text-blue-900',
        subtitle: 'text-blue-600',
        trendUp: 'text-blue-700',
        trendDown: 'text-red-600',
        trendNeutral: 'text-blue-800',
        iconBg: 'bg-blue-100 text-blue-700'
      };
      break;
    case 'success':
      variantClasses = {
        container: 'bg-green-50 border-green-200',
        title: 'text-green-700',
        value: 'text-green-900',
        subtitle: 'text-green-600',
        trendUp: 'text-green-700',
        trendDown: 'text-red-600',
        trendNeutral: 'text-green-800',
        iconBg: 'bg-green-100 text-green-700'
      };
      break;
    case 'warning':
      variantClasses = {
        container: 'bg-amber-50 border-amber-200',
        title: 'text-amber-700',
        value: 'text-amber-900',
        subtitle: 'text-amber-600',
        trendUp: 'text-amber-700',
        trendDown: 'text-red-600',
        trendNeutral: 'text-amber-800',
        iconBg: 'bg-amber-100 text-amber-700'
      };
      break;
    case 'danger':
      variantClasses = {
        container: 'bg-red-50 border-red-200',
        title: 'text-red-700',
        value: 'text-red-900',
        subtitle: 'text-red-600',
        trendUp: 'text-red-700',
        trendDown: 'text-red-600',
        trendNeutral: 'text-red-800',
        iconBg: 'bg-red-100 text-red-700'
      };
      break;
    case 'info':
      variantClasses = {
        container: 'bg-cyan-50 border-cyan-200',
        title: 'text-cyan-700',
        value: 'text-cyan-900',
        subtitle: 'text-cyan-600',
        trendUp: 'text-cyan-700',
        trendDown: 'text-red-600',
        trendNeutral: 'text-cyan-800',
        iconBg: 'bg-cyan-100 text-cyan-700'
      };
      break;
  }

  const getTrendIcon = () => {
    if (!trend?.direction) return null;
    
    const iconClass = "w-4 h-4";
    
    switch (trend.direction) {
      case 'up':
        return <TrendingUpIcon className={`${iconClass} ${variantClasses.trendUp}`} />;
      case 'down':
        return <TrendingDownIcon className={`${iconClass} ${variantClasses.trendDown}`} />;
      case 'neutral':
        return <MinusIcon className={`${iconClass} ${variantClasses.trendNeutral}`} />;
      default:
        return null;
    }
  };

  const getTrendColorClass = () => {
    if (!trend?.direction) return variantClasses.trendNeutral;
    
    switch (trend.direction) {
      case 'up': return variantClasses.trendUp;
      case 'down': return variantClasses.trendDown;
      case 'neutral': return variantClasses.trendNeutral;
      default: return variantClasses.trendNeutral;
    }
  };

  const getTrendBackgroundClass = () => {
    if (!trend?.direction) return 'bg-gray-100';
    
    switch (trend.direction) {
      case 'up': return 'bg-green-100';
      case 'down': return 'bg-red-100';
      case 'neutral': return 'bg-gray-100';
      default: return 'bg-gray-100';
    }
  };

  if (loading) {
    return (
      <div className={`${baseClasses} ${clickableClasses} ${variantClasses.container} ${className} animate-pulse`}>
        <div className="flex justify-between items-start">
          <div className="space-y-3 flex-1">
            <div className="h-4 bg-gray-200 rounded w-1/3"></div>
            <div className="h-8 bg-gray-300 rounded w-1/2"></div>
            <div className="h-3 bg-gray-200 rounded w-2/3"></div>
          </div>
          <div className="w-10 h-10 rounded-full bg-gray-200 ml-4"></div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className={`${baseClasses} ${clickableClasses} ${variantClasses.container} ${className}`}
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => e.key === 'Enter' && onClick() : undefined}
    >
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <h3 className={`text-sm font-semibold tracking-wide ${variantClasses.title} mb-2`}>
            {title}
          </h3>
          
          <div className="flex items-baseline mb-2">
            <p className={`text-3xl font-bold ${variantClasses.value}`}>
              {value}
            </p>
            
            {trend && (
              <div className={`flex items-center ml-3 px-2 py-1 rounded-full ${getTrendBackgroundClass()} ${getTrendColorClass()}`}>
                {getTrendIcon()}
                <span className={`text-xs font-medium ml-1`}>
                  {trend.value > 0 ? '+' : ''}{trend.value}%
                </span>
              </div>
            )}
          </div>
          
          <div className="flex items-center justify-between mt-3">
            <p className={`text-sm ${variantClasses.subtitle}`}>
              {subtitle}
            </p>
            
            {trend?.label && (
              <span className={`text-xs font-medium px-2 py-1 rounded ${getTrendColorClass()} bg-opacity-20`}>
                {trend.label}
              </span>
            )}
          </div>
        </div>
        
        {icon && (
          <div className={`w-12 h-12 rounded-full flex items-center justify-center ml-4 ${variantClasses.iconBg}`}>
            <div className="w-6 h-6">
              {icon}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Export both the component and default icons for convenience
export { DefaultIcons };
export default DashboardCard;