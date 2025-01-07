"use client";
import { JsonErrorCard } from "@/components/atoms/display-error";
import Loader from "@/components/atoms/loader";
import { DataTable, DataTableColumnType } from "@/components/atoms/table";
import Button from "@/components/commons/button";
import Form from "@/components/commons/form";
import { InputType } from "@/types/types";
import HttpClient from "@/utils/http-client";
import { useParams, usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const CreateModelPage = () => {
  const path = usePathname();
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<
    | {
        code: number;
        message: string;
        [key: string]: any;
      }
    | undefined
  >(undefined);
  const [data, setData] = useState<any>([]);
  const [inputs, setInputs] = useState<InputType[]>([]);
  const [metaData, setMetaData] = useState<{
    listColumns: DataTableColumnType<{ id?: string | number | undefined }>[];
  }>();

  const params: { app: string; model: string } = useParams();

  useEffect(() => {
    // fetch heads
    setLoading(true);
    const requester = async () => {
      const httpClient = new HttpClient();
      const data: { code: number; message: string; data: any; meta: any } =
        await httpClient.get(`/create/${params.app}/${params.model}`);
      if (!data && httpClient.error !== null) {
        setError(httpClient.error);
        setLoading(false);
        return;
      }

      // setMetaData(data.meta);
      setInputs(data.data);
      setLoading(false);
    };

    requester();
  }, []);

  if (loading) return <Loader />;
  if (error)
    return (
      <div className="flex justify-center h-full items-center flex-col">
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
        title={`Enrigistrement dans : ${params.model}`}
        inputs={inputs}
        onSubmit={async (data) => {
          const httpClient = new HttpClient();
          const response: any | false = await httpClient.post(path, data);
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
              className="shadow-none rounded-none text-sm !bg-gray-200 text-gray-600"
              variant="primary"
              onClick={() => router.push(`/list/${params.app}/${params.model}`)}
            >
              Annuler
            </Button>
            <Button
              className="shadow-none rounded-none text-sm !bg-green-200 text-green-600"
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

export default CreateModelPage;
