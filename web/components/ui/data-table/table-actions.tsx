import {
  Plus,
  Edit,
  Trash2,
  FileSpreadsheet,
  Loader2,
  Eye,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface ActionButtonProps {
  onClick: () => void;
  disabled?: boolean;
  loading?: boolean;
  className?: string;
}

const AddButton = ({
  onClick,
  disabled = false,
  loading = false,
}: ActionButtonProps) => (
  <Button onClick={onClick} disabled={disabled || loading}>
    {loading ? (
      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
    ) : (
      <Plus className="mr-2 h-4 w-4" />
    )}
    Add New
  </Button>
);

const EditButton = ({
  onClick,
  disabled = false,
  loading = false,
}: ActionButtonProps) => (
  <Button
    variant="outline"
    size="icon"
    onClick={onClick}
    disabled={disabled || loading}
    title="Edit"
  >
    {loading ? (
      <Loader2 className="h-4 w-4 animate-spin" />
    ) : (
      <Edit className="h-4 w-4" />
    )}
  </Button>
);

const DeleteButton = ({
  onClick,
  disabled = false,
  loading = false,
}: ActionButtonProps) => (
  <Button
    variant="outline"
    size="icon"
    onClick={onClick}
    disabled={disabled || loading}
    title="Delete"
    className="text-destructive"
  >
    <Trash2 className="h-4 w-4" />
  </Button>
);

const ExportButton = ({
  onClick,
  disabled = false,
  loading = false,
}: ActionButtonProps) => (
  <Button variant="outline" onClick={onClick} disabled={disabled || loading}>
    {loading ? (
      <>
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        Exporting...
      </>
    ) : (
      <>
        <FileSpreadsheet className="mr-2 h-4 w-4" />
        Export
      </>
    )}
  </Button>
);

const RowActions = ({
  onEdit,
  onDelete,
  onView,
  isDeleting = false,
}: {
  onEdit?: () => void;
  onDelete?: () => void;
  onView?: () => void;
  isDeleting?: boolean;
}) => (
  <div className="flex justify-end gap-2">
    {onEdit && <EditButton onClick={onEdit} />}
    {onView && (
      <Button variant="outline" size="icon" onClick={onView}>
        <Eye className="h-4 w-4" />
      </Button>
    )}
    {onDelete && <DeleteButton onClick={onDelete} loading={isDeleting} />}
  </div>
);

const TableActions = {
  AddButton,
  EditButton,
  DeleteButton,
  ExportButton,
  RowActions,
};

export default TableActions;
