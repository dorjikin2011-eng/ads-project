import React from 'react';

interface DashboardCardProps {
  title: string;
  value: string;
  subtitle: string;
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger';
}

const DashboardCard: React.FC<DashboardCardProps> = ({ title, value, subtitle, variant = 'default' }) => {
  
  const baseClasses = "rounded-lg shadow-md p-6";
  
  let variantClasses = {
    container: 'bg-white',
    title: 'text-text-secondary',
    value: 'text-primary',
    subtitle: 'text-text-secondary'
  };

  switch (variant) {
    case 'primary':
      variantClasses = {
        container: "bg-primary-darker text-white",
        title: 'text-white/80',
        value: 'text-white',
        subtitle: 'text-white/80',
      };
      break;
    case 'success':
      variantClasses = {
        container: 'bg-green-50',
        title: 'text-green-800',
        value: 'text-green-900',
        subtitle: 'text-green-800'
      };
      break;
    case 'warning':
      variantClasses = {
        container: 'bg-amber-50',
        title: 'text-amber-800',
        value: 'text-amber-900',
        subtitle: 'text-amber-800'
      };
      break;
    case 'danger':
        variantClasses = {
            container: 'bg-red-50',
            title: 'text-red-800',
            value: 'text-red-900',
            subtitle: 'text-red-800'
        };
      break;
  }

  return (
    <div className={`${baseClasses} ${variantClasses.container}`}>
      <h3 className={`text-sm font-medium ${variantClasses.title}`}>{title}</h3>
      <p className={`text-3xl font-bold mt-1 ${variantClasses.value}`}>{value}</p>
      <p className={`text-sm mt-2 ${variantClasses.subtitle}`}>{subtitle}</p>
    </div>
  );
};

export default DashboardCard;