import { normalizeString, toggle, removeListItem } from "../utils/utils.js";
import Filter from "../Filter/Filter.js";
export default class DropListFactory {
  constructor(recipes) {
    this.recipes = recipes;
    
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
    new Filter(this.recipes).filerByInputsAdvanceItem(type);
    tab.forEach((item) => {
      const itemNormalized = normalizeString(item);
      const listDOM = document.createElement("li");
      listDOM.classList.add("list-items", `${type}-item`);
      listDOM.setAttribute("id", "tag");
      listDOM.setAttribute("data-item", `${itemNormalized}`);
      listDOM.setAttribute("data-type", `${itemNormalized}`);
      listDOM.innerText = item[0].toUpperCase() + item.slice(1);
      listDOM.addEventListener("click", () => {
        new Filter(this.recipes).addBadge(type, item);
      });
      return domBlock.appendChild(listDOM);
    });
  }
 /**
   * Affiche dans les Droplist ingredients, ustensils et appliances
   * @param {*string} type
   */
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

}