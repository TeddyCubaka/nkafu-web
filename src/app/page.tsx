"use client";

import "survey-core/defaultV2.min.css";
import Header from "@/components/commons/headers";
import Input from "@/components/commons/dynamicInput";
import { InputType } from "@/types/types";

const loginForm: InputType[] = [
  {
    proprety: "name",
    verbose: "name",
    type: "text",
    setValue: () => {},
    value: { errorMessage: "", value: "" },
  },
  {
    proprety: "actionId",
    verbose: "actions",
    type: "multi-select",
    endpoint: "autocomplete/core/action",
    setValue: () => {},
    value: { errorMessage: "", value: "" },
  },
];

export default function Home() {
  return (
    <div>
      <Header />
      {loginForm.map((field) => {
        return <Input {...field} key={field.proprety} />;
      })}
    </div>
  );
}
