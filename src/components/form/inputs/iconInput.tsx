// src/components/Input/IconInput.tsx
import React from "react";
import Link from "next/link";
import { InputType, InputOption } from "./types";
import SelectInput from "./selectInput";

interface IconInputProps extends InputType {
  options: InputOption[];
}

const IconInput: React.FC<IconInputProps> = ({
  id,
  verbose,
  value,
  setValue,
  options,
  isOptional,
  property,
}) => {
  return (
    <>
      <Link
        className="text-sky-500 decoration-1 underline mb-2 block"
        target="_top"
        href={"/menu-icon"}
      >
        Visualiser les icônes
      </Link>
      <SelectInput
        id={id}
        verbose={verbose}
        value={value}
        setValue={setValue}
        options={options}
        isOptional={isOptional}
        property={property} // replace with actual property
        type="select" // replace with actual type
      />
    </>
  );
};

export default IconInput;
