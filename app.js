const searchBtn = document.querySelector("#search-btn");
const leftTemplate = document.querySelector("#left-sec-template");
const rightTemplate = document.querySelector("#right-sec-template");
const leftSection = document.querySelector(".left-section");
const rightSection = document.querySelector(".right-section");
const starterText = document.querySelector(".starter-text");
const logo = document.querySelector(".logo");
const modal = document.querySelector("dialog");

logo.addEventListener("click", () => window.location.reload());

searchBtn.addEventListener("click", searchRecipeHandler);

function searchRecipeHandler() {
  const searchValue = document.querySelector("#search-box").value;
  const url = `https://forkify-api.herokuapp.com/api/v2/recipes?search=${searchValue}`;

  fetch(url)
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error("response not found");
      }
    })
    .then((json) => json.data)
    .then((data) => {
      if (data.recipes.length !== 0) {
        return data.recipes;
      }
    })
    .then((recipes) => displaySearches(recipes))
    .catch((err) => console.log(err));
}

function displaySearches(recipes) {
  if (!recipes) {
    modal.showModal();
  }
  leftSection.innerHTML = "";
  for (let i = 0; i < 10; i++) {
    let cloneNode = leftTemplate.content.cloneNode(true);
    let img = cloneNode.querySelector("img");
    let foodTitle = cloneNode.querySelector(".food-title");
    let foodDescription = cloneNode.querySelector(".food-description");

    cloneNode
      .querySelector(".left-section-wrapper")
      .setAttribute("onclick", `recipeHandler('${recipes[i].id}')`);

    img.src = recipes[i].image_url;
    foodTitle.textContent =
      recipes[i].title.length > 20
        ? recipes[i].title.slice(0, 22) + "..."
        : recipes[i].title;
    foodDescription.textContent = recipes[i].publisher;

    leftSection.appendChild(cloneNode);
  }
}

function recipeHandler(recipeId) {
  const recipeUrl = `https://forkify-api.herokuapp.com/api/v2/recipes/${recipeId}`;
  fetch(recipeUrl)
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error("recipe not found");
      }
    })
    .then((json) => json.data)
    .then((data) => data.recipe)
    .then((recipe) => displayRecipe(recipe))
    .catch((err) => console.log(err));
}

function displayRecipe(recipe) {
  starterText.style.display = "none";
  rightSection.innerHTML = "";

  let cloneNode = rightTemplate.content.cloneNode(true);
  let img = cloneNode.querySelector("img");
  let recipeName = cloneNode.querySelector(".recipe-name");
  let time = cloneNode.querySelector(".time");
  let servings = cloneNode.querySelector(".serving-text");
  let ul = cloneNode.querySelector("ul");
  const recipeSite = cloneNode.querySelector(".recipe-site");

  for (let ingredient of recipe.ingredients) {
    let li = document.createElement("li");
    let p = document.createElement("p");
    let icon = document.createElement("i");
    icon.setAttribute("class", "fa-solid fa-check");
    p.textContent = `${ingredient.quantity ?? ""} ${ingredient.unit} ${
      ingredient.description
    }`;
    li.appendChild(icon);
    li.appendChild(p);
    ul.appendChild(li);
  }

  img.src = recipe.image_url;
  recipeName.textContent = recipe.title;
  time.textContent = recipe.cooking_time + " MINUTES";
  servings.textContent = recipe.servings + " SERVINGS";
  recipeSite.textContent = recipe.publisher;
  recipeSite.href = recipe.source_url;

  rightSection.appendChild(cloneNode);
}

function modalHandler() {
  modal.close();
  window.location.reload();
}
