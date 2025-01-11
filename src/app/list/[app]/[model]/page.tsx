"use client";
import { JsonErrorCard } from "@/components/atoms/display-error";
import Loader from "@/components/atoms/loader";
import { DataTable, DataTableColumnType } from "@/components/atoms/table";
import HttpClient from "@/utils/http-client";
import { useParams, usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FiPlus } from "react-icons/fi";
import { LuRefreshCcw } from "react-icons/lu";

const TableAction = ({ setRefreshData }: { setRefreshData: () => void }) => {
  const params: { app: string; model: string } = useParams();
  const router = useRouter();
  return (
    <div className="flex gap-2 max-md:w-full">
      <button
        onClick={() => {
          router.push(`/create/${params.app}/${params.model}`);
        }}
        className="max-md:flex-1 text-center px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 flex items-center gap-2"
      >
        <FiPlus />
        <span className="w-full">Ajouter</span>
      </button>
      <button
        onClick={setRefreshData}
        className="max-md:flex-1 text-center px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 flex items-center gap-2"
      >
        <LuRefreshCcw />
        <span className="w-full">Refraichir</span>
      </button>
    </div>
  );
};

const ListModelPage = () => {
  const path = usePathname();
  const [error, setError] = useState<{
    code: number;
    message: string;
    [key: string]: any;
  }>();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>([]);
  const [metaData, setMetaData] = useState<{
    listColumns: DataTableColumnType<{ id?: string | number | undefined }>[];
  }>();
  const [refreshData, setRefreshData] = useState(true);

  useEffect(() => {
    const requester = async () => {
      try {
        setLoading(true);
        const httpClient = new HttpClient();
        const data: { code: number; message: string; data: any; meta: any } =
          await httpClient.get(path);
        if (!data && httpClient.error !== null) setError(httpClient.error);
        else if (!data.data && httpClient.error !== null)
          setError(httpClient.error);
        else {
          setMetaData(data.meta);
          setData(data.data);
        }
      } catch (error: any) {
        setError({
          code: error.code || 500,
          message: error.message || "une erreur s'est produite",
        });
      } finally {
        setRefreshData(false);
        setLoading(false);
      }
    };
    if (refreshData) requester();
  }, [path, refreshData]);

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
    <div className="p-10 max-md:p-5">
      <DataTable
        columns={metaData?.listColumns || []}
        data={data}
        actions={
          <TableAction {...{ setRefreshData: () => setRefreshData(true) }} />
        }
      />
    </div>
  );
};

export default ListModelPage;
