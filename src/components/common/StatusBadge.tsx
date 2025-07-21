import type React from "react";

interface StatusBadgeProps {
  status: "active" | "inactive" | "warning" | "error";
  label: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, label }) => {
  const getStatusStyles = () => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 border-green-200 dark:bg-green-900 dark:text-green-200 dark:border-green-800";
      case "warning":
        return "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900 dark:text-yellow-200 dark:border-yellow-800";
      case "error":
        return "bg-red-100 text-red-800 border-red-200 dark:bg-red-900 dark:text-red-200 dark:border-red-800";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200 dark:bg-zinc-800 dark:text-gray-200 dark:border-zinc-700";
    }
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusStyles()}`}
    >
      {label}
    </span>
  );
};
