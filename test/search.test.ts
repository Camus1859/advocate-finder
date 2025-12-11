const { mockAdvocates } = require("../mockData");
const Fuse = require("fuse.js");
import type { FuseResult } from "fuse.js";
import { Advocate } from "../src/types";
describe("Search Logic Edge Cases", () => {
  const searchAdvocates = (
    advocates: Advocate[],
    searchTerm: string
  ): Advocate[] => {
    const term = searchTerm.trim();
    if (!term) return advocates;

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

    const fuse = new Fuse(advocates, options);
    const results = fuse.search(term);
    return results.map((result: FuseResult<Advocate>) => result.item);
  };

  test("handles empty string search", () => {
    const results = searchAdvocates(mockAdvocates, "");
    expect(results).toHaveLength(mockAdvocates.length);
  });

  test("handles special characters in names", () => {
    const results = searchAdvocates(mockAdvocates, "o'connor");
    expect(results).toHaveLength(1);
    expect(results[0].lastName).toBe("O'Connor");
  });

  test("handles case insensitive search", () => {
    const results = searchAdvocates(mockAdvocates, "JOHN");
    expect(results).toHaveLength(1);
    expect(results[0].firstName).toBe("John");
  });

  test("returns empty array for no matches", () => {
    const results = searchAdvocates(mockAdvocates, "xyz123");
    expect(results).toHaveLength(0);
  });

  test("searches by specialty and finds match", () => {
    const results = searchAdvocates(mockAdvocates, "criminal");
    expect(results).toHaveLength(1);
    expect(results[0].specialties).toContain("Criminal Law");
  });

  test("searches by location and finds match", () => {
    const results = searchAdvocates(mockAdvocates, "miami");
    expect(results).toHaveLength(2);
    expect(results[0].city).toBe("Miami");
  });

  test("searches by degree and finds match", () => {
    const results = searchAdvocates(mockAdvocates, "JD");
    expect(results).toHaveLength(2);
    expect(results.every((r) => r.degree === "JD")).toBe(true);
  });

  test("searches across multiple fields with same term", () => {
    const results = searchAdvocates(mockAdvocates, "law");
    expect(results).toHaveLength(3);
  });

  test("searches by years of experience", () => {
    const results = searchAdvocates(mockAdvocates, "10");
    expect(results).toHaveLength(1);
    expect(results[0].yearsOfExperience).toBe(10);
  });

  test("partial match in multiple fields", () => {
    const results = searchAdvocates(mockAdvocates, "jo");
    expect(results).toHaveLength(2);
    const names = results.map((r) => r.firstName);
    expect(names).toContain("John");
    expect(names).toContain("José");
  });
});
