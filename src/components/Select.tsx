// src/components/Select.tsx
import React from 'react';

interface SelectProps {
  name: string;
  value: string;
  onChange: React.ChangeEventHandler<HTMLSelectElement>;
}

const Select: React.FC<SelectProps> = ({ name, value, onChange }) => {
  return (
    <div className="select-container">
      <select name={name} value={value} onChange={onChange}>
        <option value="male">Male</option>
        <option value="female">Female</option>
      </select>
    </div>
  );
};

export default Select;
