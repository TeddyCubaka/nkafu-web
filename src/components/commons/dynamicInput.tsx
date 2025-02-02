"use client";
import { InputOption, InputType } from "@/types/types";
import HttpClient from "@/utils/http-client";
import React, { useEffect, useState } from "react";
import { IoMdEye, IoMdEyeOff } from "react-icons/io";
import { IoCloseCircle } from "react-icons/io5";
import { iconsDictionary } from "../store/icon";
import translate from "../store/dictionary";
import Link from "next/link";

const Input = ({
  id,
  verbose,
  type,
  proprety,
  placeholder,
  options,
  endpoint,
  // children,
  isOptional,
  value,
  setValue,
}: InputType) => {
  const [dynamicOptions, setDynamicOptions] = useState<InputOption[]>(
    options || []
  );
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
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
    if (proprety == "icon") {
      const iconStores: InputOption[] = [];
      for (const icon in iconsDictionary) {
        iconStores.push({
          label: iconsDictionary[icon].name,
          value: icon,
        });
      }
      setDynamicOptions(iconStores);
    }
  }, [proprety]);

  const handleMultiSelectChange = (
    selectedValue: string | number | readonly string[] | undefined
  ) => {
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

  useEffect(() => {
    if (setValue) {
      if (
        type === "multi-select" &&
        (!value?.value || !Array.isArray(value.value))
      ) {
        setValue({ ...value, value: [] });
      }
      if (type === "boolean" && value?.value === undefined) {
        setValue({ ...value, value: false });
      }
      if (
        (type === "text" || type === "password") &&
        value?.value === undefined
      ) {
        setValue({ ...value, value: "" });
      }
      if (
        (type === "number" || type === "float") &&
        value?.value === undefined
      ) {
        setValue({ ...value, value: 0 });
      }
    }
  }, [type, value, setValue]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    let newValue: string | number | boolean | string[] =
      type === "number" || type === "float"
        ? +e.target.value || 0
        : e.target.value;

    if (type === "float") newValue = parseFloat(e.target.value) || 0;
    if (type === "boolean") newValue = !value?.value;
    if (type === "multi-select") {
      newValue = Array.from(
        (e.target as HTMLSelectElement).selectedOptions,
        (option) => option.value
      );
    }

    setValue({ ...value, value: newValue });
  };

  if (loading)
    return (
      <div className=" w-full h-full min-h-40 flex items-center justify-center">
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
        htmlFor={id || verbose}
      >
        {verbose}{" "}
        {!isOptional && <span className="text-sm text-red-500">*</span>}
      </label>
      <div className="relative w-full">
        {type === "multi-select" ? (
          <>
            <div className="mb-2 flex flex-wrap gap-2">
              {Array.isArray(value?.value) &&
                value?.value.map((val: string) => (
                  <span
                    key={String(val)}
                    className="flex items-center gap-1 rounded bg-primary text-white px-3 py-1 text-sm"
                  >
                    {translate(
                      String(
                        dynamicOptions.find((option) => option.value === val)
                          ?.label
                      )
                    )}
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
            <div className="relative w-full">
              <div className="max-h-80 overflow-y-auto border border-bg-secondary rounded-md">
                {dynamicOptions.length === 0 ? (
                  <div className="flex items-center gap-2 px-4 py-2 bg-background text-foreground">
                    <span className="text-sm">
                      Aucune donnée pour l&apos;instant
                    </span>
                  </div>
                ) : (
                  dynamicOptions.map((option) => (
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
                      <span className="text-sm">
                        {translate(String(option.label))}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </>
        ) : proprety == "icon" || type === "select" ? (
          <>
            {proprety == "icon" ? (
              <Link
                className="text-sky-500 decoration-1 underline mb-2 block"
                target="_top"
                href={"/menu-icon"}
              >
                visualiser les icônes
              </Link>
            ) : (
              false
            )}
            <select
              className="w-full rounded border border-stroke bg-gray px-5 py-3 bg-bg-secondary text-foreground focus:border-background focus-visible:outline-none"
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
                  {translate(String(option.label))}
                </option>
              ))}
            </select>
          </>
        ) : type === "boolean" ? (
          <input
            type="checkbox"
            name={verbose}
            id={id}
            checked={!!value?.value}
            onChange={handleChange}
            required={!isOptional}
            className="h-5 w-5 rounded-full border-gray-300 bg-bg-secondary text-foreground focus:border-background focus:ring-primary"
          />
        ) : (
          <div className="relative">
            <input
              className="w-full rounded border-none border-foreground bg-gray px-3 py-2 font-light bg-bg-secondary text-lg text-foreground focus:border-background focus-visible:outline-none"
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
