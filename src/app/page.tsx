"use client";

import StatisticsBlock from "@/components/atoms/stats";
// import { connectedUserStore } from "@/components/store/connectedUser";
import { MdOpenInNew } from "react-icons/md";
import { TbPigMoney } from "react-icons/tb";
// import { useStore } from "zustand";

type DescriptiveCard = {
  icon: string;
  reportNumber: string;
  unit: string;
  dataUrl: string;
  title: string;
};

const genericData: DescriptiveCard[] = [
  {
    icon: "",
    reportNumber: "2 340 500",
    unit: "fc",
    dataUrl: "/list/core/agent",
    title: "caisse de l'organisation",
  },
  {
    icon: "",
    reportNumber: "30 000",
    unit: "fc",
    dataUrl: "/list/core/operation",
    title: "operations réussies",
  },
  {
    icon: "",
    reportNumber: "867",
    unit: "redevables",
    dataUrl: "/list/core/agent",
    title: "nombre des redevables recencés",
  },
  {
    icon: "",
    reportNumber: "2 000",
    unit: "engins",
    dataUrl: "/list/core/possessions",
    title: "nombre des engins identifiés",
  },
];

export default function Home() {
  // const { user } = useStore(connectedUserStore);

  return (
    <div className="w-full h-full max-h-[90vh] flex flex-col p-10 max-md:p-5 gap-5 mb-10">
      <div className="bg-background p-5 rounded-lg flex flex-col gap-5">
        <h1 className="text-xl font-semibold ">
          Information générale sur l&apos;organisation
        </h1>
        <div className="flex gap-5 justify-between flex-wrap">
          {genericData.map((report, index) => {
            return (
              <div
                key={index}
                className="max-lg:w-1/2 flex flex-col p-5 bg-bg-secondary rounded-lg flex-1 gap-5"
              >
                <div className="flex justify-between">
                  <span className="w-12 h-12 text-foreground bg-background flex items-center justify-center rounded-full">
                    <TbPigMoney size={25} />
                  </span>
                  <span>
                    <MdOpenInNew size={25} />
                  </span>
                </div>
                <div>
                  <div className="flex gap-2 items-end">
                    <span className="text-4xl font-bold max-md:text-xl">
                      {report.reportNumber}
                    </span>
                    <span>{report.unit}</span>
                  </div>
                  <span>{report.title}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="w-full h-fit max-h-2/3 flex gap-5 max-lg:flex-col">
        <StatisticsBlock />
        <div className="w-1/3 max-lg:w-full h-full max-md:h-20 bg-background rounded-lg flex items-center justify-center">
          autre donnée
        </div>
      </div>
    </div>
  );
}
