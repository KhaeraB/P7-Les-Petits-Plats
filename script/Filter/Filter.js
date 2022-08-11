import CardRecipesFactory from "../Factory/CardRecipesFactory.js";
import SearchDropDown from "../SearchDropDown.js";
export default class Filter {
  constructor(recipes) {
    this.recipes = recipes
    this.input = document.getElementById("find")
    this.arrIngredient = []
    this.tags = []
    this.onfocusInput
    this.filerByType()
  }
  onfocusInput(type) {
    this.input.onfocus = () => {
      if (type == "ingredients") {
        document
          .querySelector(`.dropdown-list-${type}`)
          .classList.add("d-none")
        document.querySelector(`.${type}`).classList.remove("expanded")
        document
          .querySelector(`.dropdown-list-${type}`)
          .classList.remove("d-none")
      } else if (type == "appliances") {
        document
          .querySelector(`.dropdown-list-${type}`)
          .classList.add("d-none")
        document.querySelector(`.${type}`).classList.remove("expanded")
        document
          .querySelector(`.dropdown-list-${type}`)
          .classList.remove("d-none")
      } else if (type == "ingredients") {
        document
          .querySelector(`.dropdown-list-${type}`)
          .classList.add("d-none")
        document.querySelector(`.${type}`).classList.remove("expanded")
        document
          .querySelector(`.dropdown-list-${type}`)
          .classList.remove("d-none")
      }
    }
  }
 

  FilterDisplayRecipes() {
    this.onfocusInput()
    this.input.oninput = (e) => {
      const searchString = e.target.value
      console.log(searchString)

      if (searchString.length > 2) {
        const filteredRecipe = this.recipes.filter((result) => {
          console.log("RR", searchString.length)

          if (
            result.name.toLowerCase().includes(searchString) ||
            result.description.toLowerCase().includes(searchString) ||
            result.ingredients.find((items) => {
              return items.ingredient.toLowerCase().includes(searchString)
            }) != undefined
          ) {
            return result
          }
        })
        const viewCard = new CardRecipesFactory(filteredRecipe)
        viewCard.Recipes()
        new SearchDropDown(filteredRecipe)
     
      } else {
        const viewCard = new CardRecipesFactory(this.recipes)
        viewCard.Recipes()
        new SearchDropDown(this.recipes)
      }
    };
  } 
  filerByType(){
    const inputIngredient = document.querySelector("#search-ingredients")
    const inputAppliance = document.querySelector("#search-appliances")
    const inputUstensils = document.querySelector("#search-ustensils")
    inputIngredient.addEventListener("input", (e) => {
      const inputValue = e.target.value.toLowerCase()
      console.log(inputValue)
      const items = document.querySelectorAll(".ingredients-item")
      
      for (let i = 0; i < items.length; i++) {
        if (!items[i].innerHTML.toLowerCase().includes(inputValue)) {
          items[i].style.display = "none"
        } else {
          items[i].style.display = "list-item"
        }
      }
    })
    inputAppliance.addEventListener("input", (e) => {
      const inputValue = e.target.value.toLowerCase()
      console.log(inputValue)
      const items = document.querySelectorAll(".appliances-item")
      console.log(items)
      for (let i = 0; i < items.length; i++) {
        if (!items[i].innerHTML.toLowerCase().includes(inputValue)) {
          items[i].style.display = "none"
        } else {
          items[i].style.display = "list-item"
        }
      }
    })

    inputUstensils.addEventListener("input", (e)=> {
      const inputValue = e.target.value.toLowerCase()
      // console.log(inputValue)
      const items = document.querySelectorAll(".ustensils-item")
      //console.log(items)
      for (let i = 0; i < items.length; i++) {
        if (!items[i].innerHTML.toLowerCase().includes(inputValue)) {
          items[i].style.display = "none"
        } else {
          items[i].style.display = "flex"
        }
      }
    })
  }
}