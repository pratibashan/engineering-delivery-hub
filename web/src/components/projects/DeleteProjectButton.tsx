"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { deleteProject } from "@/lib/projects";

type DeleteProjectButtonProps = {
  id: string;
};

export default function DeleteProjectButton({ id }: DeleteProjectButtonProps) {
  const router = useRouter();

  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isConfirmOpen) {
      return;
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape" && !isDeleting) {
        setIsConfirmOpen(false);
      }
    }

    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isConfirmOpen, isDeleting]);

  function openConfirmation() {
    setError("");
    setIsConfirmOpen(true);
  }

  function closeConfirmation() {
    if (isDeleting) {
      return;
    }

    setError("");
    setIsConfirmOpen(false);
  }

  async function handleDelete() {
    setError("");
    setIsDeleting(true);

    try {
      await deleteProject(id);

      setIsConfirmOpen(false);

      router.push("/dashboard");
      router.refresh();
    } catch (error) {
      console.error(error);
      setError("Unable to delete project. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={openConfirmation}
        className="rounded-lg border border-red-500/40 px-4 py-2 text-sm font-semibold text-red-300 transition hover:bg-red-500/10"
      >
        Delete project
      </button>

      {isConfirmOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 py-6"
          onClick={closeConfirmation}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-project-title"
            aria-describedby="delete-project-description"
            className="w-full max-w-md rounded-xl border border-slate-700 bg-slate-900 p-6 shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <h2
              id="delete-project-title"
              className="text-xl font-semibold text-white"
            >
              Delete project?
            </h2>

            <p
              id="delete-project-description"
              className="mt-3 text-sm leading-6 text-slate-400"
            >
              Are you sure you want to delete this project? This action cannot
              be undone.
            </p>

            {error && (
              <p
                role="alert"
                className="mt-4 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300"
              >
                {error}
              </p>
            )}

            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={closeConfirmation}
                disabled={isDeleting}
                autoFocus
                className="rounded-lg border border-slate-700 px-4 py-2.5 text-sm font-semibold text-slate-200 transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleDelete}
                disabled={isDeleting}
                className="rounded-lg bg-red-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-400 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isDeleting ? "Deleting..." : "Delete project"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
