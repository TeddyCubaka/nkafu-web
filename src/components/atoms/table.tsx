import Image from "next/image";
import { useParams, usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { FiSearch, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import notElement from "@/../public/window.svg";
import Link from "next/link";
import { iconsDictionary } from "../store/icon";
import { IoEllipsisHorizontalSharp } from "react-icons/io5";

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

function isValidUrlRegex(url: string): boolean {
  const urlPattern = new RegExp(
    "^(https?:\\/\\/)" + // Protocole (http ou https)
      "((([a-zA-Z\\d]([a-zA-Z\\d-]*[a-zA-Z\\d])*)\\.)+[a-zA-Z]{2,}|" + // Nom de domaine
      "((\\d{1,3}\\.){3}\\d{1,3}))" + // OU une adresse IP (v4)
      "(\\:\\d+)?(\\/[-a-zA-Z\\d%_.~+]*)*" + // Port et chemin
      "(\\?[;&a-zA-Z\\d%_.~+=-]*)?" + // Query string
      "(\\#[-a-zA-Z\\d_]*)?$", // Fragment
    "i"
  );

  return urlPattern.test(url);
}

// function getNestedValue(obj: any, path: string): any {
//   if (typeof obj == "boolean") return obj ? "oui" : "non";
//   if (!obj || !path) return "_____";
//   if (typeof obj == "string") return obj;
//   if (typeof obj == "number") return obj;

//   const keys = path.split(".");
//   let current: any = obj;

//   for (const key of keys) {
//     if (current[key] === undefined) {
//       return "----";
//     }
//     current = current[key];
//   }

//   return current;
// }

function getNestedValue(obj: any, path: string): any {
  if (typeof obj === "boolean") return obj ? "oui" : "non";
  if (!obj || !path) return "_____";
  if (typeof obj === "string") return obj;
  if (typeof obj === "number") return obj;

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
  const [filteredData, setFilteredData] = useState<any[]>(data);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;
  const params: { app: string; model: string } = useParams();

  useEffect(() => {
    if (searchable && searchTerm) {
      const validatedSearchKeys =
        searchKeys.length > 0
          ? searchKeys
          : columns
          ? columns.map((column) => column.proprety)
          : [];

      const filtered = data.filter((item) =>
        validatedSearchKeys.some((key) => {
          const value = getNestedValue(item, key as string);
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
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600" />
              <input
                type="text"
                placeholder="Rechercher..."
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 border-background bg-background text-foreground"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          )}
          {filters}
          {actions}
        </div>
      </div>

      <div className="overflow-x-auto rounded-lg border border-background">
        <table className="min-w-full divide-y divide-bg-secondary">
          <thead className="bg-background">
            <tr>
              {selectable && (
                <th className="w-12 px-4 py-3">
                  <input
                    type="checkbox"
                    className="rounded border-bg-secondary bg-bg-secondary text-foreground"
                    checked={selectedRows.length === filteredData.length}
                    onChange={handleSelectAll}
                  />
                </th>
              )}
              {columns.map((column) => (
                <th
                  key={column.proprety}
                  className={`px-5 py-3 text-left text-sm font-bold text-gray-600 dark:text-gray-400 tracking-wider ${
                    column.proprety == "id" ? "w-40" : column.width || ""
                  }`}
                >
                  {column.verbose}
                </th>
              ))}
              <th
                className={`px-4 py-3 text-left text-sm font-bold text-gray-600 dark:text-gray-400 tracking-wider w-40`}
              >
                action
              </th>
            </tr>
          </thead>
          <tbody className="bg-background divide-y divide-bg-secondary">
            {currentData.map((item, index) => {
              return (
                <tr
                  key={item.id || index}
                  className="hover:bg-bg-secondary transition-colors"
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
                  {columns.map((column) => {
                    let Icon = IoEllipsisHorizontalSharp;
                    if (
                      column.proprety == "icon" &&
                      item[column.proprety] in iconsDictionary
                    ) {
                      Icon = iconsDictionary[item["icon"]].component;
                    }
                    return (
                      <td
                        key={`${item.id || index}-${column.proprety}`}
                        className="px-4 py-3"
                      >
                        {["url", "photo"].includes(column.proprety) ? (
                          <Image
                            src={
                              String(
                                item[column.proprety as keyof typeof item]
                              ) &&
                              isValidUrlRegex(
                                String(
                                  item[column.proprety as keyof typeof item]
                                )
                              )
                                ? String(
                                    item[column.proprety as keyof typeof item]
                                  )
                                : notElement
                            }
                            width={100}
                            height={100}
                            alt="url image"
                            className="border-2 border-green-500 rounded-md h-16 w-16"
                          />
                        ) : column.proprety == "icon" ? (
                          <Icon size={20} />
                        ) : column.proprety == "wallets" ? (
                          <span>
                            {item[column.proprety as keyof typeof item][0]
                              ? item[column.proprety as keyof typeof item][0]
                                  .solde
                              : "---"}
                          </span>
                        ) : (
                          getNestedValue(
                            item[column.proprety.split(".")[0] as keyof T],
                            column.proprety.split(".").length > 1
                              ? column.proprety.split(".").slice(1).join(".")
                              : column.proprety
                          )
                        )}
                      </td>
                    );
                  })}
                  <td className="px-4 py-3 whitespace-nowrap w-fit">
                    <Link
                      href={`/${
                        ["agent"].includes(params.model) ? "list" : "change"
                      }/${params.app}/${params.model}/${item.id}`}
                      className="text-sm font-semibold text-primary"
                    >
                      Afficher
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {totalPages > -1 && (
        <div className="flex items-center justify-between mt-4 px-4">
          <div className="text-sm text-foreground">
            Affichage {startIndex + 1} à{" "}
            {Math.min(endIndex, filteredData.length)} sur {filteredData.length}{" "}
            entrées
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-2 rounded-md hover:bg-bg-secondary disabled:opacity-50"
            >
              <FiChevronLeft className="w-5 h-5 text-foreground" />
            </button>
            <span className="text-sm text-foreground">
              Page {currentPage} sur {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="p-2 rounded-md hover:bg-bg-secondary disabled:opacity-50"
            >
              <FiChevronRight className="w-5 h-5 text-foreground" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
