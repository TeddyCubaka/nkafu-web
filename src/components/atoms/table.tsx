import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { FiSearch, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import notElement from "@/../public/window.svg";
import Button from "../commons/button";
import { MdOutlineRemoveRedEye } from "react-icons/md";

export interface DataTableColumnType<T> {
  proprety: string;
  verbose: string;
  render?: (value: any, item: T) => React.ReactNode;
  width?: string;
}

export interface TableProps<T> {
  data: T[];
  columns: DataTableColumnType<T>[];
  selectable?: boolean;
  onRowSelect?: (selectedRows: T[]) => void;
  actions?: React.ReactNode;
  filters?: React.ReactNode;
  searchable?: boolean;
  searchKeys?: (keyof T)[];
  className?: string;
}

function getNestedValue(obj: any, path: string): any {
  if (typeof obj == "boolean") return obj ? "oui" : "non";
  if (!obj || !path) return "_____";
  if (typeof obj == "string") return obj;
  if (typeof obj == "number") return obj;

  const keys = path.split(".");
  let current: any = obj;

  for (const key of keys) {
    if (current[key] === undefined) {
      return "----";
    }
    current = current[key];
  }

  return current;
}

export function DataTable<T extends { id?: string | number }>({
  data,
  columns,
  selectable = false,
  onRowSelect,
  actions,
  filters,
  searchable = true,
  searchKeys = [],
}: TableProps<T>) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRows, setSelectedRows] = useState<T[]>([]);
  const [filteredData, setFilteredData] = useState<T[]>(data);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const router = useRouter();
  const path = usePathname();

  useEffect(() => {
    if (searchable && searchTerm) {
      const filtered = data.filter((item) =>
        searchKeys.some((key) => {
          const value = item[key];
          return String(value).toLowerCase().includes(searchTerm.toLowerCase());
        })
      );
      setFilteredData(filtered);
    } else {
      setFilteredData(data);
    }
  }, [searchTerm, data, searchable, searchKeys]);

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.checked ? filteredData : [];
    setSelectedRows(selected);
    onRowSelect?.(selected);
  };

  const handleSelectRow = (item: T) => {
    const newSelectedRows = selectedRows.includes(item)
      ? selectedRows.filter((row) => row !== item)
      : [...selectedRows, item];
    setSelectedRows(newSelectedRows);
    onRowSelect?.(newSelectedRows);
  };

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = filteredData.slice(startIndex, endIndex);

  return (
    <div className="w-full">
      <div className="mb-6">
        <div className="flex justify-between items-center gap-4 mb-4">
          {searchable && (
            <div className="relative flex-1">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          )}
          {filters}
          {actions}
        </div>
      </div>

      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {selectable && (
                <th className="w-12 px-4 py-3">
                  <input
                    type="checkbox"
                    className="rounded border-gray-300"
                    checked={selectedRows.length === filteredData.length}
                    onChange={handleSelectAll}
                  />
                </th>
              )}
              {columns.map((column) => (
                <th
                  key={column.proprety}
                  className={`px-4 py-3 text-left text-sm font-medium text-gray-500 tracking-wider ${
                    column.width || ""
                  }`}
                >
                  {column.verbose}
                </th>
              ))}
              <th
                className={`px-4 py-3 text-left text-sm font-medium text-gray-500 tracking-wider w-40`}
              >
                action
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentData.map((item, index) => {
              return (
                <tr
                  key={item.id || index}
                  className="hover:bg-gray-50 transition-colors"
                >
                  {selectable && (
                    <td className="px-4 py-3 whitespace-nowrap">
                      <input
                        type="checkbox"
                        className="rounded border-gray-300"
                        checked={selectedRows.includes(item)}
                        onChange={() => handleSelectRow(item)}
                      />
                    </td>
                  )}
                  {columns.map((column) => (
                    <td
                      key={`${item.id || index}-${column.proprety}`}
                      className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 min-w-32"
                    >
                      {column.proprety == "url" ? (
                        <Image
                          src={
                            String(item[column.proprety as keyof typeof item])
                              ? //  &&
                                // isValidURL(
                                //   String(item[column.key as keyof typeof item])
                                // )
                                String(
                                  item[column.proprety as keyof typeof item]
                                )
                              : notElement
                          }
                          width={100}
                          height={100}
                          alt="url image"
                          className="border-2 border-green-500 rounded-md h-16 w-16"
                        />
                      ) : (
                        getNestedValue(
                          item[column.proprety.split(".")[0] as keyof T],
                          column.proprety.split(".").length > 1
                            ? column.proprety.split(".").slice(1).join(".")
                            : column.proprety
                        )
                      )}
                    </td>
                  ))}
                  <td className="px-4 py-3 whitespace-nowrap w-fit">
                    <Button
                      variant="outline"
                      onClick={() => {
                        router.push(`${path}/${item.id}`);
                      }}
                    >
                      <MdOutlineRemoveRedEye size={20} />
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {totalPages > -1 && (
        <div className="flex items-center justify-between mt-4 px-4">
          <div className="text-sm text-gray-500">
            Affichage {startIndex + 1} à{" "}
            {Math.min(endIndex, filteredData.length)} sur {filteredData.length}{" "}
            entrées
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-2 rounded-md hover:bg-gray-100 disabled:opacity-50"
            >
              <FiChevronLeft className="w-5 h-5" />
            </button>
            <span className="text-sm text-gray-600">
              Page {currentPage} sur {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="p-2 rounded-md hover:bg-gray-100 disabled:opacity-50"
            >
              <FiChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
