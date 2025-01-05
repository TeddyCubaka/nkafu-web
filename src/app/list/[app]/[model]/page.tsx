"use client";
import { JsonErrorCard } from "@/components/atoms/display-error";
import { DataTable, DataTableColumnType } from "@/components/atoms/table";
import HttpClient from "@/utils/http-client";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const ListModelPage = () => {
  const path = usePathname();
  const [error, setError] = useState<{
    code: number;
    message: string;
    [key: string]: any;
  }>();
  const [data, setData] = useState<any>([]);
  const [metaData, setMetaData] = useState<{
    listColumns: DataTableColumnType<{ id?: string | number | undefined }>[];
  }>();
  useEffect(() => {
    const requester = async () => {
      const httpClient = new HttpClient();
      const data: { code: number; message: string; data: any; meta: any } =
        await httpClient.get(path);
      if (!data && httpClient.error !== null) setError(httpClient.error);

      setMetaData(data.meta);
      setData(data.data);
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
    <div className="p-10">
      <DataTable columns={metaData?.listColumns || []} data={data} />
    </div>
  );
};

export default ListModelPage;
