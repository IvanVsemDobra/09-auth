"use client";
import css from "@/app/page.module.css";
import NoteList from "@/components/NoteList/NoteList";
import Pagination from "@/components/Pagination/Pagination";
import SearchBox from "@/components/SearchBox/SearchBox";
import { fetchNotes } from "@/lib/api/clientApi";

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useDebounce } from "@/components/hooks/UseDebounce";

interface FilterPageClientProps {
  category?: string | undefined;
}

export default function FilterPageClient({ category }: FilterPageClientProps) {
  const [query, setQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const { data, isError, isSuccess } = useQuery({
    queryKey: ["note", query, currentPage, category],
    queryFn: () => fetchNotes(query, currentPage, category),
    placeholderData: keepPreviousData,
    refetchOnMount: false,
  });
  useEffect(() => {
    if (isError) {
      toast("Sorry, something went wrong, please try again");
    }
  }, [isError]);
  const changeQuery = useDebounce((query: string) => {
    setQuery(query);
    setCurrentPage(1);
  }, 1000);
  return (
    <>
      <div className={css.app}>
        <header className={css.toolbar}>
          {<SearchBox onChange={changeQuery} />}
          {isSuccess && data.totalPages > 1 && (
            <Pagination
              totalPages={data.totalPages}
              onPageChange={({ selected }) => setCurrentPage(selected + 1)}
              forcePage={currentPage - 1}
            />
          )}
          {
            <Link href={"/notes/action/create"} className={css.button}>
              Create note +
            </Link>
          }
        </header>

        <Toaster position="top-right" reverseOrder={false} />
        {isSuccess && data.notes.length > 0 && <NoteList notes={data.notes} />}
      </div>
    </>
  );
}