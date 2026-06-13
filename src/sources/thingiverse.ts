import { z } from "zod";
import { launch } from "cloakbrowser";
import { Source } from "../index.js";

const thingiverseSearchResponseSchema = z.object({
  total: z.number(),
});

export const thingiverse: Source = {
  name: "thingiverse",

  link: (search: string) =>
    `https://www.thingiverse.com/search?q=${encodeURIComponent(search)}`,

  count: async ({ browser }, search) => {
    const page = await browser.newPage();

    await page.goto(`https://www.thingiverse.com`, {
      waitUntil: "domcontentloaded",
    });

    await page.fill("#page-header__search-input", `${search}`);
    await page.press("#page-header__search-input", "Enter");

    const response = await page.waitForResponse(async (res) => {
      const req = res.request();
      const url = req.url();

      if (req.method() !== "GET") {
        return false;
      }

      if (!url.includes("/api/v2/search/things")) {
        return false;
      }

      if (!url.includes(`term=${encodeURIComponent(search)}`)) {
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
    const parsed = thingiverseSearchResponseSchema.parse(json);
    await page.close();
    return parsed.total;
  },
};
