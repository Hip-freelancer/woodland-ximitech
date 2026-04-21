"use client";

import React, { useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import "react-quill-new/dist/quill.snow.css";
import ReactQuill from "react-quill-new";
import AdminNotice from "@/components/admin/AdminNotice";

const QuillNoSSRWrapper = dynamic(
  async () => {
    const { default: RQ } = await import("react-quill-new");
    type QuillWrapperProps = React.ComponentProps<typeof ReactQuill> & {
      forwardedRef: React.Ref<ReactQuill>;
    };

    return function QuillWrapper({
      forwardedRef,
      ...props
    }: QuillWrapperProps) {
      return <RQ ref={forwardedRef} {...props} />;
    };
  },
  {
    ssr: false,
    loading: () => <p>Đang tải trình soạn thảo...</p>,
  }
);

interface RichEditorProps {
  value: string;
  onChange: (content: string) => void;
  placeholder?: string;
}

export default function RichEditor({ value, onChange, placeholder }: RichEditorProps) {
  const quillRef = useRef<ReactQuill>(null);
  const [uploadError, setUploadError] = useState("");

  const imageHandler = () => {
    setUploadError("");
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");
    input.click();

    input.onchange = async () => {
      const file = input.files ? input.files[0] : null;
      if (!file) return;

      const formData = new FormData();
      formData.append("file", file);

      try {
        const response = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          throw new Error("Tải ảnh thất bại!");
        }

        const data = await response.json();
        const url = data.url;

        // Insert into editor
        const quill = quillRef.current?.getEditor();
        if (quill) {
          const range = quill.getSelection(true);
          quill.insertEmbed(range.index, "image", url);
        }
      } catch (error) {
        console.error("Upload error:", error);
        setUploadError("Lỗi tải ảnh lên. Vui lòng kiểm tra cấu hình R2 hoặc kết nối mạng.");
      }
    };
  };

  const modules = useMemo(
    () => ({
      toolbar: {
        container: [
          [{ header: [1, 2, 3, 4, 5, 6, false] }],
          ["bold", "italic", "underline", "strike"],
          [{ list: "ordered" }, { list: "bullet" }],
          [{ color: [] }, { background: [] }],
          ["link", "image", "video"],
          ["clean"],
        ],
        handlers: {
          image: imageHandler,
        },
      },
    }),
    []
  );

  return (
    <div className="bg-white">
      {uploadError ? (
        <div className="mb-4">
          <AdminNotice message={uploadError} tone="error" />
        </div>
      ) : null}

      <QuillNoSSRWrapper
        forwardedRef={quillRef}
        theme="snow"
        value={value}
        onChange={onChange}
        modules={modules}
        placeholder={placeholder || "Bắt đầu soạn thảo..."}
        className="h-64 mb-12"
      />
    </div>
  );
}
