
import React from 'react';
import { cn } from '@/lib/utils';

interface StatusBadgeProps {
  status: string;
  className?: string;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className }) => {
  let statusColor = "";
  
  switch (status.toLowerCase()) {
    case 'passed':
      statusColor = "bg-green-100 text-green-700";
      break;
    case 'failed':
      statusColor = "bg-red-100 text-red-700";
      break;
    case 'pending':
      statusColor = "bg-yellow-100 text-yellow-700";
      break;
    case 'approved':
      statusColor = "bg-blue-100 text-blue-700";
      break;
    default:
      statusColor = "bg-gray-100 text-gray-700";
  }
  
  return (
    <span className={cn(
      "px-2.5 py-0.5 text-xs font-medium rounded-full inline-block",
      statusColor,
      className
    )}>
      {status}
    </span>
  );
};

export default StatusBadge;
