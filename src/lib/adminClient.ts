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
