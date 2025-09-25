const planetColorMap = {
  Mercury: "#DEF4FC",
  Venus: "#F7CC7F",
  Earth: "#545BFE",
  Mars: "#FF6A45",
  Jupiter: "#ECAD7A",
  Saturn: "#FCCB6B",
  Uranus: "#65F0D5",
  Neptune: "#497EFA",
};

const PLANET_START_IDX = 0;
const DATA_URL = "data.json";

let currentPlanet = "Mercury";

let data;

let isLoading = false;

function getPlanetColor(planetName) {
  return planetColorMap[planetName];
}

function getPlanetByName(planetName) {
  return data.find(
    ({ name }) => planetName.toUpperCase() === name.toUpperCase()
  );
}

function showLoader() {
  const loaderContainer = document.querySelector(".loader-container");
  loaderContainer.style.display = "flex";
}

function hideLoader() {
  const loaderContainer = document.querySelector(".loader-container");
  loaderContainer.style.display = "none";
}

function showErr(err) {
  document.querySelector(".loader").style.display = "none";

  const errField = document.querySelector(".err");
  errField.style.display = "flex";
  errField.insertAdjacentText("afterbegin", err);
}

async function getData() {
  showLoader();

  try {
    if (Math.floor(Math.random() * 2))
      throw new Error("Spontaneous data loading error");

    const res = await fetch(DATA_URL);
    if (!res.ok) {
      throw new Error("Data load error!");
    }
    const data = await res.json();

    hideLoader();
    return data;
  } catch (err) {
    showErr("Something went wrong! Try again leter.");
    console.log(err);
  }
}

function makeNav(data) {
  const ul = document.createElement("ul");

  data.forEach(({ name }) => {
    const li = document.createElement("li");

    if (name.toUpperCase() === currentPlanet.toUpperCase()) {
      li.style.borderColor = "var(--planet-color)";
    }

    const a = document.createElement("a");
    a.innerText = name;
    a.setAttribute("href", "#");

    const planetIco = document.createElement("div");
    planetIco.classList.add("planet-ico");
    planetIco.style.backgroundColor = getPlanetColor(name);
    a.insertAdjacentElement("afterbegin", planetIco);

    li.appendChild(a);
    ul.appendChild(li);
  });
  return ul;
}

function closeMobileMenu() {
  const hamburgerTrigger = document.querySelector(
    ".mobile-menu input[type='checkbox']"
  );
  hamburgerTrigger.checked = false;
}

function repaintNav() {
  const nav = document.querySelector("nav");
  nav.innerHTML = "";
  nav.appendChild(makeNav(data));
}

function menuHandler({ target }) {
  const a = target.closest("a");
  if (!a) return;

  currentPlanet = a.innerText;

  repaintNav();

  composePage(getPlanetByName(currentPlanet));

  closeMobileMenu();
}

function btnSetHandler({ target }) {
  if (target.tagName !== "BUTTON") return;

  const btnSet = document.querySelectorAll(".button-set button");
  [...btnSet].forEach((btn) => btn.classList.remove("active"));

  target.classList.add("active");
}

function updateImages({ images: { planet, internal, geology } }) {
  document.querySelector("img.overview")?.setAttribute("src", planet);
  document.querySelector("img.structure")?.setAttribute("src", internal);
  document.querySelector("img.geology")?.setAttribute("src", geology);
}

function updateLinks({ overview, structure, geology }) {
  document
    .querySelector(".src a.overview")
    ?.setAttribute("href", overview.source);

  document
    .querySelector(".src a.structure")
    ?.setAttribute("href", structure.source);

  document
    .querySelector(".src a.geology")
    ?.setAttribute("href", geology.source);
}

function applicateText(selector, text) {
  const elem = document.querySelector(selector);
  if (elem) elem.textContent = text;
}

function updateText({ name, overview, structure, geology }) {
  applicateText(".right-side h1", name);
  applicateText(".descr.overview", overview.content);
  applicateText(".descr.structure", structure.content);
  applicateText(".descr.geology", geology.content);
}

function updateFooter({ rotation, revolution, radius, temperature }) {
  applicateText("footer li:nth-child(1) h2", rotation);
  applicateText("footer li:nth-child(2) h2", revolution);
  applicateText("footer li:nth-child(3) h2", radius);
  applicateText("footer li:nth-child(4) h2", temperature);
}

function composePage({ name }) {
  document.documentElement.style.setProperty(
    "--planet-color",
    getPlanetColor(name)
  );

  const planet = getPlanetByName(name);

  updateImages(planet);
  updateText(planet);
  updateLinks(planet);
  updateFooter(planet);
}

async function main() {
  data = await getData();

  if (!data) return;

  const nav = document.querySelector("nav");
  nav.appendChild(makeNav(data));

  nav.addEventListener("click", menuHandler);

  const btnSet = document.querySelector(".button-set");
  btnSet.addEventListener("click", btnSetHandler);

  composePage(data[PLANET_START_IDX]);
}

window.addEventListener("load", main);
