"use client";
import { InputOption, InputType } from "@/types/types";
import HttpClient from "@/utils/http-client";
import React, { useEffect, useState } from "react";
import { IoMdEye, IoMdEyeOff } from "react-icons/io";
import { IoCloseCircle } from "react-icons/io5";

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

  const [isChecked, setIsChecked] = useState<boolean>(false);
  const [dynamicOptions, setDynamicOptions] = useState<InputOption[]>(
    options || []
  );
  const [isPasswordVisible, setIsPasswordVisible] = useState(false); // État pour gérer la visibilité du mot de passe

  useEffect(() => {
    const fetchOptions = async () => {
      if (endpoint) {
        try {
          const httpClient = new HttpClient();
          const data: any = await httpClient.get(endpoint);
          if (data.code === 200) {
            const formatedData: InputOption[] = data.data;
            setDynamicOptions(formatedData);
          } else setDynamicOptions([]);
        } catch (error: any) {
          console.log("Error fetching options:", String(error.message));
        }
      }
    };

    if (options) setDynamicOptions(options);
    else fetchOptions();
  }, [endpoint, options]);

  const handleMultiSelectChange = (
    selectedValue: string | number | readonly string[] | undefined
  ) => {
    const currentValues = value?.value || [];
    let newValue = [...currentValues];

    if (currentValues.includes(selectedValue)) {
      newValue = newValue.filter((val) => val !== selectedValue); // Désélectionner
    } else {
      newValue.push(selectedValue);
    }

    setValue({ ...value, value: newValue });
  };

  const handleRemoveSelectedValue = (selectedValue: string) => {
    const currentValues = value?.value || [];
    const newValue = currentValues.filter((val: any) => val !== selectedValue);
    setValue({ ...value, value: newValue });
  };

  useEffect(() => {
    if (type === "boolean")
      setValue({ ...value, value: value?.value || false });
  }, [type]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    let newValue: string | number | boolean | string[] =
      type === "number" || type === "float"
        ? +e.target.value || 0
        : e.target.value;

    if (type === "float") newValue = +e.target.value;
    if (type === "boolean") newValue = isChecked;
    if (type === "multi-select") {
      // Gestion de la multi-sélection
      newValue = Array.from(
        (e.target as HTMLSelectElement).selectedOptions,
        (option) => option.value
      );
    }

    setValue({ ...value, value: newValue });
  };

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
        {type === "multi-select" ? (
          <>
            <div className="mb-2 flex flex-wrap gap-2">
              {Array.isArray(value?.value) &&
                value?.value?.map((value: string) => (
                  <span
                    key={String(value)}
                    className="flex items-center gap-1 rounded bg-primary text-white px-3 py-1 text-sm"
                  >
                    {
                      dynamicOptions.find((option) => option.value === value)
                        ?.label
                    }
                    <button
                      type="button"
                      className="text-white hover:text-gray-200"
                      onClick={() => {
                        handleRemoveSelectedValue(String(value));
                      }}
                    >
                      <IoCloseCircle size={16} />
                    </button>
                  </span>
                ))}
            </div>

            <div className="relative w-full">
              <div className="max-h-40 overflow-y-auto border border-gray-300 rounded-md">
                {dynamicOptions.map((option) => (
                  <div
                    key={String(option.value)}
                    className={`flex items-center gap-2 px-4 py-2 cursor-pointer hover:bg-gray-200 ${
                      value?.value?.includes(option.value)
                        ? "bg-gray-300"
                        : "bg-white"
                    }`}
                    onClick={() => {
                      // console.log(option.value);
                      handleMultiSelectChange(option.value);
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={value?.value?.includes(option.value)}
                      readOnly
                      className="h-4 w-4 text-primary focus:ring-primary"
                    />
                    <span className="text-sm">{option.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : type === "select" ? (
          <>
            <div className="mb-2">
              {/* {value?.value && (
                <span className="flex items-center gap-1 rounded bg-primary text-white px-3 py-1 text-sm">
                  {dynamicOptions.find(
                    (option) => option.value === value?.value
                  )?.label || value?.value}
                </span>
              )} */}
            </div>
            <select
              className="w-full rounded border border-stroke bg-gray px-5 py-3 text-lg font-light text-black focus:border-primary focus-visible:outline-none"
              name={verbose}
              id={id}
              value={value?.value || ""}
              onChange={handleChange}
              required={!isOptional}
            >
              <option value="" disabled>
                ---
              </option>
              {dynamicOptions.map((option) => (
                <option key={String(option.value)} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </>
        ) : type === "boolean" ? (
          <input
            type="checkbox"
            name={verbose}
            id={id}
            checked={isChecked}
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
                {isPasswordVisible ? (
                  <IoMdEyeOff size={20} />
                ) : (
                  <IoMdEye size={20} />
                )}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Input;
