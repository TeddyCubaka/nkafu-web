export type InputOption = {
  value: string | number | readonly string[] | undefined;
  label: string | number | boolean;
};
export type ApiInputType = {
  verbose: string;
  proprety: string;
  type:
    | "text"
    | "number"
    | "select"
    | "multi-select"
    | "date"
    | "file"
    | "float"
    | "boolean"
    | "password"
    | "childrens";
  placeholder?: string;
  options?: Array<InputOption>;
  endpoint?: string;
  childrens?: ApiInputType[];
  isOptional?: boolean;
};

export type InputValueType = { errorMessage: string; value: any };
export interface InputType extends ApiInputType {
  id?: string;
  value: InputValueType;
  setValue: (value: InputValueType) => void;
}

export type ApiResponse = {
  code: number;
  message: string;
  data: any;
};
