import { z } from "zod";
import { launch } from "cloakbrowser";
import { Source } from "../index.js";

const thangsSearchResponseSchema = z.object({
  totalResults: z.number(),
});

export const thangs: Source = {
  name: "thangs",

  link: (search: string) =>
    `https://thangs.com/search/${encodeURIComponent(search)}`,

  count: async ({ browser }, search) => {
    const page = await browser.newPage();

    await page.goto(`https://thangs.com`);

    await page.fill("input[name=searchQuery]", `${search}`);
    await page.press("input[name=searchQuery]", "Enter");

    const response = await page.waitForResponse(async (res) => {
      const req = res.request();
      const url = req.url();

      if (req.method() !== "GET") {
        return false;
      }

      if (!url.includes("/api/search/v5/search-by-text")) {
        return false;
      }

      if (!url.includes(`searchTerm=${encodeURIComponent(search)}`)) {
        return false;
      }

      return true;
    });

    if (!response.ok()) {
      throw new Error(
        `Request failed with status ${response.status()}: ${await response.text()}`,
      );
    }

    const json = await response.json();
    const parsed = thangsSearchResponseSchema.parse(json);
    await page.close();
    return parsed.totalResults;
  },
};
