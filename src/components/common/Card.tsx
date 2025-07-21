import type React from "react";

interface CardProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export const Card: React.FC<CardProps > = ({
    title,
    icon,
    children,
    className = "",
    
  }) => {
    return (
      <div
        
        className={`bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6
          hover:shadow-md transition-shadow cursor-default select-none
          hover:ring-2 hover:ring-blue-400 dark:hover:ring-blue-500
          ${className}`}
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="text-gray-600 dark:text-gray-300">{icon}</div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">{title}</h3>
        </div>
        {children}
      </div>
    );
  };
  
  