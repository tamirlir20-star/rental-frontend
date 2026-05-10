export const formatPrice = (p: number | null | undefined): string =>
  p != null ? `₪${p.toLocaleString("he-IL")}` : "מחיר לא צוין";

export const formatRooms = (r: number | null | undefined): string | null => {
  if (r == null) return null;
  if (r === 0.5) return "סטודיו";
  return `${r} חדרים`;
};

export const formatSize = (s: number | null | undefined): string | null =>
  s != null ? `${s} מ"ר` : null;

export const formatFloor = (floor: number | null | undefined, total: number | null | undefined): string | null => {
  if (floor == null) return null;
  if (floor === 0) return total ? `קרקע מתוך ${total}` : "קרקע";
  return total ? `קומה ${floor} מתוך ${total}` : `קומה ${floor}`;
};

export const formatAge = (dateStr: string | null | undefined): string => {
  if (!dateStr) return "";
  const diff = Date.now() - new Date(dateStr).getTime();
  const hours = Math.floor(diff / 3_600_000);
  if (hours < 1) return "לפני פחות משעה";
  if (hours < 24) return `לפני ${hours} שעות`;
  const days = Math.floor(hours / 24);
  if (days === 1) return "אתמול";
  if (days < 30) return `לפני ${days} ימים`;
  const months = Math.floor(days / 30);
  return `לפני ${months} חודשים`;
};

export const ROOM_OPTIONS: { value: number; label: string }[] = [
  { value: 0.5, label: "סטודיו" },
  { value: 1, label: "1" },
  { value: 1.5, label: "1.5" },
  { value: 2, label: "2" },
  { value: 2.5, label: "2.5" },
  { value: 3, label: "3" },
  { value: 3.5, label: "3.5" },
  { value: 4, label: "4+" },
];
