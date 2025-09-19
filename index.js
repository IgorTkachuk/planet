const planetColorMap = [
  { name: "Mercury", color: "#419ebb" },
  { name: "Venus", color: "#eda249" },
  { name: "Earth", color: "#6f2ed6" },
  { name: "Mars", color: "#d14c32" },
  { name: "Jupiter", color: "#d83a34" },
  { name: "Saturn", color: "#cd5120" },
  { name: "Uranus", color: "#1ec2a4" },
  { name: "Neptune", color: "#2d68f0" },
];

let currentPlanet = "Mercury";

let data;

window.addEventListener("load", main);

function getPlanetColor(planetName) {
  return planetColorMap.find(
    ({ name }) => name.toUpperCase() === planetName.toUpperCase()
  ).color;
}

function getPlanetByName(planetName) {
  return data.find(({name}) => planetName.toUpperCase() === name.toUpperCase())
}

async function getData() {
  try {
    const res = await fetch("data.json");
    if (!res.ok) {
      throw new Error("Data load error!");
    }
    const data = await res.json();
    return data;
  } catch (err) {
    console.log(err);
  }
}

function makeNav(data) {
  const ul = document.createElement("ul");

  data.forEach(({ name }) => {
    const li = document.createElement("li");

    if (name.toUpperCase() === currentPlanet.toUpperCase()) {
      li.style.borderTop = "4px solid var(--planet-color)";
      console.log("Pun`k!");
    }

    const a = document.createElement("a");
    a.innerText = name;
    a.setAttribute("href", "#");
    li.appendChild(a);
    ul.appendChild(li);
  });
  return ul;
}

function menuHandler({ target }) {
  const a = target.closest("a");
  if (!a) return;

  console.log(a.innerText);
  currentPlanet = a.innerText;

  const nav = document.querySelector("nav")
  nav.innerHTML = ""
  nav.appendChild(makeNav(data));

  composePage(getPlanetByName(currentPlanet))
}

function btnSetHandler({ target }) {
  if (target.tagName !== "BUTTON") return;

  const btnSet = document.querySelectorAll(".button-set button");
  [...btnSet].forEach((btn) => btn.classList.remove("active"));

  target.classList.add("active");
}

function composePage({ name }) {
  document.documentElement.style.setProperty(
    "--planet-color",
    getPlanetColor(name)
  );

  const planet = getPlanetByName(name);

  document.querySelector("img.overview").setAttribute("src", planet.images.planet)
  document.querySelector("img.structure").setAttribute("src", planet.images.internal)
  document.querySelector("img.geology").setAttribute("src", planet.images.geology)

  document.querySelector(".right-side h1").innerText = planet.name;
  document.querySelector('.src a.overview').setAttribute('href', planet.overview.source);
  document.querySelector(".descr.overview").innerText = planet.overview.content;
  
  document.querySelector('.src a.structure').setAttribute('href', planet.structure.source);
  document.querySelector(".descr.structure").innerText = planet.structure.content;
  
  document
    .querySelector('.src a.geology')
    .setAttribute('href', planet.geology.source);
  document.querySelector(".descr.geology").innerText = planet.geology.content;

  document.querySelector("footer li:nth-child(1) h2").innerText = planet.rotation;
  document.querySelector("footer li:nth-child(2) h2").innerText = planet.revolution;
  document.querySelector("footer li:nth-child(3) h2").innerText = planet.radius;
  document.querySelector("footer li:nth-child(4) h2").innerText = planet.temperature;


}

async function main() {
  data = await getData();

  const nav = document.querySelector("nav");
  nav.appendChild(makeNav(data));

  nav.addEventListener("click", menuHandler);

  const btnSet = document.querySelector(".button-set");
  btnSet.addEventListener("click", btnSetHandler);

  composePage(data[0]);
}
