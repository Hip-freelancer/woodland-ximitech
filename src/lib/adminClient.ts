export async function readAdminApiError(
  response: Response,
  fallbackMessage: string
) {
  const data = await response.json().catch(() => null);
  return data?.error ?? fallbackMessage;
}

export async function uploadAdminImage(file: File) {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch("/api/upload", {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error(await readAdminApiError(response, "Không thể tải ảnh lên."));
  }

  const data = (await response.json()) as { url?: string };

  if (!data.url) {
    throw new Error("Máy chủ không trả về đường dẫn ảnh.");
  }

  return data.url;
}

export async function uploadAdminHeroVideo(file: File, previousUrl = "") {
  const formData = new FormData();
  formData.append("file", file);

  if (previousUrl) {
    formData.append("previousUrl", previousUrl);
  }

  const response = await fetch("/api/admin/home-media", {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error(
      await readAdminApiError(response, "Không thể tải video hero lên.")
    );
  }

  const data = (await response.json()) as { url?: string };

  if (!data.url) {
    throw new Error("Máy chủ không trả về đường dẫn video hero.");
  }

  return data.url;
}

export async function deleteAdminHeroVideo(url: string) {
  const response = await fetch("/api/admin/home-media", {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ url }),
  });

  if (!response.ok) {
    throw new Error(
      await readAdminApiError(response, "Không thể xóa video hero tạm thời.")
    );
  }
}

export interface AdminBackupDataSet {
  categories: Record<string, unknown>[];
  contacts: Record<string, unknown>[];
  "home-settings": Record<string, unknown>[];
  news: Record<string, unknown>[];
  products: Record<string, unknown>[];
  projects: Record<string, unknown>[];
  team: Record<string, unknown>[];
}

export interface AdminBackupPayload {
  data: AdminBackupDataSet;
  exportedAt: string;
  version: number;
}

export async function exportAdminBackup() {
  const response = await fetch("/api/admin/backup");

  if (!response.ok) {
    throw new Error(
      await readAdminApiError(response, "Không thể xuất dữ liệu backup.")
    );
  }

  return (await response.json()) as AdminBackupPayload;
}

export async function importAdminBackupData(backup: AdminBackupPayload) {
  const response = await fetch("/api/admin/backup", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(backup),
  });

  if (!response.ok) {
    throw new Error(
      await readAdminApiError(response, "Không thể nhập dữ liệu backup.")
    );
  }
}

interface AutoSeoAdminInput {
  module: string;
  payload: Record<string, unknown>;
}

interface AutoSeoAdminResult {
  seo?: {
    vi?: { title?: string; description?: string; keywords?: string[] };
    en?: { title?: string; description?: string; keywords?: string[] };
  };
  excerpt?: {
    vi?: string;
    en?: string;
  };
}

interface TranslateAdminContentInput {
  content: string;
  fieldLabel: string;
  preserveHtml?: boolean;
  sourceLanguage?: string;
  targetLanguage?: string;
}

export async function generateAdminSeo({ module, payload }: AutoSeoAdminInput) {
  const response = await fetch("/api/admin/ai/seo", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ module, payload }),
  });

  if (!response.ok) {
    throw new Error(await readAdminApiError(response, "Không thể tạo SEO tự động."));
  }

  return (await response.json()) as AutoSeoAdminResult;
}

export async function translateAdminContent({
  content,
  fieldLabel,
  preserveHtml = false,
  sourceLanguage = "vi",
  targetLanguage = "en",
}: TranslateAdminContentInput) {
  const response = await fetch("/api/admin/ai/translate", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      content,
      fieldLabel,
      preserveHtml,
      sourceLanguage,
      targetLanguage,
    }),
  });

  if (!response.ok) {
    throw new Error(await readAdminApiError(response, "Không thể dịch nội dung."));
  }

  const data = (await response.json()) as { translation?: string };

  if (!data.translation) {
    throw new Error("Không nhận được nội dung dịch từ AI.");
  }

  return data.translation;
}

export function formatAdminDate(value?: string | Date) {
  if (!value) {
    return "—";
  }

  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(value));
}
