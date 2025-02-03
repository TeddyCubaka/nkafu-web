// src/components/Input/TextInput.tsx
import React, { useState } from "react";
import { IoMdEye, IoMdEyeOff } from "react-icons/io";
import { InputType } from "./types";

// interface TextInputProps extends InputType {
//   // type: "text" | "number" | "float" | "password";
// }

const TextInput: React.FC<InputType> = ({
  id,
  type,
  placeholder,
  value,
  setValue,
  isOptional,
  property
}) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let newValue: string | number = e.target.value;

    if (type === "number" || type === "float") {
      newValue = +e.target.value || 0;
    }

    if (type === "float") {
      newValue = parseFloat(e.target.value) || 0;
    }

    setValue?.({ ...value, value: newValue });
  };

  return (
    <div className="relative">
      <input
        className="w-full rounded border-none border-foreground bg-gray px-3 py-2 font-light bg-bg-secondary text-lg text-foreground focus:border-background focus-visible:outline-none"
        type={
          type === "password" && isPasswordVisible ? "text" : type
        }
        name={property}
        placeholder={placeholder}
        id={id}
        value={value?.value}
        onChange={handleChange}
        required={!isOptional}
      />
      {type === "password" && (
        <button
          type="button"
          onClick={() => setIsPasswordVisible(!isPasswordVisible)}
          className="absolute inset-y-0 right-4 flex items-center text-sm text-primary focus:outline-none"
        >
          {isPasswordVisible ? <IoMdEyeOff size={20} /> : <IoMdEye size={20} />}
        </button>
      )}
    </div>
  );
};

export default TextInput;