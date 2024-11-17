import { usedCars } from "./usedCars.js"; // import usedCars array from another JS file

// getting HTML elements needed
const cardParent = document.querySelector("#cars");
const filterColorParent = document.querySelector("#colors");
const filterMakeParent = document.querySelector("#makes");
const total = document.querySelector("#results");

init();

function init() {
    addCarCards();
    addToFilter();
}

function addCarCards() {
    for (let i = 0; i < usedCars.length; i++) {
        createCard(usedCars[i]);
    }
}

// document.getElementById("reset").addEventListener("click", function (event) {
//     document.getElementById("client").reset();
// });

document.getElementById("filter").addEventListener("submit", function (event) {
    event.preventDefault(); // prevent form submission
    const formData = new FormData(this);

    // creating make array
    const checkboxesMake = document.querySelectorAll('input[name="make"]:checked');
    const selectedMakes = [];
    checkboxesMake.forEach((checkbox) => {
        selectedMakes.push(checkbox.value);
    });

    // creating color array
    const checkboxesColor = document.querySelectorAll('input[name="color"]:checked');
    const selectedColor = [];
    checkboxesColor.forEach((checkbox) => {
        selectedColor.push(checkbox.value);
    });

    // reset layout to show nothing
    cardParent.innerHTML = ""; // Clear the current displayed cars

    let filterArr = [];

    // parse and convert form data to numbers where necessary
    const minYear = parseInt(formData.get("min-year")) || null;
    const maxYear = parseInt(formData.get("max-year")) || null;
    const mileage = parseInt(formData.get("mileage")) || null;
    const minPrice = parseFloat(formData.get("min-price")) || null;
    const maxPrice = parseFloat(formData.get("max-price")) || null;

    // get cars that match the filter
    getCars(minYear, maxYear, selectedMakes, mileage, minPrice, maxPrice, selectedColor);
});

function createCard(car) {
    const element = `
        <div id="container">
            <img src="../assets/${car.make}-${car.model}.jpg" alt="Broken Image">
            <h1>${car.year} ${car.make} ${car.model}</h1>
            <hr>
            <div id="wrapper">
                <h2 id="mileage">${car.mileage} Miles</h2>
                <h2 id="price">$${car.price}</h2>
            </div>
            <h2 id="gas-milegage">${car.gasMileage}</h2>
        </div>`;

        cardParent.innerHTML += element;
}

function getCars(yearMin, yearMax, makeArr, maxMile, minPrice, maxPrice, colorArr) {
    let filterArr = [];
    const makesSet = new Set(makeArr);
    const colorsSet = new Set(colorArr);

    for (let i = 0; i < usedCars.length; i++) {
        const car = usedCars[i];

        // if the values are null assume the user does not care about the value and is okay with anything
        const yearMatch =
        (yearMin === null || car.year >= yearMin) &&
        (yearMax === null || car.year <= yearMax);
        const mileageMatch = maxMile === null || car.mileage <= maxMile;
        const priceMatch =
        (minPrice === null || car.price >= minPrice) &&
        (maxPrice === null || car.price <= maxPrice);
        const makeMatch = makesSet.size === 0 || makesSet.has(car.make);
        const colorMatch = colorsSet.size === 0 || colorsSet.has(car.color);

        // if car matches all the filters add it to the filter array
        if (yearMatch && mileageMatch && priceMatch && makeMatch && colorMatch) {
            filterArr.push(car);
        }
    }

    if (filterArr.length == 0) {
        const element = `
        <h1>There are no cars that match those filter options, sorry.</h1>`;
        cardParent.innerHTML += element;
    } else {
        filterArr.forEach((car) => createCard(car)); // display the filtered cards
    }
}

// get a list of the unique makes and colors
function addToFilter() {
    let colorArr = [];
    let makeArr = [];

    for (let i = 0; i < usedCars.length; i++) {
        if (!makeArr.includes(usedCars[i].make)) {
            makeArr.push(usedCars[i].make);
        }
        if (!colorArr.includes(usedCars[i].color)) {
         colorArr.push(usedCars[i].color);
        }
    }

    // sort by alphabet
    colorArr.sort();
    makeArr.sort();

    colorArr.forEach((color) => addCheckBoxes(filterColorParent, color, "color"));
    makeArr.forEach((make) => addCheckBoxes(filterMakeParent, make, "make"));
}

// creates checkboxes based off of what cars are in the database
function addCheckBoxes(parent, id, name) {
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.value = id;
    checkbox.id = id;
    checkbox.name = name;

    const label = document.createElement("label");
    label.htmlFor = id;
    label.textContent = id;

    parent.appendChild(checkbox);
    parent.appendChild(label);
}
