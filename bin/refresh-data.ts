#!/usr/bin/env -S yarn tsx

import {
  createContext,
  ResultType,
  sources,
  writeResults,
} from "../src/index.js";

const queries = ["multiboard", "opengrid", "gridfinity", "skadis"];
const results: ResultType[] = [];

const context = await createContext();

await Promise.all(
  sources.map(async (source) => {
    for (const query of queries) {
      console.log(`executing with query:"${query}" source:"${source.name}"`);

      const count = await source.count(context, query);

      console.log(
        `found ${count} results with query:"${query}" source:"${source.name}"`,
      );

      results.push({
        query,
        source: source.name,
        count,
      });
    }
  }),
);

await writeResults(results, "data/data.json");
await context.cleanup();
