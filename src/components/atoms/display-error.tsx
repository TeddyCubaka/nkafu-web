import { useRouter } from "next/navigation";
import { useState } from "react";
import { CiCircleAlert, CiCircleCheck, CiCircleRemove } from "react-icons/ci";
import { FiChevronDown, FiChevronRight, FiClock } from "react-icons/fi";
import { IoMdClose } from "react-icons/io";
export type AlertStatus = "success" | "error" | "warning" | "info";

export interface JsonErrorCardProps {
  message: string;
  status: AlertStatus;
  show?: boolean;
  onClose?: () => void;
  errorDetails?: any;
  timestamp?: string;
  code?: string | number;
  stack?: boolean;
}

const Icon = ({ status }: { status: AlertStatus }) => {
  if (status == "success") return <CiCircleCheck />;
  else if (status == "warning") return <CiCircleAlert />;
  else return <CiCircleRemove />;
};

export const JsonErrorCard = ({
  message,
  status,
  show = true,
  errorDetails,
  timestamp,
  code,
  stack = false,
}: JsonErrorCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const router = useRouter();

  if (!show) return null;

  const formatJson = (data: any) => {
    try {
      return JSON.stringify(data, null, 2);
    } catch (e) {
      return String(data);
    }
  };

  const statusStyles = {
    error: "border-red-200 bg-red-50",
    success: "border-green-200 bg-green-50",
    warning: "border-yellow-200 bg-yellow-50",
    info: "border-blue-200 bg-blue-50",
  };

  const headerStyles = {
    error: "bg-red-100",
    success: "bg-green-100",
    warning: "bg-yellow-100",
    info: "bg-blue-100",
  };

  const colorStyle = {
    error: "text-red-500",
    success: "text-green-500",
    warning: "text-yellow-500",
    info: "text-blue-500",
  };

  return (
    <div>
      <div className="p-5 flex flex-col justify-center items-center gap-5">
        <h1
          className={`text-2xl flex gap-2.5 items-center ${colorStyle[status]}`}
        >
          <Icon {...{ status }} /> {code}
        </h1>
        <div>{message}</div>
      </div>
      <div
        className={`rounded-lg border ${statusStyles[status]} overflow-hidden`}
      >
        <div
          className={`px-4 py-3 ${headerStyles[status]} flex items-center justify-between cursor-pointer`}
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div className="w-full flex items-center justify-between gap-3">
            <span className="w-full flex items-center gap-3">
              {isExpanded ? (
                <FiChevronDown className="w-5 h-5" />
              ) : (
                <FiChevronRight className="w-5 h-5" />
              )}
              <span className="font-medium">{message}</span>
              {code && (
                <span className="text-sm px-2 py-1 rounded-full bg-white/50">
                  Code: {code}
                </span>
              )}
            </span>
            <span title="fermer" className="text-lg" onClick={() => router.back()}>
              <IoMdClose size={30} />
            </span>
          </div>
          {timestamp && (
            <div className="flex items-center gap-2 text-sm">
              <FiClock className="w-4 h-4" />
              {timestamp}
            </div>
          )}
        </div>

        {isExpanded && (
          <div className="p-4 space-y-4">
            {errorDetails && (
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Détails :</h4>
                <pre className="bg-black/5 p-3 rounded-lg text-sm overflow-x-auto text-wrap">
                  {formatJson(errorDetails)}
                </pre>
              </div>
            )}

            {stack && errorDetails?.stack && (
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Stack Trace:</h4>
                <pre className="bg-black/5 p-3 rounded-lg text-sm overflow-x-auto whitespace-pre-wrap">
                  {errorDetails.stack}
                </pre>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
