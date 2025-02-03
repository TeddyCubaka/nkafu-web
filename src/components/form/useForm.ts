// src/components/Form/useForm.ts
import { useState } from "react";
import { FormData, InputType, InputValueType, ApiInputType } from "./types";

export const useForm = (inputs: InputType[]) => {
  const [formData, setFormData] = useState<FormData>({
    id: "root",
    values: initializeFormValues(inputs),
  });

  function initializeFormValues(
    inputs: ApiInputType[] | InputType[]
  ): Record<string, InputValueType | FormData[]> {
    return inputs.reduce((acc, input) => {
      if (input.type === "children") {
        acc[input.property] = [];
      } else {
        let defaultValue: any;
        if ("value" in input && input.value?.value !== undefined) {
          defaultValue = input.value.value;
        } else if (input.type === "boolean") defaultValue = false;
        else if (input.type === "number" || input.type === "float")
          defaultValue = 0;
        else defaultValue = input.type === "multi-select" ? [] : "";

        acc[input.property] = { errorMessage: "", value: defaultValue };
      }
      return acc;
    }, {} as Record<string, InputValueType | FormData[]>);
  }

  const addChildForm = (
    parentId: string,
    childInputs?: InputType[] | ApiInputType[],
    childProperty: string = "children"
  ) => {
    const newChild: FormData = {
      id: `${parentId}-${Date.now()}`,
      values: initializeFormValues(childInputs || inputs),
    };

    setFormData((prev) => {
      const addChildToForm = (form: FormData): FormData => {
        if (form.id === parentId) {
          return {
            ...form,
            values: {
              ...form.values,
              [childProperty]: [
                ...(form.values[childProperty] as FormData[]),
                newChild,
              ],
            },
          };
        }

        const updatedValues: Record<string, any> = {};
        for (const key in form.values) {
          if (Array.isArray(form.values[key])) {
            updatedValues[key] = (form.values[key] as FormData[]).map(
              addChildToForm
            );
          } else {
            updatedValues[key] = form.values[key];
          }
        }

        return {
          ...form,
          values: updatedValues,
        };
      };

      return addChildToForm(prev);
    });
  };

  const removeChildForm = (
    parentId: string,
    childId: string,
    childProperty: string = "children"
  ) => {
    setFormData((prev) => {
      const removeChild = (form: FormData): FormData => {
        if (form.id === parentId) {
          return {
            ...form,
            values: {
              ...form.values,
              [childProperty]: (
                form.values[childProperty] as FormData[]
              ).filter((child) => child.id !== childId),
            },
          };
        }

        const updatedValues: Record<string, any> = {};
        for (const key in form.values) {
          if (Array.isArray(form.values[key])) {
            updatedValues[key] = (form.values[key] as FormData[]).map(
              removeChild
            );
          } else {
            updatedValues[key] = form.values[key];
          }
        }

        return {
          ...form,
          values: updatedValues,
        };
      };

      return removeChild(prev);
    });
  };

  const handleInputChange = (
    formId: string,
    property: string,
    value: InputValueType
  ) => {
    setFormData((prev) => {
      const updateFormValues = (form: FormData): FormData => {
        if (form.id === formId) {
          return {
            ...form,
            values: {
              ...form.values,
              [property]: value,
            },
          };
        }

        const updatedValues: Record<string, any> = {};
        for (const key in form.values) {
          if (Array.isArray(form.values[key])) {
            updatedValues[key] = (form.values[key] as FormData[]).map(
              updateFormValues
            );
          } else {
            updatedValues[key] = form.values[key];
          }
        }

        return {
          ...form,
          values: updatedValues,
        };
      };

      return updateFormValues(prev);
    });
  };

  const collectFormData = (form: FormData): Record<string, any> => {
    const result: Record<string, any> = {};

    Object.entries(form.values).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        result[key] = value.map(collectFormData);
      } else {
        result[key] = (value as InputValueType).value;
      }
    });

    return result;
  };

  const validateForm = (form: FormData, inputDefs: InputType[]): string[] => {
    const errors: string[] = [];

    inputDefs.forEach((input) => {
      if (!input.isOptional && input.type !== "children") {
        const value = (form.values[input.property] as InputValueType)?.value;
        if (value === undefined || value === "" || value === null) {
          errors.push(`${input.verbose} est requis`);
        }
      }
    });

    return errors;
  };

  return {
    formData,
    addChildForm,
    removeChildForm,
    handleInputChange,
    collectFormData,
    validateForm,
  };
};
