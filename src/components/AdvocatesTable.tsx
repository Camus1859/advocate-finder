import { Advocate } from "@/types";

interface AdvocatesTableProps {
  advocates: Advocate[];
  searchTerm?: string;
}

export default function AdvocatesTable({
  advocates,
  searchTerm = "",
}: AdvocatesTableProps) {
  return (
    <div className="overflow-x-auto">
      <table
        className="text-sm w-full"
        role="table"
        aria-label="Healthcare advocates search results"
      >
        <thead className="bg-gray-100">
          <tr role="row">
            <th
              className="px-3 py-2 text-left text-sm font-medium uppercase"
              scope="col"
            >
              First Name
            </th>
            <th
              className="px-3 py-2 text-left text-sm font-medium uppercase"
              scope="col"
            >
              Last Name
            </th>
            <th
              className="px-3 py-2 text-left text-sm font-medium uppercase"
              scope="col"
            >
              City
            </th>
            <th
              className="px-3 py-2 text-left text-sm font-medium uppercase"
              scope="col"
            >
              Degree
            </th>
            <th
              className="px-3 py-2 text-left text-sm font-medium uppercase"
              scope="col"
            >
              Specialties
            </th>
            <th
              className="px-3 py-2 text-left text-sm font-medium uppercase"
              scope="col"
            >
              Years of Experience
            </th>
            <th
              className="px-3 py-2 text-left text-sm font-medium uppercase"
              scope="col"
            >
              Phone Number
            </th>
          </tr>
        </thead>
        <tbody>
          {advocates.length === 0 ? (
            <tr role="row">
              <td
                colSpan={7}
                className="py-4 text-gray-600 text-center"
                role="cell"
              >
                {searchTerm
                  ? `No advocates match "${searchTerm}".`
                  : "No advocates available."}
              </td>
            </tr>
          ) : (
            advocates.map((advocate) => (
              <tr
                key={advocate.id || `${advocate.firstName}-${advocate.lastName}`}
                className="odd:bg-white even:bg-gray-50 hover:bg-blue-50 focus-within:bg-blue-50"
                role="row"
              >
                <td className="px-3 py-1" role="cell">
                  {advocate.firstName}
                </td>
                <td className="px-3 py-1" role="cell">
                  {advocate.lastName}
                </td>
                <td className="px-3 py-1" role="cell">
                  {advocate.city}
                </td>
                <td className="px-3 py-1" role="cell">
                  {advocate.degree}
                </td>
                <td className="px-3 py-1" role="cell">
                  <div className="max-h-20 overflow-y-auto space-x-1">
                    {advocate.specialties.map((specialty, i) => (
                      <span
                        key={`${specialty}-${i}`}
                        className="bg-gray-200 text-gray-800 text-xs px-2 rounded mb-1 inline-block"
                      >
                        {specialty}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="px-3 py-1" role="cell">
                  <span
                    aria-label={`${advocate.yearsOfExperience} years of experience`}
                  >
                    {advocate.yearsOfExperience}
                  </span>
                </td>
                <td className="px-3 py-1" role="cell">
                  <a
                    href={`tel:${advocate.phoneNumber}`}
                    className="text-blue-600 hover:underline focus:ring-2 focus:ring-blue-500 focus:outline-none rounded"
                    aria-label={`Call ${advocate.firstName} ${advocate.lastName} at ${advocate.phoneNumber}`}
                  >
                    {advocate.phoneNumber}
                  </a>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
