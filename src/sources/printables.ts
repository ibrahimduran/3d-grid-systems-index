import { z } from "zod";
import { Source } from "../index.js";

const printablesSearchResponseSchema = z.object({
  data: z.object({
    result: z.object({
      totalCount: z.number(),
    }),
  }),
});

export const printables: Source = {
  name: "printables",

  link: (search: string) =>
    `https://www.printables.com/search?q=${encodeURIComponent(search)}`,

  count: async (_, search) => {
    const response = await fetch("https://api.printables.com/graphql/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        operationName: "SearchCategoriesTotals",
        query: `
        query SearchCategoriesTotals($query: String!, $paid: PaidEnum) {
          result: searchPrints2(query: $query, paid: $paid) {
            categories {
              id
              totalCount
              __typename
            }
            totalCount
            __typename
          }
        }
      `,
        variables: { paid: "all", query: search },
      }),
    });

    const json = await response.json();
    const parsed = printablesSearchResponseSchema.parse(json);
    return parsed.data.result.totalCount;
  },
};
