// src/components/Input/MultiSelectInput.tsx
import React from "react";
import { IoCloseCircle } from "react-icons/io5";
import { InputType, InputOption } from "./types";

interface MultiSelectInputProps extends InputType {
  options: InputOption[];
}

const MultiSelectInput: React.FC<MultiSelectInputProps> = ({
  id,
  verbose,
  value,
  setValue,
  options,
  isOptional,
  property
}) => {
  const handleMultiSelectChange = (selectedValue: string | number | readonly string[] | undefined) => {
    const currentValues = Array.isArray(value?.value) ? value.value : [];
    let newValue = [...currentValues];

    if (currentValues.includes(selectedValue)) {
      newValue = newValue.filter((val) => val !== selectedValue);
    } else {
      newValue.push(selectedValue);
    }

    setValue?.({ ...value, value: newValue });
  };

  const handleRemoveSelectedValue = (selectedValue: string) => {
    const currentValues = Array.isArray(value?.value) ? value.value : [];
    const newValue = currentValues.filter((val) => val !== selectedValue);
    setValue?.({ ...value, value: newValue });
  };

  return (
    <div className="relative w-full">
      <div className="mb-2 flex flex-wrap gap-2">
        {Array.isArray(value?.value) &&
          value?.value.map((val: string) => (
            <span
              key={String(val)}
              className="flex items-center gap-1 rounded bg-primary text-white px-3 py-1 text-sm"
            >
              {options.find((option) => option.value === val)?.label}
              <button
                type="button"
                className="text-white hover:text-gray-200"
                onClick={() => handleRemoveSelectedValue(val)}
              >
                <IoCloseCircle size={16} />
              </button>
            </span>
          ))}
      </div>
      <div className="max-h-80 overflow-y-auto border border-bg-secondary rounded-md">
        {options.length === 0 ? (
          <div className="flex items-center gap-2 px-4 py-2 bg-background text-foreground">
            <span className="text-sm">Aucune donnée pour l&apos;instant</span>
          </div>
        ) : (
          options.map((option) => (
            <div
              key={String(option.value)}
              className={`flex items-center gap-2 px-4 py-2 cursor-pointer hover:bg-bg-secondary text-foreground focus:border-background ${
                value?.value?.includes(option.value)
                  ? "bg-bg-secondary"
                  : "bg-background"
              }`}
              onClick={() => handleMultiSelectChange(option.value)}
            >
              <input
                type="checkbox"
                checked={value?.value?.includes(option.value)}
                readOnly
                required={!isOptional}
                className="h-4 w-4 text-primary focus:ring-primary"
              />
              <span className="text-sm">{option.label}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default MultiSelectInput;
