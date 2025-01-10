"use client";
import React, { useState } from "react";
import { InputType, InputValueType } from "@/types/types";
import Input from "./dynamicInput";

interface FormProps {
  title: string;
  inputs: InputType[];
  onSubmit: (data: Record<string, any>) => void;
  actions: React.ReactNode;
  topInputsBlock?: React.ReactNode;
}

const Form: React.FC<FormProps> = ({
  title,
  inputs,
  onSubmit,
  actions,
  topInputsBlock,
}) => {
  const [formValues, setFormValues] = useState<Record<string, InputValueType>>(
    () =>
      inputs.reduce((acc, input) => {
        let defaultValue: any;
        if (input?.value && input.value.value !== null) {
          defaultValue = input.value.value;
        } else if (input.type === "boolean") defaultValue = false;
        else if (input.type === "number" || input.type === "float")
          defaultValue = 0;
        else defaultValue = input.type == "multi-select" ? [] : "";
        acc[input.proprety] = { errorMessage: "", value: defaultValue };
        return acc;
      }, {} as Record<string, InputValueType>)
  );

  const handleInputChange = (property: string, value: InputValueType) => {
    setFormValues((prev) => ({ ...prev, [property]: value }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const errors: Record<string, string> = {};
    const data: Record<string, any> = {};

    inputs.forEach((input) => {
      const inputValue = formValues[input.proprety]?.value;
      if (!input.isOptional && !inputValue) {
        errors[input.proprety] = `${input.verbose} est requis`;
      } else {
        data[input.proprety] = inputValue;
      }
    });

    if (Object.keys(errors).length > 0) {
      setFormValues((prev) =>
        Object.entries(errors).reduce(
          (acc, [key, errorMessage]) => ({
            ...acc,
            [key]: { ...prev[key], errorMessage },
          }),
          prev
        )
      );
    } else {
      onSubmit(data);
    }
  };

  if (inputs.length < 1) return <div className="p-8 rounded-md bg-background flex items-center justify-between h-full">Ce formulaire est introuvable</div>;

  return (
    <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
      <div className="p-8 rounded-md bg-background flex items-center justify-between">
        <h1 className="text-xl font-[700]">{title}</h1>
        {actions}
      </div>
      {topInputsBlock}
      <div className="p-8 bg-background rounded-md flex flex-col gap-5">
        {inputs.map((input) => (
          <div key={input.proprety} className="flex flex-col">
            <Input
              {...input}
              value={formValues[input.proprety]}
              setValue={(value) => handleInputChange(input.proprety, value)}
              key={input.proprety}
            />
            {formValues[input.proprety]?.errorMessage && (
              <span className="text-red-500 text-sm">
                {formValues[input.proprety].errorMessage}
              </span>
            )}
          </div>
        ))}
      </div>
    </form>
  );
};

export default Form;
