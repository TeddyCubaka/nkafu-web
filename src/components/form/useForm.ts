// src/components/Form/useForm.ts
import { useState } from "react";
import {
  FormData as FormDataType,
  InputType,
  InputValueType,
  ApiInputType,
} from "./types";

export const useForm = (inputs: InputType[]) => {
  const [formData, setFormData] = useState<FormDataType>({
    id: "root",
    values: initializeFormValues(inputs),
  });

  function initializeFormValues(
    inputs: ApiInputType[] | InputType[]
  ): Record<string, InputValueType | FormDataType[]> {
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
    }, {} as Record<string, InputValueType | FormDataType[]>);
  }

  const addChildForm = (
    parentId: string,
    childInputs?: InputType[] | ApiInputType[],
    childProperty: string = "children"
  ) => {
    const newChild: FormDataType = {
      id: `${parentId}-${Date.now()}`,
      values: initializeFormValues(childInputs || inputs),
    };

    setFormData((prev) => {
      const addChildToForm = (form: FormDataType): FormDataType => {
        if (form.id === parentId) {
          return {
            ...form,
            values: {
              ...form.values,
              [childProperty]: [
                ...(form.values[childProperty] as FormDataType[]),
                newChild,
              ],
            },
          };
        }

        const updatedValues: Record<string, any> = {};
        for (const key in form.values) {
          if (Array.isArray(form.values[key])) {
            updatedValues[key] = (form.values[key] as FormDataType[]).map(
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
      const removeChild = (form: FormDataType): FormDataType => {
        if (form.id === parentId) {
          return {
            ...form,
            values: {
              ...form.values,
              [childProperty]: (
                form.values[childProperty] as FormDataType[]
              ).filter((child) => child.id !== childId),
            },
          };
        }

        const updatedValues: Record<string, any> = {};
        for (const key in form.values) {
          if (Array.isArray(form.values[key])) {
            updatedValues[key] = (form.values[key] as FormDataType[]).map(
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
      const updateFormValues = (form: FormDataType): FormDataType => {
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
            updatedValues[key] = (form.values[key] as FormDataType[]).map(
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

  function collectFormData(data: any): FormData | Record<string, any> {
    const myData = new FormData();
    const jsonData: { [key: string]: any } = {};

    // Loop through all keys in data
    for (const key in data.values) {
      if (data.values.hasOwnProperty(key)) {
        if (data.values[key].value instanceof File) {
          const file = data.values[key].value;
          myData.append("file", file, `${key}_${file.name}`);
        } else {
          jsonData[key] = data.values[key].value;
        }
      }
    }

    myData.append("json", JSON.stringify(jsonData));

    if (Array.from(myData.keys()).includes("file")) {
      return myData;
    } else {
      return jsonData;
    }
  }

  const validateForm = (
    form: FormDataType,
    inputDefs: InputType[]
  ): string[] => {
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
