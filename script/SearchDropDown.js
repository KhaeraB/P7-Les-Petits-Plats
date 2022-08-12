import { normalizeString, toggle, removeListItem } from "./utils/utils.js";
import CardRecipesFactory from "./Factory/CardRecipesFactory.js";
import {recipes } from "../data/recipes.js"
let tags = [];
let allRecipes = recipes
export default class SearchDropDown {
  constructor(recipes) {
    //console.log('je suis ici  sorted', recipes.length)
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
   
 
  }

  generateItems(tab, domBlock, type) {
    removeListItem(type);
    this.filerByType(type);
    tab.forEach((item) => {
      const itemNormalized = normalizeString(item);
      const listDOM = document.createElement("li");
      listDOM.classList.add("list-items", `${type}-item`);
      listDOM.setAttribute("id", "tag");
      listDOM.setAttribute("data-item", `${itemNormalized}`);
      listDOM.setAttribute("data-type", `${itemNormalized}`);
      listDOM.innerText = item[0].toUpperCase() + item.slice(1);
      //console.log(listDOM)
      listDOM.addEventListener("click", () => this.addBadge(type, item));
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
          //  console.log("ici");
          console.log("IndisplayITEM RECIPES", this.recipes.length);
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
          //     console.log("ici");

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
  addBadge(filter, badgeText) {
    // toggle(filter)
    let filtred = [];
    //console.log(document.querySelector("#thumbnail-tags-container"))
    // console.log("filter , badgeText :", filter + " ", badgeText);

    if (!tags.includes(badgeText)) {
      tags.push(badgeText);
      const tagBadge = `
      <div id="tagItem" class="thumbnailTag thumbnail tags_${filter}" data-value ="${badgeText}">
          <button id="btn-${filter}" >${badgeText}</button>
          <i class="far fa-times-circle" data-type="${filter}"></i>
      </div>`;

      let currentTag = document.querySelector("#thumbnail-tags-container");

      currentTag.innerHTML += tagBadge;
     
      filtred = [...this.filterList(filter)];
      filtred = [
        ...new Set(filtred),
      ];
      this.buildNewListRecipes(filtred);

      const close = document.getElementsByClassName(`fa-times-circle`);
      for (let closeItem of close) {
        closeItem.addEventListener("click", (e) => {
          const textContent =
            e.currentTarget.parentNode.getAttribute("data-value");
          const tagType = e.currentTarget.getAttribute("data-type");
          console.log("tagType: " + tagType + " " + textContent);

          tags = tags.filter((tag) => tag != textContent);

          // appel des CARD avec des fonctions filtrer par rapport au tags selectionné / Je boucle sur toute les recipes et je regarde si recipies.ingredient inclus dans tableau des tags view card avec filerRecipes

          filtred = [...this.filterList(tagType)];

         this.buildNewListRecipes(filtred);
          e.currentTarget.parentNode.remove();
        });
      }
    }
  }

  // INITIALIZE LIST CARD_RECIPES
  buildNewListRecipes(filtred) {
    //console.log("list filtrée est : ", tags);
    console.log("ici tags", tags)
    if (tags.length != 0) {
      const viewCard = new CardRecipesFactory(filtred);
      viewCard.Recipes();
      console.log("dans la condition",filtred);
      new SearchDropDown(filtred)
    }else{
      const viewCard = new CardRecipesFactory(allRecipes);
      viewCard.Recipes();
      new SearchDropDown(allRecipes)
    }
    
    
  }

  filterList(tagType) {
    let filtredRecipes = new Set(this.recipes);
    let  RecipesByBadges = new Set()
    console.log("changement?",this.recipes)
    tags.forEach((tag) => {
      this.recipes.filter((recette) => {
        // je fais un lowercase sur tag.value pour bien comparer ensuite
        tag = tag.toLowerCase();

        // INGREDIENTS

        if (tagType == "ingredients") {
          let ingredientfounded = false;

          for (let i = 0; i < recette.ingredients.length; i++) {
            if (recette.ingredients[i].ingredient.toLowerCase() == tag) {
              ingredientfounded = true;
              break
            }
          
          }
          if (ingredientfounded == true) {
            RecipesByBadges.add(recette);
            return recette;
          }
          new SearchDropDown([...filtredRecipes])

        }
        // APPAREILS

        if (tagType == "appliances") {
          let appreilfounded = false;

          for (let i = 0; i < recette.appliance.length; i++) {
            if (recette.appliance.toLowerCase() == tag) {
              appreilfounded = true;
              break
            }
          
          }
          if (appreilfounded == true) {
            RecipesByBadges.add(recette);
            return recette;
          }
        }
        // USTENSILES
        if (tagType == "ustensils") {
          console.log("supp", tagType)
          let ustensilsfounded = false;

          for (let i = 0; i < recette.ustensils.length; i++) {
            if (recette.ustensils[i].toLowerCase() == tag) {
              ustensilsfounded = true;
              break
            }
         
          }
          if (ustensilsfounded == true) {
            RecipesByBadges.add(recette);
            return recette;
          }
        }
      });
    });
    console.log("HAS", RecipesByBadges)
    let intersectRecipes = new Set();
    
    for (let recipe of RecipesByBadges) {
      if (filtredRecipes.has(recipe)) intersectRecipes.add(recipe);
     // console.log("interce", intersectRecipes)
    }

    // intersect recipesHasKeyWord with actual filteredRecipes:
    filtredRecipes = new Set([...intersectRecipes]);

   // const viewCard = new CardRecipesFactory([...filtredRecipes]);
    //viewCard.Recipes();

   

    return filtredRecipes;
  }
  
  filerByType(type) {
    let tableauIngredients = [];
    let tableauUstensils = [];
    let tableauAppliances = [];
    let itemToDisplay = [];
    switch (type) {
      case "ingredients":
        this.inputIngredient.oninput = (e) => {
          e.preventDefault();
          e.stopPropagation();
          // this.filter.onfocusInput("ingredients");
          const searchString = e.target.value;
          this.recipes.forEach((recipe) => {
            const recipeIngredients = recipe.ingredients;
            recipeIngredients.forEach((ingredients) => {
              //  console.log(ingredients)
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

              //  this.badge.badgeEvent( tags, "ingredients")
            });
          });

          if (!searchString.length == 0) {
            const filteredRecipe = this.recipes.filter((result) => {
              console.log("RR", searchString.length);
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
          // this.filter.onfocusInput("appliances");
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

            //  this.badge.badgeEvent( tags, "appliances")
          });

          //   console.log(itemToDisplay);
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
              console.log("RR", searchString.length);
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
