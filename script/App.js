import {recipes} from "../data/recipes.js";
import CardRecipesFactory from "./Factory/CardRecipesFactory.js";
import Filter from "./Filter/Filter.js";
import DropList from './Factory/DropListFactory.js'
import { SearchResultMessage } from "./utils/SearchResultMessage.js";

export default class App {
    constructor() {
        this.recipes = recipes
        this.input = document.getElementById("find")
        this.tag = document.getElementById("tag")
        this.close = document.querySelector('.fa-times-circle')
       new SearchResultMessage(this.recipes);

    }
 
   

    displayAllRecipes() {
        const viewCard = new CardRecipesFactory(this.recipes)
        viewCard.Recipes()

    }

    displaySortInput() {
        const sort = new Filter(this.recipes)
        sort.FilterDisplayRecipes()
    }

    displayDropDown(){
        return new DropList(this.recipes)
    }

}

// affichage dans la View
const app = new App()
app.displayAllRecipes()
app.displaySortInput()
app.displayDropDown()