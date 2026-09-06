const modules = import.meta.glob("../icons/*.svg", {
  query: "?raw",
  import: "default",
  eager: true,
});

const icons = Object.fromEntries(
  Object.entries(modules).map(([path, svg]) => [
    path.slice(path.lastIndexOf("/") + 1, -4),
    svg,
  ]),
);

export function mountIcons(root = document) {
  for (const el of root.querySelectorAll("[data-icon]")) {
    const svg = icons[el.dataset.icon];
    if (!svg || el.querySelector("svg")) {
      continue;
    }

    el.insertAdjacentHTML("afterbegin", svg);
    el.querySelector("svg")?.setAttribute("aria-hidden", "true");
  }
}
