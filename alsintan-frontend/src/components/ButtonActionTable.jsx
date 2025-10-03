import { Eye, Pencil, Trash } from "lucide-react";

function ButtonActionTable({
  isView = false,
  isEdit = false,
  isRemove = false,
  onView = () => {},
  onEdit = () => {},
  onRemove = () => {},
}) {
  return (
    <div className="flex justify-start space-x-2">
      {isView && (
        <button
          className="p-1 rounded hover:bg-blue-100 text-blue-500 hover:text-blue-700 cursor-pointer"
          title="View"
          onClick={onView}
        >
          <Eye size={18} />
        </button>
      )}
      {isEdit && (
        <button
          className="p-1 rounded hover:bg-yellow-100 text-yellow-500 hover:text-yellow-700 cursor-pointer"
          title="Edit"
          onClick={onEdit}
        >
          <Pencil size={18} />
        </button>
      )}
      {isRemove && (
        <button
          className="p-1 rounded hover:bg-red-100 text-red-500 hover:text-red-700 cursor-pointer"
          title="Delete"
          onClick={onRemove}
        >
          <Trash size={18} />
        </button>
      )}
    </div>
  );
}

export default ButtonActionTable;
