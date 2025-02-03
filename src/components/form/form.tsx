// src/components/Form/Form.tsx
import React from "react";
import { FormProps } from "./types";
import { useForm } from "./useForm";
import FormSection from "./formSection";

const Form: React.FC<FormProps> = ({
  title,
  inputs,
  onSubmit,
  actions,
  topInputsBlock,
}) => {
  const {
    formData,
    addChildForm,
    removeChildForm,
    handleInputChange,
    collectFormData,
    validateForm,
  } = useForm(inputs);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const errors = validateForm(formData, inputs);

    if (errors.length > 0) {
      console.log("Erreurs de validation:", errors);
    } else {
      const submittedData = collectFormData(formData);
      // console.log("submittedData::::::::::::::::::::::", submittedData);
      onSubmit(submittedData);
    }
  };

  if (inputs.length < 1) {
    return (
      <div className="p-8 rounded-md bg-background flex items-center justify-between h-full">
        Ce formulaire est introuvable
      </div>
    );
  }

  return (
    <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
      <div className="p-8 rounded-md bg-background flex items-center justify-between max-md:flex-col max-md:gap-5">
        <h1 className="text-xl max-md:w-full text-left font-[700]">{title}</h1>
        {actions}
      </div>
      {topInputsBlock}
      <div className="p-8 bg-background rounded-md flex flex-col gap-5">
        <FormSection
          form={formData}
          inputs={inputs}
          depth={0}
          onInputChange={handleInputChange}
          onAddChild={addChildForm}
          onRemoveChild={removeChildForm}
        />
      </div>
    </form>
  );
};

export default Form;
