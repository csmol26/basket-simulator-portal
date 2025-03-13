
import React from 'react';

interface CodeHeaderProps {
  language: string;
}

const CodeHeader: React.FC<CodeHeaderProps> = ({ language }) => {
  return (
    <div className="flex items-center justify-between mb-2">
      <div className="text-sm text-gray-500">
        {language.toUpperCase()} code
      </div>
    </div>
  );
};

export default CodeHeader;
