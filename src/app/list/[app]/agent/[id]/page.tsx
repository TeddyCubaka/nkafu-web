"use client";
import AgentWorkHeatmap from "@/components/atoms/agentWorkHeatmap";
import { JsonErrorCard } from "@/components/atoms/display-error";
import Loader from "@/components/atoms/loader";
import Button from "@/components/commons/button";
import { Agent } from "@/types/agent.type";
import HttpClient from "@/utils/http-client";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { IoChevronBackOutline, IoWarning } from "react-icons/io5";

const ListModelPage = () => {
  const params: { app: string; model: string; id: string } = useParams();
  const router = useRouter();

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<{
    code: number;
    message: string;
    [key: string]: any;
  }>();
  const [data, setData] = useState<Agent | null>(null);

  useEffect(() => {
    // fetch data
    setLoading(true);
    const requester = async () => {
      const httpClient = new HttpClient();
      const data: { code: number; message: string; data: any; meta: any } =
        await httpClient.get(`/list/${params.app}/agent/${params.id}`);
      if (!data && httpClient.error !== null) {
        setError(httpClient.error);
        setLoading(false);
        return;
      }

      setData(data.data);
      setLoading(false);
    };

    requester();
  }, [params.app, params.id]);

  const workData = {
    year: 2025,
    daysWorked: new Set([
      "2025-01-01",
      "2025-01-05",
      "2025-01-10",
      "2025-01-12",
      "2025-01-15",
      "2025-01-18",
      "2025-01-21",
      "2025-01-25",
      "2025-01-28",
      "2025-02-02",
      "2025-02-05",
      "2025-02-08",
      "2025-02-12",
      "2025-02-14",
      "2025-02-20",
      "2025-02-22",
      "2025-03-01",
      "2025-03-04",
      "2025-03-07",
      "2025-03-10",
      "2025-03-14",
      "2025-03-17",
      "2025-03-18",
      "2025-03-20",
      "2025-03-25",
      "2025-04-01",
      "2025-04-03",
      "2025-04-05",
      "2025-04-10",
      "2025-04-12",
      "2025-04-15",
      "2025-04-18",
      "2025-04-20",
      "2025-04-25",
      "2025-05-01",
      "2025-05-05",
      "2025-05-10",
      "2025-05-12",
      "2025-05-15",
      "2025-05-20",
      "2025-05-25",
      "2025-06-01",
      "2025-06-03",
      "2025-06-07",
      "2025-06-10",
      "2025-06-14",
      "2025-06-17",
      "2025-06-20",
      "2025-06-25",
      "2025-07-01",
      "2025-07-04",
      "2025-07-07",
      "2025-07-10",
      "2025-07-15",
      "2025-07-18",
      "2025-07-21",
      "2025-07-25",
      "2025-08-01",
      "2025-08-03",
      "2025-08-07",
      "2025-08-10",
      "2025-08-14",
      "2025-08-18",
      "2025-08-21",
      "2025-08-25",
      "2025-09-01",
      "2025-09-05",
      "2025-09-10",
      "2025-09-12",
      "2025-09-15",
      "2025-09-20",
      "2025-09-25",
      "2025-10-01",
      "2025-10-04",
      "2025-10-07",
      "2025-10-10",
      "2025-10-14",
      "2025-10-17",
      "2025-10-20",
      "2025-10-25",
      "2025-11-01",
      "2025-11-03",
      "2025-11-07",
      "2025-11-10",
      "2025-11-14",
      "2025-11-18",
      "2025-11-21",
      "2025-11-25",
      "2025-12-01",
      "2025-12-03",
      "2025-12-07",
      "2025-12-10",
      "2025-12-15",
      "2025-12-18",
      "2025-12-21",
      "2025-12-25",
      "2025-12-30",
    ]),
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
  if (data !== null)
    return (
      <div className="p-10 flex flex-col gap-5">
        <div
          className="text-lg font-[700] flex items-center cursor-pointer"
          onClick={() => router.back()}
        >
          <IoChevronBackOutline size={20} /> retour
        </div>
        <AgentWorkHeatmap workData={workData} />
        <div className="flex gap-8">
          <div className="p-8 bg-background rounded-md flex flex-col gap-5 flex-1">
            <div className="text-lg font-[700] flex items-center">
              <h3 className="flex-1">Information sur l&apos;agent</h3>
              <Button
                onClick={() => {
                  router.push(`/view/agent/${params.id}`);
                }}
                className="!px-2 !py-1 !rounded-none !bg-green-200 text-green-800"
              >
                voir
              </Button>
              <Button
                onClick={() => {
                  router.push(`/change/core/agent/${params.id}`);
                }}
                className="!px-2 !py-1 !rounded-none !bg-purple-200 text-purple-800"
              >
                editer
              </Button>
            </div>
            <ul>
              <li>
                nom : <strong>{data.firstName}</strong>
              </li>
              <li>
                post-nom : <strong>{data.middleName}</strong>
              </li>
              <li>
                prenom : <strong>{data.lastName}</strong>
              </li>
              <li>
                numéro de télèphone : <strong>{data.mobile}</strong>
              </li>
              <li>adresse mail : {data.mail}</li>
              <li>
                adresse physique : <strong>{data.address}</strong>
              </li>
            </ul>
          </div>
          <div className="p-8 bg-background rounded-md flex flex-col gap-5 flex-1">
            <h2 className="text-xl font-[700]">
              Portes-feuilles des recoltes des taxes de l&apos;agent :
            </h2>
            <div className="w-1/2 flex gap-8">
              {data.wallets.length == 0 && (
                <div className="p-2 flex items-center justify-center rounded-md bg-bg-secondary w-[300px] h-40">
                  Aucune porte-feuille pour l&apos;instant
                </div>
              )}
              {data.wallets.map((wallet) => {
                return (
                  <div
                    className="p-2 flex items-start rounded-md bg-bg-secondary w-[300px]"
                    key={wallet.id}
                  >
                    <div className="flex items-end p-5 flex-1 gap-5">
                      <span className="text-4xl font-[900]">
                        {wallet.solde}
                      </span>
                      <span>{wallet.currency.formatKey}</span>
                    </div>
                    <span className="px-3 py-1 text-sm bg-green-200 text-green-800 rounded-full cursor-pointer hover:bg-green-300 transition-all hover:shadow-sm">
                      liquider
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        <div className="p-8 rounded-md bg-background flex flex-col gap-5">
          <h2 className="text-xl ">Historiques</h2>
          <ul className="list-disc px-5">
            <li>Créé le {new Date(data.createdAt).toLocaleDateString()}</li>
          </ul>

          {data?.meta?.error?.creation ? (
            <>
              <h2 className="text-xl ">Warnings</h2>
              <ul className="">
                {data.meta?.error.creation.map(
                  (
                    error: {
                      error: {
                        code: number;
                        error: string;
                        message: string;
                      };
                      reason: string;
                    },
                    index: number
                  ) => {
                    //   return <li key={index}>{error.reason}</li>;
                    return (
                      <li
                        className="font-semibold flex gap-3 items-center"
                        key={index}
                      >
                        <IoWarning color="red" size={20} />
                        le compte utilisateur n&apos;a pas été ajouté
                        automatiquement
                      </li>
                    );
                  }
                )}
              </ul>
            </>
          ) : (
            false
          )}
        </div>
      </div>
    );

  return <Loader />;
};

export default ListModelPage;
