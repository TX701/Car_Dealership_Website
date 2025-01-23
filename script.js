import { usedCars } from "./usedCars.js"; // import usedCars array from another JS file

// getting HTML elements needed
const cardParent = document.querySelector("#cars");
const filterColorParent = document.querySelector("#colors");
const filterMakeParent = document.querySelector("#makes");
const nothing = document.querySelector("#nothing");

document.getElementById("menu").addEventListener("click", () => {
    document.getElementById("filter").style.display = "block";

    document.getElementById("filter").addEventListener("submit", () => {
        document.getElementById("filter").style.display = "none";
    });
});

// gets the cars that match the users requests
const getCars = (yearMin, yearMax, makeArr, minMile, maxMile, minPrice, maxPrice, colorArr) => {
    let filterArr = [];
    const makesSet = new Set(makeArr);
    const colorsSet = new Set(colorArr);

    for (let i = 0; i < usedCars.length; i++) {
        const car = usedCars[i];

        // if the values are null assume the user does not care about the value and is okay with anything
        const yearMatch =
        (yearMin === null || car.year >= yearMin) &&
        (yearMax === null || car.year <= yearMax);
        const mileageMatch = 
        (minMile === null || car.mileage >= minMile) &&
        (maxMile === null || car.mileage <= maxMile);
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

    if (filterArr.length === 0) {
        nothing.style.display = "block"; // display message saying search returned nothing
        cardParent.innerHTML = ""; // clear car cards
    } else {
        nothing.style.display = "none"; // hide message saying search returned nothing
        filterArr.forEach((car) => createCard(car)); // display filtered cars
    }
}

document.getElementById("filter").addEventListener("submit", (event) => {
    window.location.href = "#starting-text";

    event.preventDefault(); // prevent empty form submission
    const formData = new FormData(this);

    const checkboxesMake = document.querySelectorAll('input[name="make"]:checked'); // creating make array
    const selectedMakes = [];
    checkboxesMake.forEach((checkbox) => {
        selectedMakes.push(checkbox.value);
    });

    const checkboxesColor = document.querySelectorAll('input[name="color"]:checked'); // creating color array
    const selectedColor = [];
    checkboxesColor.forEach((checkbox) => {
        selectedColor.push(checkbox.value);
    });

    cardParent.innerHTML = ""; // reset layout to show nothing

    // parse and convert form data to numbers where necessary
    const minYear = parseInt(Number(formData.get("min-year"))) || null;
    const maxYear = parseInt(Number(formData.get("max-year"))) || null;
    const minMileage = parseInt(Number(formData.get("min-mileage"))) || null;
    const maxMileage = parseInt(Number(formData.get("max-mileage"))) || null;
    const minPrice = parseFloat(Number(formData.get("min-price"))) || null;
    const maxPrice = parseFloat(Number(formData.get("max-price"))) || null;

    getCars(minYear, maxYear, selectedMakes, minMileage, maxMileage, minPrice, maxPrice, selectedColor); // get cars that match the filter
});

// creates checkboxes based off of what cars are in the database
const addCheckBoxes = (parent, id, name) => {
    let element; // Declare `element` outside the condition

    // different if color as we need to add little circles representing the colors (stylized in block due to dynamic nature)
    if (name === "color") {
        element = `
            <div class="checkbox-wrapper" style="display: flex; align-items: center;">
                <input type="checkbox" id="${id}" value="${id}" name="${name}">
                <div class="color-shape" style="display: inline-block; width: 20px; height: 20px; border-radius: 50%; background-color: ${id}; margin: 0 10px; border: 2px solid black;"></div>
                <label for="${id}">${id}</label>
            </div>`;
    } else {
        element = `
            <div class="checkbox-wrapper">
                <input type="checkbox" id="${id}" value="${id}" name="${name}">
                <label for="${id}">${id}</label>
            </div>`;
    }

    parent.innerHTML += element;
}

// get a list of the unique makes and colors
const addToFilter = () => {
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

    colorArr.sort(); // sort by alphabet
    makeArr.sort();

    colorArr.forEach((color) => addCheckBoxes(filterColorParent, color, "color"));
    makeArr.forEach((make) => addCheckBoxes(filterMakeParent, make, "make"));
}

// creates a product card for each car
const createCard = (car) => {
    const element = `
        <div id="container">
            <img src="./assets/${car.make}${car.model}.jpg" alt="Broken Image">
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

// adding the cards in the database onto the page 
const addCarCards = () => {
    for (let i = 0; i < usedCars.length; i++) {
        createCard(usedCars[i]);
    }
}

const init = () => {
    addCarCards();
    addToFilter();
}

init();
