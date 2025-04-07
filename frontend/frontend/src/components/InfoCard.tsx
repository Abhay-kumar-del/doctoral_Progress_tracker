
import React from 'react';
import { cn } from '@/lib/utils';

interface InfoCardProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

const InfoCard: React.FC<InfoCardProps> = ({ title, children, className }) => {
  return (
    <div className={cn(
      "bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden transition-all duration-200 hover:shadow-md", 
      className
    )}>
      <div className="px-5 py-4 border-b border-gray-100">
        <h3 className="text-base font-semibold text-gray-900">{title}</h3>
      </div>
      <div className="p-5">
        {children}
      </div>
    </div>
  );
};

export default InfoCard;
