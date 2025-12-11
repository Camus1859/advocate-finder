"use client";

import { ChangeEvent, useEffect, useState, useMemo } from "react";
import Fuse from "fuse.js";
import { Advocate } from "@/types";
import AdvocatesTable from "./AdvocatesTable";
import Pagination from "./Pagination";

export default function ClientPaginationSection() {
  const [advocates, setAdvocates] = useState<Advocate[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const itemsPerPage = 4;

  useEffect(() => {
    const getData = async () => {
      try {
        const res = await fetch("/api/advocates");
        if (!res.ok) throw new Error(res.statusText);

        const json = await res.json();
        setAdvocates(json.data);
      } catch (err) {
        console.error(err);
        setError("Unable to load advocates. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    getData();
  }, []);

  const fuse = useMemo(() => {
    const options = {
      keys: [
        "firstName",
        "lastName",
        "city",
        "degree",
        "specialties",
        "yearsOfExperience",
      ],
      threshold: 0.4,
      distance: 100,
    };
    return new Fuse(advocates, options);
  }, [advocates]);

  const filteredAdvocates = useMemo(() => {
    const term = searchTerm.trim();
    if (!term) return advocates;

    const results = fuse.search(term);
    return results.map((result) => result.item);
  }, [searchTerm, fuse, advocates]);

  const totalPages = Math.ceil(filteredAdvocates.length / itemsPerPage);
  const startIndex = currentPage * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const visibleAdvocates = filteredAdvocates.slice(startIndex, endIndex);

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(0);
  };

  const onClick = () => {
    setSearchTerm("");
    setCurrentPage(0);
  };

  if (loading) {
    return (
      <div
        className="flex justify-center py-10"
        role="status"
        aria-live="polite"
      >
        <span
          className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-blue-600"
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
      <section aria-labelledby="search-heading">
        <h2 id="search-heading" className="sr-only">
          Search Advocates
        </h2>

        <div className="flex flex-col sm:flex-row sm:items-end gap-2 sm:gap-4">
          <div className="flex flex-col">
            <label className="text-sm font-medium" htmlFor="client-search">
              Search advocates
            </label>
            <input
              id="client-search"
              className="border border-gray-400 rounded px-2 py-1 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none"
              value={searchTerm}
              onChange={onChange}
              placeholder="Type a name, city, specialty, etc."
              aria-describedby="search-instructions search-results-summary"
              role="searchbox"
              aria-autocomplete="list"
            />

            <div id="search-instructions" className="sr-only">
              Search for healthcare advocates by name, city, specialty, degree,
              or years of experience. Results will update as you type.
            </div>

            <span className="text-xs text-gray-500 mt-1" aria-live="polite">
              {searchTerm && <>Searching for &quot;{searchTerm}&quot;</>}
            </span>
          </div>

          <button
            onClick={onClick}
            className="text-blue-600 underline text-sm hover:bg-blue-50 focus:ring-2 focus:ring-blue-500 focus:outline-none rounded px-2 py-1"
            aria-label="Clear search and reset results"
          >
            Reset
          </button>
        </div>
      </section>

      <br />

      <div id="search-results-summary" aria-live="polite" aria-atomic="true">
        {filteredAdvocates.length} advocates found
      </div>

      <br />

      <section aria-labelledby="results-heading">
        <h2 id="results-heading" className="sr-only">
          Search Results
        </h2>

        <AdvocatesTable
          advocates={visibleAdvocates}
          searchTerm={searchTerm}
        />
      </section>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={filteredAdvocates.length}
        itemsPerPage={itemsPerPage}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}
