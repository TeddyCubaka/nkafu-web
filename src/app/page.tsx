"use client";

import StatisticsBlock from "@/components/atoms/stats";
import { connectedUserStore } from "@/components/store/connectedUser";
import { MdOpenInNew } from "react-icons/md";
import { TbPigMoney } from "react-icons/tb";
import { useStore } from "zustand";

export default function Home() {
  const { user } = useStore(connectedUserStore);

  return (
    <div className="w-full h-full max-h-screen flex flex-col p-10 gap-5">
      <div className="flex gap-5 justify-between rounded-lg">
        {Array(4)
          .fill(null)
          .map((_, element) => {
            return (
              <div className="flex flex-col text-foreground p-5 bg-background rounded-lg flex-1 gap-10">
                <div className="flex justify-between">
                  <span className="w-12 h-12 text-foreground bg-bg-secondary flex items-center justify-center rounded-full">
                    <TbPigMoney size={25} />
                  </span>
                  <span>
                    <MdOpenInNew size={25} />
                  </span>
                </div>
                <div>
                  <div>
                    <span className="text-[36px] font-bold">100</span>
                    <span>%</span>
                  </div>
                  <span>titre du bloc ici</span>
                </div>
              </div>
            );
          })}
      </div>

      <div className="w-full h-full flex pb-10 gap-5">
        <StatisticsBlock />
        <div className="w-1/3 h-full bg-background rounded-lg flex items-center justify-center">
          autre donnée
        </div>
      </div>
    </div>
  );
}
