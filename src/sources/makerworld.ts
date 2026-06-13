import { z } from "zod";
import { launch } from "cloakbrowser";
import { Source } from "../lib.js";

const makerworldSearchResponseSchema = z.object({
  pageProps: z.object({
    total: z.number(),
  }),
});

export const makerworld: Source = {
  name: "makerworld",

  link: (search: string) =>
    `https://makerworld.com/en/search/models?keyword=${encodeURIComponent(search)}`,

  count: async ({ browser }, search) => {
    const page = await browser.newPage();

    await page.goto(
      `https://makerworld.com/en/search/models?keyword=${encodeURIComponent(search)}`,
    );

    const button = page.getByRole("button", { name: /^Models \([0-9\+]+\)$/ });
    await button.click();

    const response = await page.waitForResponse(async (res) => {
      const req = res.request();
      const url = req.url();

      if (req.method() !== "GET") {
        return false;
      }

      if (!url.includes("/models.json?")) {
        return false;
      }

      if (!url.includes(`keyword=${encodeURIComponent(search)}`)) {
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
    const parsed = makerworldSearchResponseSchema.parse(json);
    await page.close();
    return parsed.pageProps.total;
  },
};
