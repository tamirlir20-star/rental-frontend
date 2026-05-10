import { useFilterStore } from "../../store/filterStore";

interface Props {
  isError?: boolean;
}

export default function EmptyState({ isError }: Props) {
  const { reset } = useFilterStore();

  if (isError) {
    return (
      <div className="col-span-full flex flex-col items-center justify-center py-20 text-center">
        <div className="text-5xl mb-4">🔌</div>
        <h3 className="text-lg font-bold text-gray-800 mb-2">לא ניתן להתחבר לשרת המקומי</h3>
        <p className="text-gray-500 text-sm mb-1">האם הפעלת את שרת Python?</p>
        <code className="text-xs bg-gray-100 px-3 py-1.5 rounded-lg text-gray-600 font-mono">
          uvicorn api.main:app --reload --port 8000
        </code>
      </div>
    );
  }

  return (
    <div className="col-span-full flex flex-col items-center justify-center py-20 text-center">
      <div className="text-5xl mb-4">🏠</div>
      <h3 className="text-lg font-bold text-gray-800 mb-2">לא נמצאו מודעות עם הפילטרים שבחרת</h3>
      <p className="text-gray-500 text-sm mb-4">נסה להרחיב את טווח החיפוש</p>
      <button
        onClick={reset}
        className="bg-amber-400 hover:bg-amber-500 text-white font-semibold px-5 py-2 rounded-lg transition-colors text-sm"
      >
        נקה פילטרים
      </button>
    </div>
  );
}
