"use client";

import { ChangeEvent, useEffect, useState } from "react";
import { Advocate } from "@/types";
import AdvocatesTable from "./AdvocatesTable";
import Pagination from "./Pagination";

interface PaginationMeta {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export default function ServerPaginationSection() {
  const [advocates, setAdvocates] = useState<Advocate[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [paginationMeta, setPaginationMeta] = useState<PaginationMeta>({
    currentPage: 0,
    totalPages: 0,
    totalItems: 0,
    itemsPerPage: 4,
    hasNextPage: false,
    hasPreviousPage: false,
  });

  const itemsPerPage = 4;

  useEffect(() => {
    const getData = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams({
          page: currentPage.toString(),
          limit: itemsPerPage.toString(),
        });

        if (searchTerm.trim()) {
          params.append("search", searchTerm.trim());
        }

        const res = await fetch(`/api/advocates/paginated?${params}`);
        if (!res.ok) throw new Error(res.statusText);

        const json = await res.json();
        setAdvocates(json.data);
        setPaginationMeta(json.pagination);
      } catch (err) {
        console.error(err);
        setError("Unable to load advocates. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    getData();
  }, [currentPage, searchTerm]);

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(0);
  };

  const onClick = () => {
    setSearchTerm("");
    setCurrentPage(0);
  };

  if (loading && advocates.length === 0) {
    return (
      <div
        className="flex justify-center py-10"
        role="status"
        aria-live="polite"
      >
        <span
          className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-green-600"
          aria-hidden="true"
        />
        <p className="ml-2">Loading advocates&hellip;</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-10" role="alert" aria-live="assertive">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div>
      <section aria-labelledby="server-search-heading">
        <h2 id="server-search-heading" className="sr-only">
          Search Advocates
        </h2>

        <div className="flex flex-col sm:flex-row sm:items-end gap-2 sm:gap-4">
          <div className="flex flex-col">
            <label className="text-sm font-medium" htmlFor="server-search">
              Search advocates
            </label>
            <input
              id="server-search"
              className="border border-gray-400 rounded px-2 py-1 focus:ring-2 focus:ring-green-500 focus:border-green-500 focus:outline-none"
              value={searchTerm}
              onChange={onChange}
              placeholder="Type a name, city, specialty, etc."
              aria-describedby="server-search-instructions server-search-results-summary"
              role="searchbox"
              aria-autocomplete="list"
            />

            <div id="server-search-instructions" className="sr-only">
              Search for healthcare advocates by name, city, specialty, degree,
              or years of experience. Results will update as you type.
            </div>

            <span className="text-xs text-gray-500 mt-1" aria-live="polite">
              {searchTerm && <>Searching for &quot;{searchTerm}&quot;</>}
            </span>
          </div>

          <button
            onClick={onClick}
            className="text-green-600 underline text-sm hover:bg-green-50 focus:ring-2 focus:ring-green-500 focus:outline-none rounded px-2 py-1"
            aria-label="Clear search and reset results"
          >
            Reset
          </button>
        </div>
      </section>

      <br />

      <div
        id="server-search-results-summary"
        aria-live="polite"
        aria-atomic="true"
        className="flex items-center gap-2"
      >
        {loading && (
          <span
            className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-green-600"
            aria-hidden="true"
          />
        )}
        {paginationMeta.totalItems} advocates found
      </div>

      <br />

      <section aria-labelledby="server-results-heading">
        <h2 id="server-results-heading" className="sr-only">
          Search Results
        </h2>

        <AdvocatesTable advocates={advocates} searchTerm={searchTerm} />
      </section>

      <Pagination
        currentPage={currentPage}
        totalPages={paginationMeta.totalPages}
        totalItems={paginationMeta.totalItems}
        itemsPerPage={itemsPerPage}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}
