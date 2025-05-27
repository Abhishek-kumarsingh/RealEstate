"use client";

import { Inter } from "next/font/google";
import { Button } from "@/components/ui/button";

const inter = Inter({ subsets: ["latin"] });

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="flex flex-col items-center justify-center min-h-screen px-4">
          <h2 className="text-3xl font-bold mb-4">Something went wrong!</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6 text-center">
            We apologize for the inconvenience. A critical error has occurred.
          </p>
          <Button onClick={() => reset()} className="px-6 py-2">
            Try again
          </Button>
        </div>
      </body>
    </html>
  );
}
