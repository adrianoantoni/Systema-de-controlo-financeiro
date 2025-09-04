import React from 'react';
import { Button } from './Button';
import { PlusCircle } from 'lucide-react';

interface PageHeaderProps {
  title: string;
  description: string;
  buttonLabel?: string;
  onButtonClick?: () => void;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  description,
  buttonLabel,
  onButtonClick,
}) => {
  return (
    <div className="flex justify-between items-center mb-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
        <p className="text-gray-600 mt-1">{description}</p>
      </div>
      {buttonLabel && onButtonClick && (
        <Button onClick={onButtonClick} variant="primary">
          <PlusCircle className="h-4 w-4 mr-2" />
          {buttonLabel}
        </Button>
      )}
    </div>
  );
};
