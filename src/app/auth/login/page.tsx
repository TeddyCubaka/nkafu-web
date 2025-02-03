"use client";
import Button from "@/components/commons/button";
import Input from "@/components/commons/dynamicInput";
import { InputType } from "@/types/types";
import Image from "next/image";
import { FormEvent, useEffect, useRef, useState } from "react";
import image from "@/../public/logo/icon.png";
import HttpClient from "@/utils/http-client";
import { useRouter } from "next/navigation";
import { ConnectedUser } from "@/types/connected-user";
import { useStore } from "zustand";
import { connectedUserStore } from "@/components/store/connectedUser";
import { ApiResponse } from "@/types/auth-login.type";

const OtpValidation = ({
  token,
}: {
  token: string;
}) => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | undefined>();
  const inputsRef = useRef<HTMLInputElement[]>([]);
  const userStore = useStore(connectedUserStore);
  const router = useRouter();

  const handleChange = (index: number, value: string) => {
    if (/^\d*$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      if (value && index < otp.length - 1) {
        inputsRef.current[index + 1].focus();
      }
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputsRef.current[index - 1].focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const pasteData = e.clipboardData.getData("text");
    if (/^\d*$/.test(pasteData)) {
      const newOtp = [...otp];
      for (let i = 0; i < Math.min(pasteData.length, 6); i++) {
        newOtp[i] = pasteData[i];
      }
      setOtp(newOtp);
      inputsRef.current[Math.min(pasteData.length - 1, 5)].focus();
    }
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(undefined);
    const httpClient = new HttpClient();
    httpClient
      .post<ApiResponse | boolean>(
        `/auth/otp/validation`,
        { otp: otp.join("") },
        {},
        token
      )
      .then(async (data) => {
        if (typeof data !== "boolean" && data.code == 200 && "data" in data) {
          const user: ConnectedUser = data.data;
          await localStorage.setItem("dp-sk-moto-user", JSON.stringify(user));
          await localStorage.setItem(
            "dp-sk-moto-token",
            JSON.stringify(data.access_token)
          );
          userStore.setter(user);
          router.push("/");
        } else if (typeof data !== "boolean") {
          setErrorMessage(data?.message);
        } else {
          setErrorMessage(
            httpClient.error?.message || "Une erreur est survenue"
          );
        }
      })
      .catch((error) => {
        console.log(error);
        setErrorMessage(
          httpClient.error?.message ||
            error.message ||
            "Une erreur est survenue"
        );
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <h1 className="text-2xl">Veuillez entrer votre OTP</h1>
      <span className="text-red-500">{errorMessage}</span>
      <div className="flex gap-2">
        {otp.map((digit, index) => (
          <input
            key={index}
            type="text"
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            onPaste={handlePaste}
            ref={(el) => {
              inputsRef.current[index] = el!;
            }}
            className="w-12 h-12 text-foreground text-center border border-gray-300 rounded"
          />
        ))}
      </div>
      <Button isLoading={isLoading} type="submit" className="w-full">
        Valider OTP
      </Button>
    </form>
  );
};
const MethodSelection = ({
  onSelect,
  methods,
  token,
}: {
  onSelect: (method: string) => void;
  token: string;
  methods: {
    name: string;
    value: string;
  }[];
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | undefined>();

  const handleSelect = (method: string) => {
    setIsLoading(true);
    const httpClient = new HttpClient();
    httpClient
      .get<ApiResponse | boolean>(`/auth/otp?method=${method}`, {}, token)
      .then((data) => {
        if (typeof data !== "boolean" && data.code == 200) {
          onSelect(method);
        } else if (typeof data !== "boolean") {
          setErrorMessage(data?.message);
        } else {
          setErrorMessage(
            httpClient.error?.message || "Une erreur est survenue"
          );
        }
      })
      .catch((error) => {
        console.log(error);
        setErrorMessage(
          httpClient.error?.message ||
            error.message ||
            "Une erreur est survenue"
        );
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <div className="flex flex-col gap-4 w-full">
      <h1 className="text-2xl">
        Veuillez choisir le moyen par lequel nous allons vous envoyez l&apos;OTP
      </h1>
      <span className="text-red-500">{errorMessage}</span>
      {methods.map((method) => (
        <Button
          isLoading={isLoading}
          key={method.value}
          onClick={() => handleSelect(method.value)}
          className="w-full"
        >
          {method.name}
        </Button>
      ))}
    </div>
  );
};
const OtpMethodAndValidation = ({
  token,
  methods,
}: {
  token: string;
  methods: {
    name: string;
    value: string;
  }[];
}) => {
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);

  const handleMethodSelect = (method: string) => {
    setSelectedMethod(method);
  };

  // const handleOtpValidate = (otp: string) => {};

  return (
    <div className="h-full w-full lg:w-3/5 flex mx-auto flex-col justify-center gap-5 items-center">
      {selectedMethod ? (
        <OtpValidation token={token} />
      ) : (
        <MethodSelection
          token={token}
          onSelect={handleMethodSelect}
          methods={methods}
        />
      )}
    </div>
  );
};
const LoginPage = () => {
  const [connecting, setConnecting] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [validateOtp, setValidateOtp] = useState(false);
  const [temporalOtp, setTemporalOtp] = useState<string | null>(null);
  const [otpMethods, setOtpMethods] = useState<
    {
      name: string;
      value: string;
    }[]
  >([]);
  const [loginData, setLoginData] = useState({
    identifier: { errorMessage: "", value: "" },
    password: { errorMessage: "", value: "" },
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
      property: "identifier",
      verbose: "identifiant",
      type: "text",
      placeholder: "numero de telephone ou adresse mail",
      setValue: (value) =>
        setLoginData((prev) => ({ ...prev, identifier: value })),
      value: loginData.identifier,
    },
    {
      property: "password",
      verbose: "mot de passe",
      type: "password",
      placeholder: "mot de passe",
      setValue: (value) =>
        setLoginData((prev) => ({ ...prev, password: value })),
      value: loginData.password,
    },
  ];

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();
      setError(null);
      setConnecting(true);
      const formValues = Object.fromEntries(
        new FormData(e.currentTarget).entries()
      );
      const apiClient = new HttpClient();
      const data = await apiClient.post<ApiResponse | boolean>(
        "/auth/login",
        formValues
      );

      if (data == false) {
        setError(apiClient.error);
        setConnecting(false);
        return;
      }

      if (typeof data !== "boolean" && data.redirectToOpt) {
        setValidateOtp(true);
        setTemporalOtp("token" in data ? data.token : "");
        setOtpMethods("otpMethod" in data ? data.otpMethod : []);
        setConnecting(false);
      } else if (typeof data !== "boolean" && "data" in data) {
        const user: ConnectedUser = data.data;
        await localStorage.setItem("dp-sk-moto-user", JSON.stringify(user));
        await localStorage.setItem(
          "dp-sk-moto-token",
          JSON.stringify(data.access_token)
        );
        userStore.setter(user);
        setConnecting(false);
        router.push("/");
      }
    } catch (error: any) {
      setError({ code: 500, message: error.message });
      setConnecting(false);
    }
  };

  const toggleTheme = () => {
    document.documentElement.classList.toggle("dark", !isDarkMode);
    localStorage.setItem("theme", isDarkMode ? "light" : "dark");
    setIsDarkMode(!isDarkMode);
  };

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const prefersDark =
      !savedTheme && window.matchMedia("(prefers-color-scheme: dark)").matches;
    document.documentElement.classList.toggle(
      "dark",
      savedTheme === "dark" || prefersDark
    );
    setIsDarkMode(savedTheme === "dark" || prefersDark);
  }, []);

  return (
    <main className="w-full flex gap-5 h-screen bg-background">
      <div className="p-16 w-1/2 md:w-4/5 max-md:w-full h-full">
        <div className="w-full flex justify-end">
          <Button onClick={toggleTheme}>{isDarkMode ? "🌙" : "☀️"}</Button>
        </div>

        {validateOtp ? (
          <OtpMethodAndValidation
            methods={otpMethods}
            token={temporalOtp || ""}
          />
        ) : (
          <form
            className="h-full w-full lg:w-3/5 flex mx-auto flex-col justify-center gap-5 items-center"
            onSubmit={handleSubmit}
          >
            <div className="w-full flex flex-col gap-5">
              <Image src={image} alt="helo" width={100} height={100} />
              <h1 className="text-4xl">Connection</h1>
            </div>
            {error && (
              <span
                className={`w-full ${
                  error.code > 399 ? "text-red-500" : "text-green-500"
                }`}
              >
                {error.message}
              </span>
            )}
            {loginForm.map((field) => (
              <Input {...field} key={field.property} />
            ))}
            <Button type="submit" isLoading={connecting} className="w-full">
              se connecter
            </Button>
          </form>
        )}
      </div>
      <div className="block max-md:hidden w-full h-full bg-primary"></div>
    </main>
  );
};

export default LoginPage;
