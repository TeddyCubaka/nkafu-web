// src/components/Input/BooleanInput.tsx
import React from "react";
import { InputType } from "./types";

const BooleanInput: React.FC<InputType> = ({
  id,
  value,
  setValue,
  isOptional,
  property
}) => {
  const handleChange = () => {
    setValue?.({ ...value, value: !value?.value });
  };

  return (
    <input
      type="checkbox"
      name={property}
      id={id}
      checked={!!value?.value}
      onChange={handleChange}
      required={!isOptional}
      className="h-5 w-5 rounded-full border-gray-300 bg-bg-secondary text-foreground focus:border-background focus:ring-primary"
    />
  );
};

export default BooleanInput;
