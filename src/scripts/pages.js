const modules = import.meta.glob("../pages/*.html", {
  query: "?raw",
  import: "default",
  eager: true,
});

export const pages = Object.fromEntries(
  Object.entries(modules).map(([path, html]) => [
    path.slice(path.lastIndexOf("/") + 1, -5),
    html,
  ]),
);

export function pageFromHash(hash = location.hash) {
  const name = hash.replace("#", "") || "home";
  return name in pages ? name : "home";
}
