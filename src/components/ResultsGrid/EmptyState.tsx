import { useFilterStore } from "../../store/filterStore";

interface Props {
  isError?: boolean;
}

export default function EmptyState({ isError }: Props) {
  const { reset } = useFilterStore();

  if (isError) {
    return (
      <div className="col-span-full flex flex-col items-center justify-center py-24 text-center">
        <div
          className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mb-5"
          style={{ background: "#fff3cd", border: "1px solid #fde68a" }}
        >
          🔌
        </div>
        <h3 className="text-lg font-bold mb-2" style={{ color: "#1c1917" }}>לא ניתן להתחבר לשרת המקומי</h3>
        <p className="text-sm mb-3" style={{ color: "#78716c" }}>האם הפעלת את שרת Python?</p>
        <code
          className="text-xs px-4 py-2 rounded-lg font-mono"
          style={{ background: "#f7f5f0", color: "#57534e", border: "1px solid #e8e4dc" }}
        >
          uvicorn api.main:app --reload --port 8000
        </code>
      </div>
    );
  }

  return (
    <div className="col-span-full flex flex-col items-center justify-center py-24 text-center">
      <div
        className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mb-5"
        style={{ background: "#f7f5f0", border: "1px solid #e8e4dc" }}
      >
        🏠
      </div>
      <h3 className="text-lg font-bold mb-2" style={{ color: "#1c1917" }}>לא נמצאו מודעות</h3>
      <p className="text-sm mb-6" style={{ color: "#78716c" }}>נסה להרחיב את טווח החיפוש</p>
      <button
        onClick={reset}
        className="px-6 py-2.5 rounded-xl text-sm font-bold transition-all"
        style={{ background: "#0f172a", color: "#fff" }}
      >
        נקה פילטרים
      </button>
    </div>
  );
}
