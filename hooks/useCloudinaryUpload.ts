// hooks/useCloudinaryUpload.ts
import { useState } from "react";

interface UploadResponse {
  url: string;
  public_id: string;
}

export function useCloudinaryUpload() {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const uploadImage = async (file: File): Promise<UploadResponse | null> => {
    setUploading(true);
    setError(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Upload failed");
      }

      return {
        url: data.url,
        public_id: data.public_id,
      };
    } catch (err: any) {
      setError(err.message || "Upload failed");
      return null;
    } finally {
      setUploading(false);
    }
  };

  return {
    uploadImage,
    uploading,
    error,
  };
}
