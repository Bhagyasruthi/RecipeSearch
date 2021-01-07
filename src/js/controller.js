import * as model from './model.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';

import 'core-js/stable';
import 'regenerator-runtime';
import { async } from 'regenerator-runtime';

// https://forkify-api.herokuapp.com/v2
//if (module.hot) {
//module.hot.accept();
//}
const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);

    if (!id) return;
    recipeView.renderSpinner();
    // Loading Recipe
    await model.loadRecipe(id);

    //Rendering Recipe
    recipeView.render(model.state.recipe);
  } catch (err) {
    recipeView.renderError();
  }
};

const controlSearchResults = async function () {
  try {
    resultsView.renderSpinner();

    // 1) Get search query
    const query = searchView.getQuery();
    if (!query) return;

    // 2) Load search results
    await model.loadSearchResults(query);

    // 3)Render Results
    //resultsView.render(model.state.search.results);

    resultsView.render(model.getSearchResultsPage());

    // 4)Render inital pagination buttons
    paginationView.render(model.state.search);
  } catch (err) {
    console.log(err);
  }
};
const controlPagination = function (goToPage) {
  // Render New Results
  resultsView.render(model.getSearchResultsPage(goToPage));

  // Render new  pagination buttons
  paginationView.render(model.state.search);
};

const controlServings = function (newServings) {
  //Update the Recipe servings(in state)
  model.updateServings(newServings);
  //Updating the Recipe View
  recipeView.render(model.state.recipe);
};

const init = function () {
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
};
init();
