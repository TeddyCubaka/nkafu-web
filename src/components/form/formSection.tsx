// src/components/Form/FormSection.tsx
import React from "react";
import { ApiInputType, FormData, InputType, InputValueType } from "./types";
import Input from "../commons/dynamicInput";

interface FormSectionProps {
  form: FormData;
  inputs: InputType[] | ApiInputType[];
  depth: number;
  onInputChange: (formId: string, property: string, value: InputValueType) => void;
  onAddChild: (parentId: string, childInputs?: InputType[], childProperty?: string) => void;
  onRemoveChild: (parentId: string, childId: string, childProperty?: string) => void;
}

const FormSection: React.FC<FormSectionProps> = ({
  form,
  inputs,
  depth,
  onInputChange,
  onAddChild,
  onRemoveChild,
}) => {
  return (
    <div className={`flex flex-col gap-5 ${depth > 0 ? "pl-5 border-l-2 border-gray-200" : ""}`}>
      {inputs.map((input) => {
        if (input.type === "children") {
          const children = form.values[input.property] as FormData[];
          return (
            <div key={input.property} className="border p-4 rounded-md flex flex-col gap-5">
              <h3 className="font-semibold mb-3">{input.verbose}</h3>
              {children.map((child) => (
                <div key={child.id} className="flex flex-col">
                  <button
                    type="button"
                    className="text-red-500 w-full text-right"
                    onClick={() => onRemoveChild(form.id, child.id, input.property)}
                  >
                    Supprimer
                  </button>
                  <FormSection
                    form={child}
                    inputs={input.children || inputs}
                    depth={depth + 1}
                    onInputChange={onInputChange}
                    onAddChild={onAddChild}
                    onRemoveChild={onRemoveChild}
                  />
                </div>
              ))}
              <button
                type="button"
                className="text-primary w-full text-left"
                onClick={() => onAddChild(form.id, input.children as InputType[], input.property)}
              >
                Ajouter un enfant
              </button>
            </div>
          );
        }

        return (
          <div key={input.property} className="mb-4">
            <Input
              {...input}
              value={form.values[input.property] as InputValueType}
              setValue={(value) => onInputChange(form.id, input.property, value)}
            />
            {(form.values[input.property] as InputValueType)?.errorMessage && (
              <span className="text-red-500 text-sm">
                {(form.values[input.property] as InputValueType).errorMessage}
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default FormSection;