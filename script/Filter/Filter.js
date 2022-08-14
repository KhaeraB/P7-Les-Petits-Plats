import CardRecipesFactory from "../Factory/CardRecipesFactory.js";
import SearchDropDown from "../SearchDropDown.js";
import { closeAllFilter } from "../utils/utils.js";
export default class Filter {
  constructor(recipes) {
    this.recipes = recipes;
    this.input = document.getElementById("find");
    this.arrIngredient = [];
    this.tags = [];
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
        new SearchDropDown(filteredRecipe);
      } else {
        const viewCard = new CardRecipesFactory(this.recipes);
        viewCard.Recipes();
        new SearchDropDown(this.recipes);
      }
    };
  }
  
}