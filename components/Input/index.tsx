import React from 'react';
import InputProps from './input.type';

const Input = ({ name, value, placeholder, onChange }: InputProps) => {
  return (
    <input
      name={name}
      value={value}
      placeholder={placeholder}
      onChange={onChange}
      className="border py-1 w-40 rounded-xl"
    ></input>
  );
};

export default Input;
