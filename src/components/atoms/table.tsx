import Image from "next/image";
import { useParams } from "next/navigation";
import { useState, useEffect, useMemo } from "react";
import {
  FiSearch,
  FiChevronLeft,
  FiChevronRight,
  FiChevronDown,
  FiChevronRight as FiChevronRightExpand,
} from "react-icons/fi";
import notElement from "@/../public/window.svg";
import Link from "next/link";
import { iconsDictionary } from "../store/icon";
import { IoEllipsisHorizontalSharp } from "react-icons/io5";
import ImageWithFallback from "./table-image";

export interface DataTableColumnType<T> {
  property: string;
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
    "^(https?:\\/\\/)" +
      "((([a-zA-Z\\d]([a-zA-Z\\d-]*[a-zA-Z\\d])*)\\.)+[a-zA-Z]{2,}|" +
      "((\\d{1,3}\\.){3}\\d{1,3}))" +
      "(\\:\\d+)?(\\/[-a-zA-Z\\d%_.~+]*)*" +
      "(\\?[;&a-zA-Z\\d%_.~+=-]*)?" +
      "(\\#[-a-zA-Z\\d_]*)?$",
    "i"
  );
  return urlPattern.test(url);
}

function getNestedValue(obj: any, path: string): any {
  if (typeof obj === "boolean") return obj ? "oui" : "non";
  if (!obj || !path) return "_____";
  if (typeof obj === "string") return obj;
  if (typeof obj === "number") return obj;
  if (obj == null) return "----";

  const keys = path.split(".");
  let current: any = obj;

  for (const key of keys) {
    if (current == null || current[key] === undefined) {
      return "----";
    }
    current = current[key];
  }

  return current;
}

type FlattenedItem<T> = T & {
  level: number;
  parentId?: string | number;
  isVisible?: boolean;
};

function flattenData<T extends { id?: string | number; children?: T[] }>(
  data: T[],
  level: number = 0,
  parentId?: string | number
): FlattenedItem<T>[] {
  let flattened: FlattenedItem<T>[] = [];

  data.forEach((item) => {
    flattened.push({ ...item, level, parentId, isVisible: true });

    if (item.children && item.children.length > 0) {
      const children = flattenData(item.children, level + 1, item.id);
      flattened = flattened.concat(children);
    }
  });

  return flattened;
}

export function DataTable<T extends { id?: string | number; children?: T[] }>({
  data,
  columns,
  selectable = true,
  onRowSelect,
  actions,
  filters,
  searchable = true,
  searchKeys = [],
}: TableProps<T>) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRows, setSelectedRows] = useState<T[]>([]);
  const [filteredData, setFilteredData] = useState<FlattenedItem<T>[]>([]);
  const [expandedRows, setExpandedRows] = useState<Set<string | number>>(
    new Set()
  );
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;
  const params: { app: string; model: string } = useParams();

  const validatedSearchKeys = useMemo(() => {
    if (searchKeys.length > 0) {
      return searchKeys;
    }
    return columns ? columns.map((column) => column.property) : [];
  }, [columns, searchKeys]);

  useEffect(() => {
    const filterData = () => {
      let filtered = data;
      if (searchable && searchTerm) {
        filtered = data.filter((item) =>
          validatedSearchKeys.some((key) => {
            const value = getNestedValue(item, key as string);
            return String(value)
              .toLowerCase()
              .includes(searchTerm.toLowerCase());
          })
        );
      }
      setFilteredData(flattenData(filtered));
    };

    const debounceTimeout = setTimeout(filterData, 300);
    return () => clearTimeout(debounceTimeout);
  }, [searchTerm, data, searchable, validatedSearchKeys]);

  const toggleRowExpansion = (id: string | number) => {
    setExpandedRows((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const isRowVisible = (item: FlattenedItem<T>) => {
    if (item.level === 0) return true;
    if (!item.parentId) return true;
    return expandedRows.has(item.parentId);
  };

  const visibleData = filteredData.filter(isRowVisible);
  const totalPages = Math.ceil(visibleData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = visibleData.slice(startIndex, endIndex);

  return (
    <div className="w-full flex flex-col gap-5">
      <div className="flex justify-between items-center gap-4 max-md:flex-col">
        <div
          className={`w-full flex-1 flex items-center px-4 py-3 text-foreground focus:outline-none focus:ring-2 rounded-lg gap-4 ${
            searchable ? "bg-background border-background" : ""
          }`}
        >
          {searchable && (
            <>
              <FiSearch size={20} />
              <input
                type="text"
                placeholder="Rechercher..."
                className="w-full bg-background outline-none"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </>
          )}
        </div>
        {filters}
        {actions}
      </div>

      <div className="overflow-x-auto rounded-lg border border-background">
        <table className="min-w-full divide-y divide-bg-secondary">
          <thead className="bg-background">
            <tr>
              <th className="w-8"></th>
              {selectable && (
                <th className="w-12 px-4 py-3">
                  <input
                    type="checkbox"
                    className="rounded border-bg-secondary bg-bg-secondary text-foreground"
                    checked={selectedRows.length === filteredData.length}
                    onChange={(e) => {
                      const selected = e.target.checked ? filteredData : [];
                      setSelectedRows(selected);
                      onRowSelect?.(selected);
                    }}
                  />
                </th>
              )}
              {columns.map((column) => (
                <th
                  key={column.property}
                  className={`px-5 py-3 text-left text-sm font-bold text-gray-600 dark:text-gray-400 tracking-wider ${
                    column.property == "id" ? "w-40" : column.width || ""
                  }`}
                >
                  {column.verbose}
                </th>
              ))}
              <th className="px-4 py-3 text-left text-sm font-bold text-gray-600 dark:text-gray-400 tracking-wider w-40">
                action
              </th>
            </tr>
          </thead>
          <tbody className="bg-background divide-y divide-bg-secondary">
            {currentData.map((item: Record<string | number, any>, index) => {
              const hasChildren = item.children && item.children.length > 0;
              const isExpanded = hasChildren && expandedRows.has(item.id!);

              return (
                <tr
                  key={`${item.id || index}-${item.level}`}
                  className="hover:bg-bg-secondary transition-colors"
                >
                  <td className="pl-2">
                    {hasChildren && (
                      <button
                        onClick={() => toggleRowExpansion(item.id!)}
                        className="p-1 hover:bg-bg-secondary rounded-full"
                      >
                        {isExpanded ? (
                          <FiChevronDown className="w-4 h-4" />
                        ) : (
                          <FiChevronRightExpand className="w-4 h-4" />
                        )}
                      </button>
                    )}
                  </td>
                  {selectable && (
                    <td className="px-4 py-3 whitespace-nowrap">
                      <input
                        type="checkbox"
                        className="rounded border-gray-300"
                        checked={selectedRows.includes(item.id)}
                        onChange={() => {
                          const newSelectedRows: T[] = selectedRows.includes(
                            item.id
                          )
                            ? selectedRows.filter((row) => row !== item.id)
                            : [...selectedRows, item.id as T];
                          setSelectedRows(newSelectedRows);
                          onRowSelect?.(newSelectedRows);
                        }}
                      />
                    </td>
                  )}
                  {columns.map((column) => {
                    let Icon = IoEllipsisHorizontalSharp;
                    if (
                      column.property == "icon" &&
                      item[column.property] in iconsDictionary
                    ) {
                      Icon = iconsDictionary[item["icon"]].component;
                    }
                    return (
                      <td
                        key={`${item.id || index}-${column.property}-${
                          item.level
                        }`}
                        className="px-4 py-3"
                        style={{ paddingLeft: `${item.level * 20}px` }}
                      >
                        {["url", "photo"].includes(column.property) ? (
                          <ImageWithFallback
                            src={
                              String(
                                item[column.property as keyof typeof item]
                              ) &&
                              isValidUrlRegex(
                                String(
                                  item[column.property as keyof typeof item]
                                )
                              )
                                ? String(
                                    item[column.property as keyof typeof item]
                                  )
                                : `${process.env.NEXT_PUBLIC_API_BASE_URL}/${
                                    item[column.property as keyof typeof item]
                                  }`

                              // notElement
                            }
                            width={100}
                            height={100}
                            alt="url image"
                            className="border-2 border-green-500 rounded-md h-16 w-16"
                          />
                        ) : column.property == "icon" ? (
                          <Icon size={20} />
                        ) : column.property == "createdAt" ? (
                          new Date(
                            item[column.property as keyof typeof item]
                          ).toLocaleDateString()
                        ) : column.property === "wallets.solde" ? (
                          item["wallets" as keyof typeof item]?.[0] ? (
                            `${
                              item["wallets" as keyof typeof item][0]["solde"]
                            } fc`
                          ) : (
                            "---"
                          )
                        ) : (
                          getNestedValue(
                            item[column.property.split(".")[0]],
                            column.property.split(".").length > 1
                              ? column.property.split(".").slice(1).join(".")
                              : column.property
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

      {
        <div className="flex items-center justify-between mt-4 px-4">
          <div className="text-sm text-foreground">
            Affichage {startIndex + 1} à{" "}
            {Math.min(endIndex, visibleData.length)} sur {visibleData.length}{" "}
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
      }
    </div>
  );
}

export default DataTable;
