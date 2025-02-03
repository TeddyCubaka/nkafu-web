// src/components/Input/SelectInput.tsx
import React from "react";
import { InputType, InputOption } from "./types";

interface SelectInputProps extends InputType {
  options: InputOption[];
}

const SelectInput: React.FC<SelectInputProps> = ({
  id,
  value,
  setValue,
  options,
  isOptional,
  property
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newValue = e.target.value;
    setValue?.({ ...value, value: newValue });
  };

  return (
    <select
      className="w-full rounded border border-stroke bg-gray px-5 py-3 bg-bg-secondary text-foreground focus:border-background focus-visible:outline-none"
      name={property}
      id={id}
      value={value?.value || ""}
      onChange={handleChange}
      required={!isOptional}
    >
      <option value="" disabled>
        ---
      </option>
      {options.map((option) => (
        <option key={String(option.value)} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
};

export default SelectInput;
