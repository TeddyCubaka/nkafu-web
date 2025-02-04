// src/components/Input/InputFile.tsx
import React, { useState } from "react";
import { InputType } from "./types";
import Image from "next/image";

const InputFile: React.FC<InputType> = ({
  id,
  value,
  setValue,
  isOptional,
  property,
}) => {
  const [preview, setPreview] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setValue?.({ ...value, value: file });

      // For image preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="relative">
      <input
        type="file"
        id={id}
        name={property}
        accept="image/*" // Restricts to image files only
        className="w-full rounded border-none border-foreground bg-gray px-3 py-2 font-light bg-bg-secondary text-lg text-foreground focus:border-background focus-visible:outline-none"
        onChange={handleChange}
        required={!value.value && !isOptional}
      />
      {preview ? (
        <Image
          width={400}
          height={400}
          src={preview}
          alt="Preview"
          className="mt-2 max-h-64 object-cover rounded"
        />
      ) : value.value ? (
        <Image
          width={400}
          height={400}
          src={`${process.env.NEXT_PUBLIC_API_BASE_URL}/${value.value}`}
          alt="Preview"
          className="mt-2 max-h-64 object-cover rounded"
        />
      ) : (
        false
      )}
    </div>
  );
};

export default InputFile;
