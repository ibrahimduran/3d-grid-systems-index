import { launch } from "cloakbrowser";
import { readFile, writeFile } from "node:fs/promises";
import { BrowserContext } from "playwright";
import z from "zod";

export interface Context {
  browser: BrowserContext;
  cleanup: () => Promise<void>;
}

export interface Source {
  name: string;
  link: (query: string) => string;
  count: (ctx: Context, query: string) => Promise<number>;
}

export type ResultType = z.infer<typeof resultSchema>;
export const resultSchema = z.object({
  source: z.string(),
  query: z.string(),
  count: z.number(),
});

export const writeResults = async (data: unknown, path: string) => {
  const results = z.array(resultSchema).parse(data);

  const sorted = results.sort((a, b) => {
    if (a.query === b.query) {
      return a.source.localeCompare(b.source);
    }
    return a.query.localeCompare(b.query);
  });

  await writeFile(path, JSON.stringify(sorted, null, 2), "utf-8");
};

export const readResults = async (path: string) => {
  const fileContent = await readFile(path, "utf-8");
  const data = JSON.parse(fileContent);
  return z.array(resultSchema).parse(data);
};

export const createContext = async (): Promise<Context> => {
  const browser = await launch({
    headless: false,
  });

  const browserContext = await browser.newContext();

  const cleanup = async () => {
    await browserContext.close();
    await browser.close();
  };

  return { browser: browserContext, cleanup };
};
