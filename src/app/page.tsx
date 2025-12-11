"use client";

import ClientPaginationSection from "@/components/ClientPaginationSection";
import ServerPaginationSection from "@/components/ServerPaginationSection";

export default function Home() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-3xl font-bold mb-2">Advocate Finder</h1>
      <p className="text-gray-600 mb-10">
        Compare two pagination approaches: Client-side vs Server-side
      </p>

      <section className="mb-16 border-2 border-blue-300 rounded-lg p-6 bg-blue-50">
        <div className="mb-4">
          <h2 className="text-2xl font-semibold text-blue-900 mb-2">
            Client-Side Pagination (Front-End)
          </h2>
          <div className="text-sm text-blue-800 bg-blue-100 p-4 rounded">
            <p className="font-semibold mb-2">How it works:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Step 1:</strong> Fetch ALL advocate data from server in
                one request
              </li>
              <li>
                <strong>Step 2:</strong> Store all data in React state
              </li>
              <li>
                <strong>Step 3:</strong> Filter data in browser using Fuse.js
                (fuzzy search)
              </li>
              <li>
                <strong>Step 4:</strong> Slice the filtered array to show only
                current page items
              </li>
              <li>
                <strong>Step 5:</strong> Page changes happen instantly (no
                server calls)
              </li>
            </ul>
            <p className="mt-3 font-semibold">Benefits:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Instant page navigation (no loading delays)</li>
              <li>Advanced fuzzy search with Fuse.js</li>
              <li>Works offline after initial load</li>
            </ul>
            <p className="mt-3 font-semibold">Drawbacks:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Large initial data transfer</li>
              <li>Not suitable for very large datasets (10,000+ items)</li>
              <li>Higher memory usage in browser</li>
            </ul>
          </div>
        </div>

        <ClientPaginationSection />
      </section>

      <section className="mb-16 border-2 border-green-300 rounded-lg p-6 bg-green-50">
        <div className="mb-4">
          <h2 className="text-2xl font-semibold text-green-900 mb-2">
            Server-Side Pagination (Back-End)
          </h2>
          <div className="text-sm text-green-800 bg-green-100 p-4 rounded">
            <p className="font-semibold mb-2">How it works:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Step 1:</strong> Send request with page number and
                search term to server
              </li>
              <li>
                <strong>Step 2:</strong> Server filters data based on search
                term
              </li>
              <li>
                <strong>Step 3:</strong> Server calculates which items belong
                to requested page
              </li>
              <li>
                <strong>Step 4:</strong> Server returns ONLY that page&apos;s
                data + metadata (total count, total pages)
              </li>
              <li>
                <strong>Step 5:</strong> Client displays received data and
                shows pagination controls
              </li>
              <li>
                <strong>Step 6:</strong> Each page change triggers a new server
                request
              </li>
            </ul>
            <p className="mt-3 font-semibold">Benefits:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Minimal data transfer per request</li>
              <li>Scales to millions of records</li>
              <li>Lower browser memory usage</li>
              <li>Can leverage database indexes for fast queries</li>
            </ul>
            <p className="mt-3 font-semibold">Drawbacks:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Network delay on each page change</li>
              <li>Requires server round-trip for every interaction</li>
              <li>More complex implementation</li>
            </ul>
          </div>
        </div>

        <ServerPaginationSection />
      </section>

      <section className="bg-gray-100 p-6 rounded-lg">
        <h2 className="text-2xl font-semibold mb-4">
          Implementation Guide Summary
        </h2>

        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-semibold text-blue-900 mb-2">
              Client-Side Pagination Steps:
            </h3>
            <ol className="list-decimal list-inside space-y-2 text-sm">
              <li>
                Fetch all data once using <code>useEffect</code> hook on mount
              </li>
              <li>
                Store complete dataset in state:{" "}
                <code>const [data, setData] = useState([])</code>
              </li>
              <li>
                Track current page: <code>const [page, setPage] = useState(0)</code>
              </li>
              <li>
                Calculate slice indices:{" "}
                <code>start = page * itemsPerPage</code>,{" "}
                <code>end = start + itemsPerPage</code>
              </li>
              <li>
                Render sliced data: <code>data.slice(start, end)</code>
              </li>
              <li>
                Update page state on button click (no re-fetch needed)
              </li>
            </ol>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-green-900 mb-2">
              Server-Side Pagination Steps:
            </h3>
            <ol className="list-decimal list-inside space-y-2 text-sm">
              <li>
                Track page in state: <code>const [page, setPage] = useState(0)</code>
              </li>
              <li>
                Create API endpoint that accepts query params:{" "}
                <code>?page=0&limit=10&search=term</code>
              </li>
              <li>
                In API: Filter data based on search, then calculate:{" "}
                <code>startIndex = page * limit</code>,{" "}
                <code>endIndex = startIndex + limit</code>
              </li>
              <li>
                Return paginated slice + metadata:{" "}
                <code>
                  {`{data: items, totalPages, totalItems, currentPage}`}
                </code>
              </li>
              <li>
                On client, use <code>useEffect([page, search])</code> to
                re-fetch when page/search changes
              </li>
              <li>Display returned data and use metadata for pagination UI</li>
            </ol>
          </div>

          <div className="bg-white p-4 rounded border-l-4 border-yellow-500">
            <h3 className="font-semibold mb-2">Key Difference:</h3>
            <p className="text-sm">
              <strong>Client-side:</strong> Pagination logic lives in the
              browser (JavaScript array slicing).
              <br />
              <strong>Server-side:</strong> Pagination logic lives on the server
              (API endpoint handles slicing and returns subset).
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
