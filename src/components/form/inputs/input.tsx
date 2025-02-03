// src/components/Input/Input.tsx
import React, { useEffect, useState } from "react";
import { InputType, InputOption } from "./types";
import TextInput from "./textInput";
import SelectInput from "./selectInput";
import MultiSelectInput from "./multiSelectInput";
import BooleanInput from "./booleanInput";
import IconInput from "./iconInput";
import HttpClient from "@/utils/http-client";
import { iconsDictionary } from "@/components/store/icon";
import InputFile from "./inputFile";

const Input: React.FC<InputType> = ({
  id,
  verbose,
  type,
  property,
  placeholder,
  options,
  endpoint,
  isOptional,
  value,
  setValue,
}) => {
  const [dynamicOptions, setDynamicOptions] = useState<InputOption[]>(
    options || []
  );
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    setLoading(true);
    const fetchOptions = async () => {
      if (endpoint) {
        try {
          const httpClient = new HttpClient();
          const data: { code: number; message: string; data?: InputOption[] } =
            await httpClient.get(endpoint);
          if (data.code === 200 && data.data) {
            setDynamicOptions(
              data.data.sort((a, b) => {
                const labelA = a.label.toString().toLowerCase();
                const labelB = b.label.toString().toLowerCase();

                if (labelA < labelB) return -1;
                else if (labelA > labelB) return 1;
                else return 0;
              })
            );
          } else {
            setDynamicOptions([]);
          }
        } catch (error: any) {
          console.error("Error fetching options:", String(error.message));
        }
      }
    };

    if (options) {
      setDynamicOptions(options);
    } else {
      fetchOptions();
    }
    setLoading(false);
  }, [endpoint, options, type]);

  useEffect(() => {
    if (property == "icon") {
      const iconStores: InputOption[] = [];
      for (const icon in iconsDictionary) {
        iconStores.push({
          label: iconsDictionary[icon].name,
          value: icon,
        });
      }
      setDynamicOptions(iconStores);
    }
  }, [property]);

  if (loading)
    return (
      <div className="w-full h-full min-h-40 flex items-center justify-center">
        <div className="flex flex-col justify-center items-center gap-5 w-full h-full">
          <span className="pulse w-8 h-8"></span>
        </div>
      </div>
    );

  return (
    <div className="w-full flex flex-col gap-2">
      <label
        className={
          "font-medium text-black dark:text-white " +
          (type === "boolean" ? "flex gap-5 items-center" : "")
        }
        htmlFor={id || property}
      >
        {verbose}{" "}
        {!isOptional && <span className="text-sm text-red-500">*</span>}
      </label>
      <div className="relative w-full">
        {type === "multi-select" ? (
          <MultiSelectInput
            id={id}
            verbose={verbose}
            value={value}
            setValue={setValue}
            options={dynamicOptions}
            isOptional={isOptional}
            property={property}
            type="multi-select"
          />
        ) : property === "icon" ? (
          <IconInput
            id={id}
            verbose={verbose}
            value={value}
            setValue={setValue}
            options={dynamicOptions}
            isOptional={isOptional}
            property={property}
            type="select"
          />
        ) : type === "select" ? (
          <SelectInput
            id={id}
            verbose={verbose}
            value={value}
            setValue={setValue}
            options={dynamicOptions}
            isOptional={isOptional}
            property={property}
            type="select"
          />
        ) : type === "boolean" ? (
          <BooleanInput
            id={id}
            verbose={verbose}
            value={value}
            setValue={setValue}
            isOptional={isOptional}
            property={property}
            type="boolean"
          />
        ) : type === "file" ? (
          <InputFile
            id={id}
            verbose={verbose}
            type={type}
            placeholder={placeholder}
            value={value}
            setValue={setValue}
            isOptional={isOptional}
            property={property}
          />
        ) : (
          <TextInput
            id={id}
            verbose={verbose}
            type={type}
            placeholder={placeholder}
            value={value}
            setValue={setValue}
            isOptional={isOptional}
            property={property}
          />
        )}
      </div>
    </div>
  );
};

export default Input;
