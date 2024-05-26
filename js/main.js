import { script } from "../constant/constants.js";

async function fetchData() {
  try {
    const response = await fetch("https://api.sampleapis.com/codingresources/codingResources");
    if (!response.ok) {
      throw new Error("Failed to fetch data");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching data:", error);
    return null;
  }
}

async function displayData() {
  const data = await fetchData();
  if (!data) {
    return;
  }

  const tableBody = document.getElementById("table-body");
  data.forEach((resource) => {
    const row = document.createElement("tr");
    row.innerHTML = `
         <td class="description" data-url="${resource.url}">${resource.description}</td>
          <td>${Array.isArray(resource.types) ? resource.types.join(", ") : ""}</td>
          <td>${Array.isArray(resource.topics) ? resource.topics.join(", ") : ""}</td>
        `;
    tableBody.appendChild(row);
  });
  tableBody.addEventListener("click", function (event) {
    const target = event.target;
    if (target.tagName === "TD" && target.classList.contains("description")) {
      const url = target.dataset.url;
      if (url) {
        window.open(url, "_blank");
      }
    }
  });
}

function replacePlaceholders(firstName, lastName, company) {
  const loremIpsumContent = document.getElementById("lorem-ipsum-content");
  const loremIpsum = loremIpsumContent.innerHTML;
  console.log(loremIpsumContent.innerHTML);

  const replacedLoremIpsum = loremIpsum
    .replace(/\[FirstName]/g, firstName)
    .replace(/\[LastName]/g, lastName)
    .replace(/\[Company]/g, company);

  loremIpsumContent.innerHTML = replacedLoremIpsum;
}

// Event Listener
document.addEventListener("DOMContentLoaded", function () {
  const simulateCallButton = document.getElementById("simulate-call-button");

  simulateCallButton.addEventListener("click", function () {
    fetch("/data/fakeCallData.json")
      .then((response) => response.json())
      .then((data) => {
        const loremIpsumContent = document.getElementById("lorem-ipsum-content");
        loremIpsumContent.innerHTML = script;

        const randomIndex = Math.floor(Math.random() * data.length);
        const randomData = data[randomIndex];
        document.getElementById("firstName").value = randomData.firstName;
        document.getElementById("lastName").value = randomData.lastName;
        document.getElementById("city").value = randomData.city;
        document.getElementById("state").value = randomData.state;
        document.getElementById("zip").value = randomData.zip;
        document.getElementById("company").value = randomData.company;
        replacePlaceholders(randomData.firstName, randomData.lastName, randomData.company);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  });

  fetch("/components/form.html")
    .then((response) => response.text())
    .then((data) => {
      document.getElementById("form-content").innerHTML = data;

      const form = document.getElementById("data-form");
      form.addEventListener("submit", function (event) {
        event.preventDefault();
        const firstName = document.getElementById("firstName").value;
        const lastName = document.getElementById("lastName").value;
        replacePlaceholders(firstName, lastName);
      });
    });

  fetch("/components/script.html")
    .then((response) => response.text())
    .then((data) => {
      document.getElementById("script-content").innerHTML = data;
    });

  fetch("/components/table.html")
    .then((response) => response.text())
    .then((data) => {
      document.getElementById("table-content").innerHTML = data;
    });

  displayData();
});

async function fetchDispositions() {
  try {
    const response = await fetch("/data/dispositions.json");
    const data = await response.json();
    const categories = data.dispositions;

    // Generate buttons for each category
    const categoryContainer = document.getElementById("category-container");
    categories.forEach((category) => {
      const button = document.createElement("button");
      button.textContent = category;
      button.addEventListener("click", () => {
        alert(`You clicked on ${category}`);
      });
      categoryContainer.appendChild(button);
    });
  } catch (error) {
    console.error("Error fetching categories:", error);
  }
}
fetchDispositions();
