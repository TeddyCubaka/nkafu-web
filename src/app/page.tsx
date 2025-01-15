"use client";

import { JsonErrorCard } from "@/components/atoms/display-error";
import StatisticsBlock from "@/components/atoms/stats";
import HttpClient from "@/utils/http-client";
import { useEffect, useState } from "react";
// import { MdOpenInNew } from "react-icons/md";
import { TbPigMoney } from "react-icons/tb";

type DescriptiveCard = {
  icon: string;
  reportNumber: string;
  unit: string;
  dataUrl: string;
  title: string;
};

type AgentState = {
  id: string;
  name: string;
  mail: string | null;
  mobile: string;
  isRoot: boolean;
  isActive: boolean;
  isStaff: boolean;
  role: {
    id: string;
    name: string;
  } | null;
  agent: {
    _count: {
      operationInitializated: number;
      operationClosed: number;
      agentBusStops: number;
      liquidations: number;
      validatedLiquidations: number;
    };
    wallets: {
      id: string;
      solde: number;
      canBeNegative: number;
      currency: {
        id: string;
        symbol: string;
      };
    }[];
    organization: {
      _count: {
        operations: number;
        agents: number;
        taxations: number;
        liquidations: number;
      };
      monthlyEntry: number;
      wallet: {
        currency: {
          formatKey: string;
        };
        solde: number;
      };
    } | null;
  } | null;
};

const GenericInformationStat = (props: DescriptiveCard) => {
  return (
    <div className="max-lg:w-1/2 max-md:w-full flex flex-col p-5 bg-bg-secondary rounded-lg flex-1 gap-5">
      <div className="flex justify-between">
        <span className="w-12 h-12 text-foreground bg-background flex items-center justify-center rounded-full">
          <TbPigMoney size={25} />
        </span>
        {/* <span>
          <MdOpenInNew size={25} />
        </span> */}
      </div>
      <div>
        <div className="flex gap-2 items-end">
          <span className="text-4xl font-bold max-md:text-xl">
            {props.reportNumber}
          </span>
          <span>{props.unit}</span>
        </div>
        <span>{props.title}</span>
      </div>
    </div>
  );
};

const SimpleStatCard = ({
  number,
  title,
  unit,
  width = "w-full",
}: {
  number: string | number;
  title: string;
  unit: string;
  width?: string;
}) => {
  return (
    <div
      className={`flex flex-col p-5 bg-bg-secondary rounded-lg flex-1 h-full gap-5 ${width}`}
    >
      <div className="flex gap-2 items-end">
        <span className="text-4xl font-bold max-md:text-xl">{number}</span>
        <span>{unit}</span>
      </div>
      <span>{title}</span>
    </div>
  );
};

export default function Home() {
  const [userInfo, setUserInfo] = useState<AgentState | null>(null);
  const [genericData, setGenericData] = useState<DescriptiveCard[]>([]);
  const [error, setError] = useState<{
    code: number;
    message: string;
    [key: string]: any;
  }>();

  useEffect(() => {
    const requester = async () => {
      const httpClient = new HttpClient();
      const data: { code: number; message: string; data?: AgentState } =
        await httpClient.get("load/stats");

      if (!data && httpClient.error !== null) setError(httpClient.error);
      else if (!data.data && httpClient.error !== null)
        setError(httpClient.error);
      else if (data.data) {
        setUserInfo(data.data);
        if (data.data.agent && data.data.agent.organization)
          setGenericData([
            {
              title: "solde de l'organization",
              reportNumber: data.data.agent?.organization?.wallet?.solde + "",
              unit: data.data.agent?.organization?.wallet?.currency.formatKey,
              dataUrl: "",
              icon: "",
            },
            {
              title: "nombre d'agent actifs",
              reportNumber: data.data.agent?.organization?._count.agents + "",
              unit: "agents",
              dataUrl: "",
              icon: "",
            },
            {
              title: "nombre des taxations effectuées",
              reportNumber:
                data.data.agent?.organization?._count.taxations + "",
              unit: "taxations",
              dataUrl: "",
              icon: "",
            },
            {
              title: "nombre des taxations liquidations",
              reportNumber:
                data.data.agent?.organization?._count.liquidations + "",
              unit: "liquidations",
              dataUrl: "",
              icon: "",
            },
          ]);
      }
    };

    requester();
  }, []);

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
    <div className="w-full h-full max-h-[90vh] flex flex-col p-10 max-md:p-5 gap-5 mb-10">
      <div className="bg-background p-5 rounded-lg flex flex-col gap-5">
        <h1 className="text-xl font-semibold ">
          Information générale sur l&apos;organisation
        </h1>
        <div className="flex gap-5 justify-between flex-wrap max-md:grid max-md:grid-cols-2">
          {genericData.length == 0 ? (
            <div className="h-20 w-full flex items-center justify-center">
              Vous n&apos;avez pas le droit de voir les informations sur votre
              organisation
            </div>
          ) : (
            genericData.map((report, index) => {
              return <GenericInformationStat {...report} key={index} />;
            })
          )}
        </div>
      </div>

      <div
        className={`w-full h-fit max-h-2/3 grid ${
          userInfo?.agent?.organization ? "grid-cols-2" : "grid-cols-1"
        } gap-5 max-lg:flex max-lg:flex-col`}
      >
        {userInfo?.agent?.organization ? (
          <StatisticsBlock
            monthlyEntry={userInfo?.agent?.organization?.monthlyEntry || 0}
          />
        ) : (
          false
        )}
        <div className="w-full max-lg:w-full h-fit bg-background rounded-lg flex flex-col gap-5 p-5">
          <h1 className="text-xl font-semibold w-full">Vos informations</h1>
          <div className="gap-5 grid grid-cols-2">
            <SimpleStatCard
              number={userInfo?.agent?.wallets[0]?.solde || 0}
              title="Votre solde"
              unit={userInfo?.agent?.wallets[0]?.currency?.symbol || "fc"}
              width="w-full col-span-2"
            />
            <SimpleStatCard
              number={userInfo?.agent?._count.operationInitializated || 0}
              title="operations initialisées"
              unit="operations"
            />
            <SimpleStatCard
              number={userInfo?.agent?._count.operationClosed || 0}
              title="operations clôturées"
              unit="operations"
            />
            <SimpleStatCard
              number={userInfo?.agent?._count.liquidations || 0}
              title="liquidations effectuées"
              unit="liquidations"
            />
            <SimpleStatCard
              number={userInfo?.agent?._count.agentBusStops || 0}
              title="nombre des parkings où vous êtes affectés"
              unit="parkings"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
