import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Plus, Loader2 } from "lucide-react";
import { useState } from "react";

interface Column<T> {
  key: keyof T | string;
  label: string;
  render?: (item: T) => React.ReactNode;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  isLoading?: boolean;
  searchPlaceholder?: string;
  onAdd?: () => void;
  addLabel?: string;
  onRowClick?: (item: T) => void;
  getRowKey: (item: T) => string;
}

export function DataTable<T>({
  columns,
  data,
  isLoading,
  searchPlaceholder = "ค้นหา...",
  onAdd,
  addLabel = "เพิ่มใหม่",
  onRowClick,
  getRowKey,
}: DataTableProps<T>) {
  const [search, setSearch] = useState("");

  const filteredData = data.filter((item) => {
    if (!search) return true;
    return columns.some((col) => {
      const value = (item as Record<string, unknown>)[col.key as string];
      return String(value || "").toLowerCase().includes(search.toLowerCase());
    });
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={searchPlaceholder}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        {onAdd && (
          <Button onClick={onAdd} className="gap-2">
            <Plus className="h-4 w-4" />
            {addLabel}
          </Button>
        )}
      </div>

      <div className="rounded-lg border bg-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              {columns.map((col) => (
                <TableHead key={String(col.key)} className="font-semibold">
                  {col.label}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-32 text-center">
                  <Loader2 className="h-6 w-6 animate-spin mx-auto text-muted-foreground" />
                </TableCell>
              </TableRow>
            ) : filteredData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-32 text-center text-muted-foreground">
                  ไม่พบข้อมูล
                </TableCell>
              </TableRow>
            ) : (
              filteredData.map((item) => (
                <TableRow
                  key={getRowKey(item)}
                  onClick={() => onRowClick?.(item)}
                  className={onRowClick ? "cursor-pointer hover:bg-muted/50 transition-colors" : ""}
                >
                  {columns.map((col) => (
                    <TableCell key={String(col.key)}>
                      {col.render
                        ? col.render(item)
                        : String((item as Record<string, unknown>)[col.key as string] || "-")}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <div className="text-sm text-muted-foreground">
        แสดง {filteredData.length} จาก {data.length} รายการ
      </div>
    </div>
  );
}
