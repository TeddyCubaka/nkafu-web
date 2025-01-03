"use client";
import { InputOption, InputType } from "@/types/types";
import React, { useEffect, useState } from "react";
import { IoMdEye, IoMdEyeOff } from "react-icons/io";

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
  const [isPasswordVisible, setIsPasswordVisible] = useState(false); // État pour gérer la visibilité du mot de passe

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
    <div className="w-full flex flex-col gap-2">
      <label
        className={
          "font-medium text-black " +
          (type === "boolean" ? "flex gap-5 items-center" : "")
        }
        htmlFor={id || verbose}
      >
        {verbose}
      </label>
      <div className="relative w-full">
        {type === "select" ? (
          <select
            className="w-full rounded border border-stroke bg-gray px-5 py-3 text-lg font-light text-black focus:border-primary focus-visible:outline-none"
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
          <div className="relative">
            <input
              className="w-full rounded border border-stroke bg-gray px-5 py-3 text-lg font-light text-black focus:border-primary focus-visible:outline-none"
              type={
                type === "float"
                  ? "number"
                  : type === "password" && isPasswordVisible
                  ? "text"
                  : type
              }
              name={proprety}
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
        )}
      </div>
    </div>
  );
};

export default Input;
