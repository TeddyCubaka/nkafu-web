"use client";
import ConfirmDialog from "@/components/atoms/dialog";
import { JsonErrorCard } from "@/components/atoms/display-error";
import Loader from "@/components/atoms/loader";
import Button from "@/components/commons/button";
import Form from "@/components/commons/form";
import { InputType } from "@/types/types";
import HttpClient from "@/utils/http-client";
import { useParams, usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const ListModelPage = () => {
  const path = usePathname();
  const params: { app: string; model: string; id: string } = useParams();
  const router = useRouter();

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<{
    code: number;
    message: string;
    [key: string]: any;
  }>();
  const [data, setData] = useState<any>([]);
  const [inputs, setInputs] = useState<InputType[]>([]);

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
            value: data[input.property],
          },
        })
      );
      setInputs(inputValue);

      setLoading(false);
    };

    requester();
  }, [data, params.app, params.model]);

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
  }, [params.app, params.model, params.id]);

  const [isDialogOpen, setDialogOpen] = useState(false);

  const handleConfirm = async () => {
    const httpClient = new HttpClient();
    const response: any | false = await httpClient.delete(
      `/delete/${params.app}/${params.model}/${params.id}`
    );
    console.log(httpClient.error);
    setError({
      code: httpClient.error?.code || response?.code || 500,
      message:
        httpClient.error?.message ||
        response.message ||
        "une erreur s'est produite. Veuillez reessayer plus tard",
      error: httpClient.error || response,
    });
    setDialogOpen(false);
  };

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
    <div className="p-10 flex flex-col gap-5 max-md:p-5">
      <Form
        title={`Mise à jour dans ${params.model} : ref ${data.id}`}
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
          <div className="max-md:w-full max-md:flex">
            <Button
              className="max-md:flex-1 shadow-none rounded-none text-sm !bg-gray-200 text-gray-600 hover:bg-gray-300"
              variant="primary"
              onClick={() => router.push(`/list/${params.app}/${params.model}`)}
            >
              Annuler
            </Button>
            <Button
              className="max-md:flex-1 shadow-none rounded-none text-sm !bg-green-200 text-green-600 hover:bg-green-300"
              variant="primary"
              type="submit"
            >
              Sauvegarder
            </Button>
            <Button
              variant="secondary"
              type="button"
              className="max-md:flex-1 shadow-none rounded-none text-sm bg-red-200 text-red-600 hover:bg-red-300"
              onClick={async () => {
                setDialogOpen(true);
              }}
            >
              Suprimer
            </Button>
            <ConfirmDialog
              isOpen={isDialogOpen}
              title="Confirmer de la suppressions"
              message="Êtes-vous sûr de vouloir supprimer cet enreigistrement ?"
              onConfirm={handleConfirm}
              onCancel={() => setDialogOpen(false)}
            />
          </div>
        }
      />
      <div className="p-8 rounded-md bg-background flex flex-col gap-5">
        <h2 className="text-xl ">Historisation</h2>
        <ul className="list-disc px-5">
          <li>Créé le {new Date(data.createdAt).toLocaleDateString()}</li>
        </ul>
      </div>
    </div>
  );
};

export default ListModelPage;
