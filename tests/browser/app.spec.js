import { test, expect } from "@playwright/test";

test("directory, local passport, stamps, review editing, reload and reset", async ({ page }) => {
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await page.goto("/cafes");
  await expect(page.getByRole("heading", { name: "8 cafés", exact: true })).toBeVisible();
  await page.getByRole("searchbox", { name: "Search cafés" }).fill("moonbeam");
  await expect(page.getByRole("heading", { name: "1 café", exact: true })).toBeVisible();
  await page.getByRole("searchbox", { name: "Search cafés" }).fill("no-such-cafe");
  await expect(page.getByText("No cafés match all of that.")).toBeVisible();
  await page.goto("/passport");
  await page.getByLabel("Name on the passport").fill("Mika");
  await page.getByRole("button", { name: "Create passport", exact: true }).click();
  await expect(page.getByText("Mika", { exact: true })).toBeVisible();
  await page.goto("/cafes/moonbeam-nook");
  await page.getByRole("button", { name: "Mark as visited", exact: true }).click();
  await page.getByRole("button", { name: "5 stars", exact: true }).click();
  await page.getByLabel("A little note (optional)").fill("Lovely quiet corner");
  await page.getByRole("button", { name: "Save review", exact: true }).click();
  await expect(page.getByText("Lovely quiet corner", { exact: true })).toBeVisible();
  await page.reload();
  await expect(page.getByText("Lovely quiet corner", { exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Edit", exact: true }).click();
  await page.getByLabel("A little note (optional)").fill("Updated note");
  await page.getByRole("button", { name: /Save|Update/ }).click();
  await page.goto("/passport");
  await expect(page.getByText("Updated note", { exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Reset passport", exact: true }).click();
  await page.getByRole("button", { name: "Cancel", exact: true }).click();
  await expect(page.getByText("Mika", { exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Reset passport", exact: true }).click();
  await page.getByRole("button", { name: "Yes, reset", exact: true }).click();
  await page.reload();
  await expect(page.getByRole("heading", { name: "Start your café passport", exact: true })).toBeVisible();
  expect(errors).toEqual([]);
});

test("direct routes, old bookmarks, map fallback and selection", async ({ page, context }) => {
  await context.grantPermissions([]);
  await page.goto("/maps");
  await expect(page).toHaveURL(/\/map$/);
  await expect(page.locator(".leaflet-container")).toBeVisible();
  await page.getByRole("button").filter({ hasText: "Moss & Mug" }).click();
  await expect(page.getByRole("link", { name: "Open café", exact: true })).toHaveAttribute("href", "/cafes/moss-and-mug");
  await page.goto("/user");
  await expect(page).toHaveURL(/\/passport$/);
  await page.goto("/cafes/missing");
  await expect(page.getByRole("heading", { name: "Café not found", exact: true })).toBeVisible();
  await page.goto("/missing-page");
  await expect(page.getByRole("heading", { name: "Page not found", exact: true })).toBeVisible();
});

test("mobile navigation and layout", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await page.getByRole("navigation", { name: "Primary", exact: true }).filter({ visible: true }).getByRole("link", { name: "Cafés", exact: true }).click();
  await expect(page.getByRole("heading", { name: "8 cafés", exact: true })).toBeVisible();
  await expect(page.getByRole("navigation", { name: "Primary", exact: true }).filter({ visible: true }).getByRole("link", { name: "About", exact: true })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
});

test("legacy passport migrates in-browser and failed saves do not claim success", async ({ page }) => {
  await page.addInitScript(() => {
    if (localStorage.getItem("seeded")) return;
    localStorage.setItem("seeded", "true");
    localStorage.setItem("luckys-atlas:state:v1", JSON.stringify({ schemaVersion: 2, passport: { displayName: "Original explorer", city: "Manila" }, visits: { "moonbeam-nook": { declaredAt: "2026-11-26T10:00:00.000Z" } }, reviews: {} }));
  });
  await page.goto("/passport");
  await expect(page.getByText("Original explorer", { exact: true })).toBeVisible();
  await expect(page.getByRole("link").filter({ hasText: "Moonbeam Nook" })).toBeVisible();
  await page.goto("/cafes/moss-and-mug");
  await page.evaluate(() => { Storage.prototype.setItem = () => { throw new Error("Blocked"); }; });
  await page.getByRole("button", { name: "Mark as visited", exact: true }).click();
  await expect(page.getByRole("alert")).toContainText("could not be saved");
  await expect(page.getByRole("button", { name: "Mark as visited", exact: true })).toBeVisible();
  await expect(page.getByText("Visit saved, stamp collected", { exact: true })).toHaveCount(0);
});
