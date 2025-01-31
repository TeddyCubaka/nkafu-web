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

interface FormData {
  values: Record<string, InputValueType>;
  children: FormData[];
}

const Form: React.FC<FormProps> = ({
  title,
  inputs,
  onSubmit,
  actions,
  topInputsBlock,
}) => {
  const [formData, setFormData] = useState<FormData>({
    values: initializeFormValues(inputs),
    children: [],
  });

  function initializeFormValues(inputs: InputType[]): Record<string, InputValueType> {
    return inputs.reduce((acc, input) => {
      let defaultValue: any;
      if (input?.value && input.value.value !== null) {
        defaultValue = input.value.value;
      } else if (input.type === "boolean") defaultValue = false;
      else if (input.type === "number" || input.type === "float")
        defaultValue = 0;
      else defaultValue = input.type == "multi-select" ? [] : "";
      acc[input.proprety] = { errorMessage: "", value: defaultValue };
      return acc;
    }, {} as Record<string, InputValueType>);
  }

  const handleInputChange = (property: string, value: InputValueType) => {
    setFormData((prev) => ({
      ...prev,
      values: { ...prev.values, [property]: value },
    }));
  };

  const addChildForm = (parent: FormData) => {
    const newChild: FormData = {
      values: initializeFormValues(inputs),
      children: [],
    };
    parent.children.push(newChild);
    setFormData({ ...formData });
  };

  const removeChildForm = (parent: FormData, index: number) => {
    parent.children.splice(index, 1);
    setFormData({ ...formData });
  };

  const handleChildInputChange = (
    parent: FormData,
    index: number,
    property: string,
    value: InputValueType
  ) => {
    parent.children[index].values[property] = value;
    setFormData({ ...formData });
  };

  // const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
  //   e.preventDefault();

  //   const errors: Record<string, string> = {};
  //   const data: Record<string, any> = {};

  //   inputs.forEach((input) => {
  //     const inputValue = formData.values[input.proprety]?.value;
  //     if (!input.isOptional && !inputValue) {
  //       errors[input.proprety] = `${input.verbose} est requis`;
  //     } else {
  //       data[input.proprety] = inputValue;
  //     }
  //   });

  //   if (Object.keys(errors).length > 0) {
  //     setFormData((prev) => ({
  //       ...prev,
  //       values: Object.entries(errors).reduce(
  //         (acc, [key, errorMessage]) => ({
  //           ...acc,
  //           [key]: { ...prev.values[key], errorMessage },
  //         }),
  //         prev.values
  //       ),
  //     }));
  //   } else {
  //     data.children = formData.children;
  //     console.log(data);
  //     // onSubmit(data);
  //   }
  //   console.log(data);
  // };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  
    const errors: Record<string, string> = {};
    const data: Record<string, any> = {};
  
    // Fonction récursive pour extraire les valeurs des enfants
    const extractFormData = (formData: FormData): Record<string, any> => {
      const formValues: Record<string, any> = {};
  
      // Extraire les valeurs du formulaire actuel
      Object.keys(formData.values).forEach((key) => {
        formValues[key] = formData.values[key].value;
      });
  
      // Extraire les valeurs des enfants de manière récursive
      if (formData.children.length > 0) {
        formValues.children = formData.children.map((child) => extractFormData(child));
      }else {
        delete formValues.children;
      }
  
      return formValues;
    };
  
    // Vérifier les erreurs dans le formulaire principal
    inputs.forEach((input) => {
      const inputValue = formData.values[input.proprety]?.value;
      if (!input.isOptional && !inputValue && input.type !== "children") {
        errors[input.proprety] = `${input.verbose} est requis`;
      }
    });
  
    if (Object.keys(errors).length > 0) {
      setFormData((prev) => ({
        ...prev,
        values: Object.entries(errors).reduce(
          (acc, [key, errorMessage]) => ({
            ...acc,
            [key]: { ...prev.values[key], errorMessage },
          }),
          prev.values
        ),
      }));
      console.log(formData);
    } else {
      // Extraire les valeurs du formulaire principal et des enfants
      const submittedData = extractFormData(formData);
      console.log(submittedData);
      onSubmit(submittedData);
    }
  };

  const renderForm = (formData: FormData, parent?: FormData, index?: number) => {
    return (
      <div key={index} className="mt-5 pl-5">
        {inputs.map((input) => {
          if (input.type === "children")
            return (
              <div key={input.proprety}>
                <button
                  className="text-primary"
                  type="button"
                  onClick={() => addChildForm(formData)}
                >
                  Ajouter un formulaire enfant
                </button>
                {formData.children.map((child, idx) => (
                  <div key={idx}>
                    {renderForm(child, formData, idx)}
                    <button
                      type="button"
                      onClick={() => removeChildForm(formData, idx)}
                    >
                      Supprimer ce formulaire enfant
                    </button>
                  </div>
                ))}
              </div>
            );
          return (
            <div key={input.proprety} className="flex flex-col">
              <Input
                {...input}
                value={formData.values[input.proprety]}
                setValue={(value) => {
                  if (parent && index !== undefined) {
                    handleChildInputChange(parent, index, input.proprety, value);
                  } else {
                    handleInputChange(input.proprety, value);
                  }
                }}
              />
              {formData.values[input.proprety]?.errorMessage && (
                <span className="text-red-500 text-sm">
                  {formData.values[input.proprety].errorMessage}
                </span>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  if (inputs.length < 1)
    return (
      <div className="p-8 rounded-md bg-background flex items-center justify-between h-full">
        Ce formulaire est introuvable
      </div>
    );

  return (
    <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
      <div className="p-8 rounded-md bg-background flex items-center justify-between max-md:flex-col max-md:gap-5">
        <h1 className="text-xl max-md:w-full text-left font-[700]">{title}</h1>
        {actions}
      </div>
      {topInputsBlock}
      <div className="p-8 bg-background rounded-md flex flex-col gap-5">
        {renderForm(formData)}
      </div>
    </form>
  );
};

export default Form;