"use client";
import React, { useState } from "react";
import { InputType, InputValueType } from "@/types/types";
import Input from "./dynamicInput";

interface FormProps {
  inputs: InputType[]; // Tableau des champs de formulaire
  onSubmit: (data: Record<string, any>) => void; // Fonction à appeler lors de la soumission
}

const Form: React.FC<FormProps> = ({ inputs, onSubmit }) => {
  const [formValues, setFormValues] = useState<Record<string, InputValueType>>(
    () =>
      inputs.reduce((acc, input) => {
        let defaultValue: any;
        if (input.value.value && input.value.value !== null) {
          defaultValue = input.value.value;
        } else if (input.type === "boolean") defaultValue = false;
        else if (input.type === "number" || input.type === "float")
          defaultValue = 0;
        else defaultValue = ""; // Par défaut, une chaîne vide pour tous les autres types
        acc[input.proprety] = { errorMessage: "", value: defaultValue };
        return acc;
      }, {} as Record<string, InputValueType>)
  );

  const handleInputChange = (property: string, value: InputValueType) => {
    setFormValues((prev) => ({ ...prev, [property]: value }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validation simple
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

    // Gestion des erreurs ou appel de la fonction de soumission
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
      onSubmit(data); // Appelle la fonction de soumission avec les données du formulaire
    }
  };

  if (inputs.length < 1) return <div>Ce formulaire est introuvable</div>;

  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
      {inputs.map((input) => (
        <div key={input.proprety} className="flex flex-col">
          <Input
            {...input}
            value={formValues[input.proprety]}
            setValue={(value) => handleInputChange(input.proprety, value)}
          />
          {formValues[input.proprety]?.errorMessage && (
            <span className="text-red-500 text-sm">
              {formValues[input.proprety].errorMessage}
            </span>
          )}
        </div>
      ))}
      <button
        type="submit"
        className="bg-primary text-white px-4 py-2 rounded hover:bg-primary-dark"
      >
        Soumettre
      </button>
    </form>
  );
};

export default Form;
