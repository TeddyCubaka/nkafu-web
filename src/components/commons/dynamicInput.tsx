"use client";
import { InputOption, InputType } from "@/types/types";
import React, { useEffect, useState } from "react";

const Input = (props: InputType) => {
  const {
    id,
    verbose,
    type,
    proprety,
    placeholder,
    options,
    endpoint,
    childrens,
    isOptional,
    value,
    setValue,
  } = props;

  const [dynamicOptions, setDynamicOptions] = useState<InputOption[]>(
    options || []
  );

  useEffect(() => {
    const fetchOptions = async () => {
      if (endpoint) {
        try {
          const response = await fetch(endpoint);
          const data = await response.json();
          const formatedData: InputOption[] = data.data;
          setDynamicOptions(formatedData);
        } catch (error: any) {
          console.log("Error fetching options:", String(error.message));
        }
      }
    };

    if (options) setDynamicOptions(options);
    else fetchOptions();
  }, [endpoint, options]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    let newValue: string | number | boolean =
      type === "number" || type == "float"
        ? +e.target.value || 0
        : e.target.value;
    if (type === "float") newValue = +e.target.value;
    if (type === "boolean") newValue = e.target.value;
    setValue({ ...value, value: newValue });
  };

  useEffect(() => {
    if (type === "boolean") setValue({ ...value, value: value.value || false });
  }, [type]);

  return (
    <div className="w-full">
      <label
        className={
          "mb-3 text-sm font-medium text-black " +
          (type === "boolean" ? "flex gap-5 items-center" : "")
        }
        htmlFor={id || verbose}
      >
        {verbose}
      </label>
      <div className="">
        {type === "select" ? (
          <select
            className="w-full rounded border border-stroke bg-gray px-5 py-2 text-black focus:border-primary focus-visible:outline-none"
            name={verbose}
            id={id}
            value={value?.value}
            onChange={handleChange}
            required={!isOptional}
          >
            <option value={""}>---</option>
            {dynamicOptions.map((option) => (
              <option key={String(option.value)} value={option.value}>
                {String(option.verbose)}
              </option>
            ))}
          </select>
        ) : type === "boolean" ? (
          <input
            type="checkbox"
            name={verbose}
            id={id}
            checked={value.value}
            onChange={handleChange}
            required={!isOptional}
            className="h-5 w-5 rounded-full border-gray-300 text-primary focus:ring-primary"
          />
        ) : (
          <input
            className="w-full rounded border border-stroke bg-gray px-5 py-2 text-base text-black focus:border-primary focus-visible:outline-none"
            type={type == "float" ? "number" : type}
            name={proprety}
            placeholder={placeholder}
            id={id}
            value={value?.value}
            onChange={handleChange}
            required={!isOptional}
          />
        )}
      </div>
    </div>
  );
};

export default Input;
