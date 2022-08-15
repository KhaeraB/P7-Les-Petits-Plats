import CardRecipesFactory from "../Factory/CardRecipesFactory.js";
import DropListFactory from "../Factory/DropListFactory.js";
import { closeAllFilter } from "../utils/utils.js";
import { recipes } from "../../data/recipes.js";
let TAGS = [];
const ALL_RECIPES = recipes;
export default class Filter {
  constructor(recipes) {
    this.recipes = recipes;
    this.tagIngredient = document.getElementById("thumbnail-tags-container");
    this.inputIngredient = document.getElementById("search-ingredients");
    this.inputAppliance = document.getElementById("search-appliances");
    this.inputUstensils = document.getElementById("search-ustensils");
    this.input = document.getElementById("find");
    this.arrIngredient = [];
    this.tags = [];
    this.filtred = []
    this.onfocusInput();
  }

  onfocusInput(type) {
    closeAllFilter()
    this.input.onfocus = () => {
      if (type == "ingredients") {
        document
          .querySelector(`.dropdown-list-${type}`)
          .classList.add("d-none");
        document.querySelector(`.${type}`).classList.remove("expanded");
        document
          .querySelector(`.dropdown-list-${type}`)
          .classList.remove("d-none");
      } else if (type == "appliances") {
        document
          .querySelector(`.dropdown-list-${type}`)
          .classList.add("d-none");
        document.querySelector(`.${type}`).classList.remove("expanded");
        document
          .querySelector(`.dropdown-list-${type}`)
          .classList.remove("d-none");
      } else if (type == "ingredients") {
        document
          .querySelector(`.dropdown-list-${type}`)
          .classList.add("d-none");
        document.querySelector(`.${type}`).classList.remove("expanded");
        document
          .querySelector(`.dropdown-list-${type}`)
          .classList.remove("d-none");
      }
    };
  }

  FilterDisplayRecipes() {
    this.onfocusInput();
    this.input.oninput = (e) => {
      const searchString = e.target.value;

      if (searchString.length > 2) {
        let filteredRecipe = this.recipes.filter((result) => {
          
          if (
            result.name.toLowerCase().includes(searchString) ||
            result.description.toLowerCase().includes(searchString) ||
            result.ingredients.find((items) => {
              return items.ingredient.toLowerCase().includes(searchString);
            }) != undefined
          ) {
            return result;
          }
        });
        filteredRecipe = [
          ...new Set(filteredRecipe),
        ];

        const viewCard = new CardRecipesFactory(filteredRecipe);
        viewCard.Recipes();
        new DropListFactory(filteredRecipe);
      } else {
        const viewCard = new CardRecipesFactory(this.recipes);
        viewCard.Recipes();
        new DropListFactory(this.recipes);
      }
    };
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
      this.filtred = [...this.filterBadgeCrossInputprincipal()];
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
    if (TAGS.length == 0) this.filterBadgeCrossInputprincipal();

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

        this.filtred = [...this.filterBadgeCrossInputprincipal()];
        this.filtred = [...new Set(this.filtred)];

        e.currentTarget.parentNode.remove();
        this.filterBadgeCrossInputprincipal();

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
      new DropListFactory(filtred);
      messageAside.classList.add("opened");
    } else {
      // si non j'affiche toute la liste
      const viewCard = new CardRecipesFactory(ALL_RECIPES);
      viewCard.Recipes();
      new DropListFactory(ALL_RECIPES);
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
  filterBadgeCrossInputprincipal() {
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
   filerByInputsAdvanceItem(type) {
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
            new DropListFactory(filteredRecipe);
          } else {
            new DropListFactory(this.recipes);
          }
        };
        break;
      case "appliances":
        this.inputAppliance.oninput = (e) => {
          e.preventDefault();
          e.stopPropagation();
          const searchString = e.target.value;
          this.recipes.forEach((recipe) => {
            const recipeAppliance = recipe.appliance;
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

            new DropListFactory(filteredRecipe);
          } else {
            new DropListFactory(this.recipes);
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
            new DropListFactory(filteredRecipe);
          } else {
            new DropListFactory(this.recipes);
          }
        };
        break;
      default:
        break;
    }
  }
}