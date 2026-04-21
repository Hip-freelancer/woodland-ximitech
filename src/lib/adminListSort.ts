export type AdminListSortMode = "created-desc" | "priority-asc" | "priority-desc";

interface AdminPrioritySortable {
  createdAt?: string;
  priority?: number;
  updatedAt?: string;
}

function toTimestamp(value?: string) {
  if (!value) {
    return 0;
  }

  const timestamp = new Date(value).getTime();
  return Number.isNaN(timestamp) ? 0 : timestamp;
}

export function getNextPrioritySortMode(sortMode: AdminListSortMode) {
  return sortMode === "priority-asc" ? "priority-desc" : "priority-asc";
}

export function sortAdminList<T extends AdminPrioritySortable>(
  items: T[],
  sortMode: AdminListSortMode
) {
  return [...items].sort((left, right) => {
    const leftCreatedAt = toTimestamp(left.createdAt);
    const rightCreatedAt = toTimestamp(right.createdAt);
    const leftUpdatedAt = toTimestamp(left.updatedAt);
    const rightUpdatedAt = toTimestamp(right.updatedAt);

    if (sortMode === "priority-asc") {
      const priorityDelta = (left.priority ?? 0) - (right.priority ?? 0);
      return priorityDelta || rightCreatedAt - leftCreatedAt || rightUpdatedAt - leftUpdatedAt;
    }

    if (sortMode === "priority-desc") {
      const priorityDelta = (right.priority ?? 0) - (left.priority ?? 0);
      return priorityDelta || rightCreatedAt - leftCreatedAt || rightUpdatedAt - leftUpdatedAt;
    }

    return rightCreatedAt - leftCreatedAt || rightUpdatedAt - leftUpdatedAt;
  });
}
