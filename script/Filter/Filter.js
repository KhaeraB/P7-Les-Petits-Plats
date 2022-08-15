import CardRecipesFactory from "../Factory/CardRecipesFactory.js";
import DropListFactory from "../DropListFactory.js";
import { normalizeString,  closeAllFilter } from "../utils/utils.js";
export default class Filter {
  constructor(recipes) {
    this.recipes = recipes;
    this.input = document.getElementById("find");
    this.arrIngredient = [];
    this.tags = [];
    this.onfocusInput;
    this.inputIngredient = document.getElementById("search-ingredients");
    this.inputAppliance = document.getElementById("search-appliances");
    this.inputUstensils = document.getElementById("search-ustensils");
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
      var searchString = e.target.value;
      if (searchString.length > 2) {
        const recipesFiltered = [];
        for (let recipe of this.recipes) {
          if (
            recipe.name.toLowerCase().includes(searchString) ||
            recipe.description.toLowerCase().includes(searchString)
          ) {
            recipesFiltered.push(recipe);
          }
          for (let ingredients of recipe.ingredients) {
            const ingredient = normalizeString(ingredients.ingredient);
            if (ingredient.includes(searchString)) {
              recipesFiltered.push(recipe);
            }
          }
        }
        console.log(recipesFiltered);
        const viewCard = new CardRecipesFactory([...new Set(recipesFiltered)]);
        viewCard.Recipes();

        new SearchDropDown([...new Set(recipesFiltered)]);
        
      }
      if (searchString.length <= 2) {
        const viewCard = new CardRecipesFactory(this.recipes);
        viewCard.Recipes();

         new SearchDropDown(this.recipes);
        
      }
    };
  }
}
