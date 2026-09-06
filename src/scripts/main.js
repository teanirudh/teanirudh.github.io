import "../styles/main.css";
import { mountIcons } from "./icons.js";
import { pageFromHash, pages } from "./pages.js";

const content = document.getElementById("content");
const tabs = document.querySelector(".tabs");
const tabLinks = tabs.querySelectorAll("[data-page]");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const swapMs = reduceMotion ? 0 : 320;

let swapTimer = 0;
let pendingPage = "";

function setActiveTab(name) {
  for (const link of tabLinks) {
    if (link.dataset.page === name) {
      link.setAttribute("aria-current", "page");
    } else {
      link.removeAttribute("aria-current");
    }
  }
}

function render(name) {
  content.innerHTML = pages[name];
  mountIcons(content);
  content.dataset.page = name;
  setActiveTab(name);
}

function finishSwap() {
  swapTimer = 0;
  const name = pendingPage;
  pendingPage = "";
  if (!name) {
    return;
  }

  content.classList.add("is-entering");
  content.classList.remove("is-leaving");
  render(name);
  void content.offsetHeight;
  content.classList.remove("is-entering");
}

function show(name) {
  setActiveTab(name);

  if (name === content.dataset.page) {
    pendingPage = "";
    if (swapTimer) {
      window.clearTimeout(swapTimer);
      swapTimer = 0;
      content.classList.remove("is-leaving");
    }
    return;
  }

  if (reduceMotion) {
    window.clearTimeout(swapTimer);
    swapTimer = 0;
    pendingPage = "";
    render(name);
    return;
  }

  pendingPage = name;
  if (swapTimer) {
    return;
  }

  content.classList.add("is-leaving");
  swapTimer = window.setTimeout(finishSwap, swapMs);
}

function go(name) {
  if (location.hash !== `#${name}`) {
    history.pushState(null, "", `#${name}`);
  }
  show(name);
}

if (!location.hash) {
  history.replaceState(null, "", "#home");
}

mountIcons();
render(pageFromHash());

tabs.addEventListener("click", (event) => {
  const link = event.target.closest("[data-page]");
  if (!link) {
    return;
  }

  event.preventDefault();
  go(link.dataset.page);
});

window.addEventListener("popstate", () => {
  show(pageFromHash());
});
