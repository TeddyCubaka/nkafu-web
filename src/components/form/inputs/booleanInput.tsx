'use client'
import React, { useEffect } from "react";
import { InputType } from "./types";

const BooleanInput: React.FC<InputType> = ({
  id,
  value,
  setValue,
  isOptional,
  property
}) => {
  useEffect(() => {
    if (value?.value === undefined) {
      setValue?.({ ...value, value: false });
    }
  }, []);

  const handleChange = () => {
    setValue?.({ ...value, value: !value?.value });
  };

  return (
    <button
      type="button"
      role="switch"
      aria-checked={!!value?.value}
      onClick={handleChange}
      className={`
        relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full 
        border-2 border-transparent transition-colors duration-200 ease-in-out 
        focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
        ${value?.value ? 'bg-primary' : 'bg-gray-200'}
      `}
    >
      <span className="sr-only">{value?.value ? 'On' : 'Off'}</span>
      <span
        className={`
          pointer-events-none inline-block h-5 w-5 transform rounded-full 
          bg-white shadow ring-0 transition duration-200 ease-in-out
          ${value?.value ? 'translate-x-5' : 'translate-x-0'}
        `}
      />
    </button>
  );
};

export default BooleanInput;