#!/usr/bin/env -S yarn tsx

import { readFile, writeFile } from "node:fs/promises";
import { readResults, sources } from "../src/index.js";

const results = await readResults("data/data.json");
const readme = await readFile("README.md", "utf-8");

const dataset = results.reduce(
  (acc, cur) => {
    const byQuery = acc.byQuery[cur.query] ?? {
      total: 0,
      sources: {},
    };

    byQuery.total += cur.count;
    byQuery.sources[cur.source] = cur.count;

    acc.byQuery[cur.query] = byQuery;

    const bySource = acc.bySource[cur.source] ?? {
      total: 0,
    };

    bySource.total += cur.count;
    acc.bySource[cur.source] = bySource;

    return acc;
  },
  {
    byQuery: {} as Record<
      string,
      { total: number; sources: Record<string, number> }
    >,
    bySource: {} as Record<string, { total: number }>,
  },
);

const availableSources = Object.keys(dataset.bySource).sort(
  (a, b) => dataset.bySource[b]!.total - dataset.bySource[a]!.total,
);

const availableQueries = Object.keys(dataset.byQuery).sort(
  (a, b) => dataset.byQuery[b]!.total - dataset.byQuery[a]!.total,
);

const formatter = new Intl.NumberFormat("en-US");

const headerRow = `| Source | ${availableQueries.join(" | ")} |`;
const separatorRow = `| --- | ${availableQueries.map(() => "---").join(" | ")} |`;

const sourceRows = availableSources
  .map((sourceName) => {
    const source = sources.find((s) => s.name === sourceName);

    if (!source) {
      throw new Error(`Source ${sourceName} not found in sources.ts`);
    }

    const counts = availableQueries.map((query) => {
      const count = dataset.byQuery[query]?.sources[sourceName] ?? 0;
      const formatted = formatter.format(count);
      return `[${formatted}](${source.link(query)})`;
    });

    return `| ${sourceName} | ${counts.join(" | ")} |`;
  })
  .join("\n");

const totalRow = [
  "",
  "**Total**",
  ...availableQueries.map((query) => {
    const total = dataset.byQuery[query]?.total ?? 0;
    return `**${formatter.format(total)}**`;
  }),
  "",
]
  .join(" | ")
  .trim();

const newReadme = readme.replace(
  /<!-- BEGIN RESULTS -->(.|\n)*<!-- END RESULTS -->/,
  `<!-- BEGIN RESULTS -->
${headerRow}
${separatorRow}
${sourceRows}
${totalRow}
<!-- END RESULTS -->`,
);

await writeFile("README.md", newReadme, "utf-8");

console.log("README.md updated successfully.");
