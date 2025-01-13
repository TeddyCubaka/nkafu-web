"use client";
import Button from "@/components/commons/button";
import Input from "@/components/commons/dynamicInput";
import { InputType, InputValueType } from "@/types/types";
import Image from "next/image";
import { FormEvent, useState } from "react";
import image from "@/../public/logo/icon.png";
import HttpClient from "@/utils/http-client";
import { useRouter } from "next/navigation";
import { ConnectedUser } from "@/types/connected-user";
import { useStore } from "zustand";
import { connectedUserStore } from "@/components/store/connectedUser";

const LoginPage = () => {
  const [connecting, setConnecting] = useState<boolean>(false);
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
  const [error, setError] = useState<{
    code: number;
    message: string;
    [key: string]: any;
  } | null>(null);

  const userStore = useStore(connectedUserStore);

  const router = useRouter();

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
    setError(null);
    setConnecting(true);
    const formData = new FormData(e.currentTarget);
    const formValues: Record<string, any> = {};
    formData.forEach((value, key) => {
      formValues[key] = value;
    });
    const apiClient = new HttpClient();
    const data: Record<string, any> = await apiClient.post(
      "/auth/login",
      formValues
    );
    if (!data && apiClient.error !== null) {
      setError(apiClient.error);
      setConnecting(false);
      return;
    }
    const user: ConnectedUser = data.data;

    await localStorage.setItem("dp-sk-moto-user", JSON.stringify(user));
    await localStorage.setItem(
      "dp-sk-moto-token",
      JSON.stringify(data.access_token)
    );
    userStore.setter(user);
    setConnecting(false);
    router.push("/");
  };
  return (
    <main className="w-full flex gap-5 h-screen bg-background">
      <form
        className="p-16 lg:w-3/5 md:w-4/5 max-md:w-full h-full flex flex-col justify-center gap-5 items-center "
        onSubmit={handleSubmit}
      >
        <div className="w-full flex flex-col gap-5">
          <Image src={image} alt="helo" width={100} height={100} />
          <h1 className="text-4xl">Connection</h1>
        </div>
        {error !== null ? (
          <span
            className={`w-full ${
              error.code > 399 ? "text-red-500" : "text-green-500"
            }`}
          >
            {error.message}
          </span>
        ) : (
          false
        )}
        {loginForm.map((field) => {
          return <Input {...field} key={field.proprety} />;
        })}
        <Button type="submit" isLoading={connecting} className="w-full">
          button
        </Button>
      </form>
      <div className="block max-md:hidden w-full h-full bg-primary"></div>
    </main>
  );
};

export default LoginPage;
