// src/components/Button.tsx
import React from 'react';

interface ButtonProps {
  type: 'submit' | 'button';
  text: string;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
}

const Button: React.FC<ButtonProps> = ({ type, text, onClick }) => {
  return (
    <button type={type} onClick={onClick} className="btn">
      {text}
    </button>
  );
};

export default Button;
