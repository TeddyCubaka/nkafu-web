"use client";
import { JsonErrorCard } from "@/components/atoms/display-error";
import Loader from "@/components/atoms/loader";
import Form from "@/components/commons/form";
import { InputType } from "@/types/types";
import HttpClient from "@/utils/http-client";
import { useParams, usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const ListModelPage = () => {
  const path = usePathname();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<{
    code: number;
    message: string;
    [key: string]: any;
  }>();
  const [data, setData] = useState<any>([]);
  const [inputs, setInputs] = useState<InputType[]>([]);
  const params: { app: string; model: string; id: string } = useParams();

  useEffect(() => {
    // fetch heads
    setLoading(true);
    const requester = async () => {
      const httpClient = new HttpClient();
      const response: { code: number; message: string; data: any; meta: any } =
        await httpClient.get(`/change/${params.app}/${params.model}`);
      if (!response && httpClient.error !== null) {
        setError(httpClient.error);
        setLoading(false);
        return;
      }
      const inputValue: InputType[] = response.data.map(
        (input: InputType): InputType => ({
          ...input,
          value: {
            errorMessage: "",
            value: data[input.proprety],
          },
        })
      );
      setInputs(inputValue);

      console.log(inputValue);
      setLoading(false);
    };

    requester();
  }, [data]);

  useEffect(() => {
    // fetch data
    setLoading(true);
    const requester = async () => {
      const httpClient = new HttpClient();
      const data: { code: number; message: string; data: any; meta: any } =
        await httpClient.get(
          `/list/${params.app}/${params.model}/${params.id}`
        );
      if (!data && httpClient.error !== null) {
        setError(httpClient.error);
        setLoading(false);
        return;
      }

      setData(data.data);
      setLoading(false);
    };

    requester();
  }, []);

  if (loading) return <Loader />;
  if (error)
    return (
      <div className="flex justify-center h-full items-center">
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
    <div className="p-10">
      <Form
        inputs={inputs}
        onSubmit={async (data) => {
          const httpClient = new HttpClient();
          const response: any | false = await httpClient.patch(path, data);
          setError({
            code: response?.code || httpClient.error?.code || 500,
            message:
              response.message ||
              httpClient.error?.message ||
              "une erreur s'est produite. Veuillez reessayer plus tard",
            error: response || httpClient.error,
          });
        }}
      />
    </div>
  );
};

export default ListModelPage;
