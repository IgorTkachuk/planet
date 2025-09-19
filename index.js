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

window.addEventListener("load", main);

function getPlanetColor(planetName) {
  return planetColorMap.find(
    ({ name }) => name.toUpperCase() === planetName.toUpperCase()
  ).color;
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

    if (name === currentPlanet) {
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
}

async function main() {
  const data = await getData();

  const nav = document.querySelector("nav");
  nav.appendChild(makeNav(data));

  nav.addEventListener("click", menuHandler);

  const btnSet = document.querySelector(".button-set");
  btnSet.addEventListener("click", btnSetHandler);

  composePage(data[0]);
}
