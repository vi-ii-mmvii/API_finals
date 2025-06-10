fetch('https://www.thecocktaildb.com/api/json/v1/1/filter.php?c=Cocktail')
  .then(response => response.json())
  .then(data => {
    allDrinks = data.drinks || [];
    currentDrinks = allDrinks;
  })
  .catch(error => console.error(error));