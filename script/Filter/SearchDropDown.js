import { normalizeString, toggle, removeListItem } from "../utils/utils.js";
import CardRecipesFactory from "../Factory/CardRecipesFactory.js";
import { recipes } from "../../data/recipes.js";
let TAGS = [];
const ALL_RECIPES = recipes;
export default class SearchDropDown {
  constructor(recipes) {
    this.recipes = recipes;
    this.tagIngredient = document.getElementById("thumbnail-tags-container");
    this.inputIngredient = document.getElementById("search-ingredients");
    this.inputAppliance = document.getElementById("search-appliances");
    this.inputUstensils = document.getElementById("search-ustensils");
    this.dropIngredient = document.querySelector(".dropdown-list-ingredients");
    this.dropAppliance = document.querySelector(".dropdown-list-appliances");
    this.dropUstensils = document.querySelector(".dropdown-list-ustensils");

    this.tableauIngredients = [];
    this.tableauUstensils = [];
    this.tableauAppliances = [];

    this.displayItem("ingredients");
    this.displayItem("appliances");
    this.displayItem("ustensils");
    this.filtred = [];
    this.input = document.getElementById("find");
  }

  generateItems(tab, domBlock, type) {
    removeListItem(type);
    this.filerAdvanceInputsItem(type);
    tab.forEach((item) => {
      const itemNormalized = normalizeString(item);
      const listDOM = document.createElement("li");
      listDOM.classList.add("list-items", `${type}-item`);
      listDOM.setAttribute("id", "tag");
      listDOM.setAttribute("data-item", `${itemNormalized}`);
      listDOM.setAttribute("data-type", `${itemNormalized}`);
      listDOM.innerText = item[0].toUpperCase() + item.slice(1);
      listDOM.addEventListener("click", () => {
        this.addBadge(type, item);
      });
      return domBlock.appendChild(listDOM);
    });
  }

  displayItem(type) {
    switch (type) {
      case "ingredients":
        document.querySelector(".ingredients").onclick = (e) => {
          e.stopPropagation();

          //toggle("ingredients");
          toggle("ingredients");

          this.recipes.forEach((recipe) => {
            const recipeIngredients = recipe.ingredients;
            recipeIngredients.forEach((ingredients) => {
              //  console.log(ingredients)
              const ingredient = ingredients.ingredient.toLowerCase();

              this.tableauIngredients.push(ingredient);
            });
          });
          this.tableauIngredients = [
            ...new Set(this.tableauIngredients),
          ].sort();
          this.generateItems(
            this.tableauIngredients,
            this.dropIngredient,
            "ingredients"
          );
          // console.log("TABIN", this.tableauIngredients);
        };

        break;
      case "appliances":
        document.querySelector(".appliances").onclick = (e) => {
          toggle("appliances");

          e.preventDefault();
          e.stopPropagation();

          this.recipes.forEach((recipe) => {
            const appliance = recipe.appliance.toLowerCase();

            this.tableauAppliances.push(appliance);
          });

          this.tableauAppliances = [...new Set(this.tableauAppliances)].sort();
          this.generateItems(
            this.tableauAppliances,
            this.dropAppliance,
            "appliances"
          );
        };

        break;
      case "ustensils":
        document.querySelector(".ustensils").onclick = (e) => {
          toggle("ustensils");
          e.preventDefault();
          e.stopPropagation();
          this.recipes.forEach((recipe) => {
            const itemUstensils = recipe.ustensils;
            itemUstensils.forEach((ustensil) => {
              const ustensilItem = ustensil.toLowerCase();

              this.tableauUstensils.push(ustensilItem);
            });
          });
          this.tableauUstensils = [...new Set(this.tableauUstensils)].sort();
          this.generateItems(
            this.tableauUstensils,
            this.dropUstensils,
            "ustensils"
          );
        };

        break;
      default:
        break;
    }
  }

  /**
   * *Add a badge
   * @param {string, string} typeOfBadge, badgeText
   */
  addBadge(typeOfBadge, badgeText) {
    if (!TAGS.includes(badgeText)) {
      TAGS.push(badgeText);
      const tagBadge = `
      <div id="tagItem" class="thumbnailTag thumbnail tags_${typeOfBadge}" data-value ="${badgeText}">
          <button id="btn-${typeOfBadge}" >${badgeText}</button>
          <i class="far fa-times-circle" data-type="${typeOfBadge}"></i>
      </div>`;

      let currentTag = document.querySelector("#thumbnail-tags-container");

      currentTag.innerHTML += tagBadge;
      // je recupère la liste filtrée et j'enlève les doublons
      this.filtred = [...this.filterCrossBadgesInput()];
      this.filtred = [...new Set(this.filtred)];

      // mise à jour de la liste
      this.buildNewListRecipes(this.filtred, typeOfBadge);
    }
  }

  /**
   *
   * @param {string} type
   */
  removeBagde(type) {
    if (TAGS.length == 0) this.filterCrossBadgesInput();

    const close = document.getElementsByClassName(`fa-times-circle`);
    for (let closeItem of close) {
      closeItem.addEventListener("click", (e) => {
        e.stopPropagation();
        e.preventDefault();
        const textContent =
          e.currentTarget.parentNode.getAttribute("data-value");
        //const tagType = e.currentTarget.getAttribute("data-type");

        TAGS = TAGS.filter((tag) => tag != textContent);

        // appel des CARD avec des fonctions filtrer par rapport au tags selectionné / Je boucle sur toute les recipes et je regarde si
        //recipies.ingredient inclus dans tableau des tags view card avec filerRecipes

        this.filtred = [...this.filterCrossBadgesInput()];
        this.filtred = [...new Set(this.filtred)];

        e.currentTarget.parentNode.remove();
        this.filterCrossBadgesInput();

        this.buildNewListRecipes(this.filtred, type);
      });
    }
  }

  /**
   * Mise à jour de la liste des recipes
   * @param {Array of Object} filtred
   * @param {string} type
   */
  buildNewListRecipes(filtred, type) {
    const messageAside = document.getElementById("message");
    // console.log("TAGS : ", TAGS);
    // Si multiple recherche :(bare et badges) je met à jour la list "filtred"
    if (!TAGS.length == 0 || !this.input.value == "") {
      this.removeBagde(type);
      const viewCard = new CardRecipesFactory(filtred);
      viewCard.Recipes();
      new SearchDropDown(filtred);
      messageAside.classList.add("opened");
    } else {
      // si non j'affiche toute la liste
      const viewCard = new CardRecipesFactory(ALL_RECIPES);
      viewCard.Recipes();
      new SearchDropDown(ALL_RECIPES);
      messageAside.classList.remove("opened");
    }
  }

  /**
   * *Collect Appilance datas
   * @returns {Array.string}
   */
  collectAppliances(recipe) {
    const appliances = new Set();

    appliances.add(recipe.appliance.toLowerCase());

    return [...appliances];
  }

  /**
   * *Collect ingredients datas
   * @returns {Array.string}
   */
  collectIngredients(recipe) {
    const ingredients = new Set();

    for (let item of recipe.ingredients) {
      ingredients.add(item.ingredient.toLowerCase());
    }

    return [...ingredients];
  }

  /**
   * *Collect ustensils datas
   * @returns {Array.string}
   */
  collectUstensils(recipe) {
    const ustensils = new Set();

    for (let ustensil of recipe.ustensils) {
      ustensils.add(ustensil.toLowerCase());
    }

    return [...ustensils];
  }

  /**
   *  Recherche multiples -badges et barre de recherche principal
   * @returns {Array of Object} recipesList
   */
   filterCrossBadgesInput() {
    let filteredRecipes = new Set(this.recipes)
    let foundedRecipes = new Set();
    const searchInput = this.input.value.toLowerCase();

    // Si y a pas de badges je check dans la bare de recherche
    if (TAGS.length == 0) {
      foundedRecipes = this.recipes.filter((recipe) => {
        if (
          this.collectIngredients(recipe).includes(searchInput) ||
          this.collectAppliances(recipe).includes(searchInput) ||
          recipe.name.toLowerCase().includes(searchInput) ||
          recipe.description.toLowerCase().includes(searchInput) ||
          this.collectUstensils(recipe).includes(searchInput)
        ) {
          return recipe;
        }
      });
    }

    // Si J'ai des recherches par badges je check dans ingredients, ustensils et appliances
    TAGS.forEach((tag) => {
      tag = tag.toLowerCase();
      foundedRecipes = this.recipes.filter((recipe) => {
        if (
          this.collectIngredients(recipe).includes(tag) ||
          this.collectAppliances(recipe).includes(tag) ||
          this.collectUstensils(recipe).includes(tag)
        )
          return recipe;
      });

      // je croise la liste avec le resultat précedent pour affiner la recherche
        filteredRecipes = new Set(
        [...foundedRecipes].filter((recipe) => filteredRecipes.has(recipe))
        );

    });

    return filteredRecipes;
  }

  /**
   * Filtre dans les Droplist ingredients, ustensils et appliances
   * @param {*string} type
   */
   filerAdvanceInputsItem(type) {
    let tableauIngredients = [];
    let tableauUstensils = [];
    let tableauAppliances = [];
    let itemToDisplay = [];
    switch (type) {
      case "ingredients":
        this.inputIngredient.oninput = (e) => {
          e.preventDefault();
          e.stopPropagation();
          const searchString = e.target.value;
          this.recipes.forEach((recipe) => {
            const recipeIngredients = recipe.ingredients;
            recipeIngredients.forEach((ingredients) => {
              const ingredient = ingredients.ingredient.toLowerCase();
              if (!tableauIngredients.includes(ingredient)) {
                tableauIngredients.push(ingredient);
                itemToDisplay = tableauIngredients.filter((item) =>
                  item.startsWith(e.target.value)
                );
                removeListItem("ingredients");
                this.generateItems(
                  itemToDisplay,
                  this.dropIngredient,
                  "ingredients"
                );
              }
            });
          });

          if (!searchString.length == 0) {
            const filteredRecipe = this.recipes.filter((result) => {
              if (
                result.ingredients.find((items) => {
                  return items.ingredient.toLowerCase().includes(searchString);
                }) != undefined
              ) {
                return result;
              }
            });
            new SearchDropDown(filteredRecipe);
          } else {
            new SearchDropDown(this.recipes);
          }
        };
        break;
      case "appliances":
        this.inputAppliance.oninput = (e) => {
          e.preventDefault();
          e.stopPropagation();
          const searchString = e.target.value;
          this.recipes.forEach((recipe) => {
            const recipeAppliance = recipe.appliance.toLowerCase();
            if (!tableauAppliances.includes(recipeAppliance)) {
              tableauAppliances.push(recipeAppliance);
              itemToDisplay = tableauAppliances.filter((item) =>
                item.startsWith(e.target.value)
              );
              removeListItem("appliances");
              this.generateItems(
                itemToDisplay,
                this.dropAppliance,
                "appliances"
              );
            }
          });

          if (!searchString.length == 0) {
            const filteredRecipe = this.recipes.filter((result) => {
              if (result.appliance.toLowerCase().includes(searchString)) {
                return result;
              }
            });

            new SearchDropDown(filteredRecipe);
          } else {
            new SearchDropDown(this.recipes);
          }
        };
        break;
      case "ustensils":
        this.inputUstensils.oninput = (e) => {
          // this.filter.onfocusInput("ustensils");
          const searchString = e.target.value;
          this.recipes.forEach((recipe) => {
            const itemUstensils = recipe.ustensils;
            itemUstensils.forEach((ustensil) => {
              const ustensilItem = ustensil.toLowerCase();
              if (!tableauUstensils.includes(ustensilItem)) {
                tableauUstensils.push(ustensilItem);
                itemToDisplay = tableauUstensils.filter((item) =>
                  item.startsWith(e.target.value)
                );
                this.generateItems(
                  itemToDisplay,
                  this.dropUstensils,
                  "ustensils"
                );
              }
            });
            //  this.badge.badgeEvent( tags, "ustensils")
          });
          if (!searchString.length == 0) {
            const filteredRecipe = this.recipes.filter((result) => {
              if (
                result.ustensils.find((items) => {
                  return items.toLowerCase().includes(searchString);
                }) != undefined
              ) {
                return result;
              }
            });
            new SearchDropDown(filteredRecipe);
          } else {
            new SearchDropDown(this.recipes);
          }
        };
        break;
      default:
        break;
    }
  }
}