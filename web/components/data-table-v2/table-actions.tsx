"use client";
import { MoreHorizontal, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DataTableAction } from "./types";
// import type { DataTableAction } from "@/types/data-table"

interface TableActionsProps<T> {
  row: T;
  actions: DataTableAction<T>[];
}

export function TableActions<T>({ row, actions }: TableActionsProps<T>) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {actions.map((action, index) => (
          <DropdownMenuItem
            key={index}
            onClick={() => action.onClick(row)}
            className={
              action.variant === "destructive"
                ? "text-red-600 focus:text-red-600"
                : ""
            }
          >
            {action.icon && <span className="mr-2">{action.icon}</span>}
            {action.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

interface AddButtonProps {
  onAddClick: () => void;
  label: string;
  variant?: "button" | "modal";
}

export function AddButton({
  onAddClick,
  label,
  variant = "button",
}: AddButtonProps) {
  if (variant === "modal") {
    return (
      <Button onClick={onAddClick} size="sm" className="gap-2">
        <Plus className="h-4 w-4" />
        {label}
      </Button>
    );
  }

  return (
    <Button onClick={onAddClick} size="sm" className="gap-2">
      <Plus className="h-4 w-4" />
      {label}
    </Button>
  );
}
