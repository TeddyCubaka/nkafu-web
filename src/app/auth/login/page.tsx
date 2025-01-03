"use client";
import Button from "@/components/commons/button";
import Input from "@/components/commons/dynamicInput";
import { InputType, InputValueType } from "@/types/types";
import Image from "next/image";
import { FormEvent, useState } from "react";
import image from "@/../public/logo/icon.png";
import HttpClient from "@/utils/http-client";

const LoginPage = () => {
  const [loginData, setLoginData] = useState<{
    identifier: InputValueType;
    password: InputValueType;
  }>({
    identifier: {
      errorMessage: "",
      value: "",
    },
    password: {
      errorMessage: "",
      value: "",
    },
  });
  const [error, setError] = useState<string>("");
  const loginForm: InputType[] = [
    {
      proprety: "identifier",
      verbose: "identifiant",
      type: "text",
      placeholder: "numero de telephone ou adresse mail",
      setValue: (value) =>
        setLoginData((prev) => ({ ...prev, identifier: value })),
      value: { errorMessage: "", value: loginData.identifier.value },
    },
    {
      proprety: "password",
      verbose: "mot de passe",
      type: "password",
      placeholder: "mot de passe",
      setValue: (value) =>
        setLoginData((prev) => ({ ...prev, password: value })),
      value: { errorMessage: "", value: loginData.password.value },
    },
  ];

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    const formData = new FormData(e.currentTarget);
    const formValues: Record<string, any> = {};
    formData.forEach((value, key) => {
      formValues[key] = value;
    });
    const apiClient = new HttpClient();
    const data = await apiClient.post("/auth/login", formValues);
    if (!data && apiClient.error !== null) {
      setError(apiClient.error.message);
      return;
    }

    console.log(data);
  };
  return (
    <main className="w-full grid grid-cols-2 gap-5 h-screen">
      <form
        className="mx-auto w-3/4 h-full flex flex-col justify-center gap-5 items-center "
        onSubmit={handleSubmit}
      >
        <div>
          <Image src={image} alt="helo" width={200} height={200} />
        </div>
        {error.length > 0 ? (
          <span className="text-red-500 w-full">{error}</span>
        ) : (
          false
        )}
        {loginForm.map((field) => {
          return <Input {...field} key={field.proprety} />;
        })}
        <Button className="w-full">button</Button>
      </form>
      <div className="block max-md:hidden w-full h-full bg-primary"></div>
    </main>
  );
};

export default LoginPage;
