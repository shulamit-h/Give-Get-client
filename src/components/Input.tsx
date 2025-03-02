// src/components/Input.tsx
import React from 'react';

interface InputProps {
  type: string;
  name: string;
  placeholder: string;
  value: string;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
}

const Input: React.FC<InputProps> = ({ type, name, placeholder, value, onChange }) => {
  return (
    <div className="input-container">
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required
      />
    </div>
  );
};

export default Input;
