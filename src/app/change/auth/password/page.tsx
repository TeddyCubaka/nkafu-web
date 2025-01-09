"use client";
import { JsonErrorCard } from "@/components/atoms/display-error";
import Loader from "@/components/atoms/loader";
import Button from "@/components/commons/button";
import Form from "@/components/commons/form";
import { InputType } from "@/types/types";
import HttpClient from "@/utils/http-client";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const ListModelPage = () => {
  const path = usePathname();
  const router = useRouter();

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<{
    code: number;
    message: string;
    [key: string]: any;
  }>();
  const [inputs, setInputs] = useState<InputType[]>([]);

  useEffect(() => {
    // fetch heads
    setLoading(true);
    const requester = async () => {
      const httpClient = new HttpClient();
      const response: { code: number; message: string; data: any; meta: any } =
        await httpClient.get(`/change/auth/password`);
      if (!response && httpClient.error !== null) {
        setError(httpClient.error);
        setLoading(false);
        return;
      }
      const inputValue: InputType[] = response.data.map(
        (input: InputType): InputType => ({
          ...input,
        })
      );
      setInputs(inputValue);

      setLoading(false);
    };

    requester();
  }, []);

  if (loading) return <Loader />;
  if (error)
    return (
      <div className="flex justify-center h-fit items-center p-10">
        <JsonErrorCard
          {...{
            message: error.message,
            status: error.code < 400 ? "success" : "error",
            code: error.code,
            errorDetails: error,
          }}
        />
      </div>
    );
  return (
    <div className="p-10 flex flex-col gap-5">
      <Form
        title={`Mise a jour du mot de passe`}
        inputs={inputs}
        onSubmit={async (formData) => {
          const cleanedData: { [key: string]: any } = {};
          for (const field in formData) {
            if (
              typeof formData[field] == "string" &&
              formData[field].length == 0
            )
              cleanedData[field] == "null";
            else cleanedData[field] = formData[field];
          }
          const httpClient = new HttpClient();
          const response: any | false = await httpClient.patch(
            path,
            cleanedData
          );
          setError({
            code: response?.code || httpClient.error?.code || 500,
            message:
              response.message ||
              httpClient.error?.message ||
              "une erreur s'est produite. Veuillez reessayer plus tard",
            error: response || httpClient.error,
          });
        }}
        actions={
          <div>
            <Button
              className="shadow-none rounded-none text-sm !bg-gray-200 text-gray-600 hover:bg-gray-300"
              variant="primary"
              onClick={() => router.push(`/list/auth/password`)}
            >
              Annuler
            </Button>
            <Button
              className="shadow-none rounded-none text-sm !bg-green-200 text-green-600 hover:bg-green-300"
              variant="primary"
              type="submit"
            >
              Sauvegarder
            </Button>
          </div>
        }
      />
    </div>
  );
};

export default ListModelPage;
