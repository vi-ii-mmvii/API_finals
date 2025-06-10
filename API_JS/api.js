let allDrinks = [];
let currentDrinks = [];
let currentPage = 1;
const drinksPerPage = 6;

// Загрузка напитков (без рецептов)


fetch('https://www.thecocktaildb.com/api/json/v1/1/filter.php?c=Cocktail')
  .then(response => response.json())
  .then(data => {
    allDrinks = data.drinks || [];
    currentDrinks = allDrinks;
  })
  .catch(error => console.error(error));



//1
function drinks() {
  const drinksList = document.getElementById('list');
  const start = (currentPage - 1) * drinksPerPage;
  const end = start + drinksPerPage;
  const drinksToShow = currentDrinks.slice(start, end);

  drinksList.innerHTML = drinksToShow.map(drink => `
    <article class="item" data-id="${drink.idDrink}">
      <img src="${drink.strDrinkThumb}" alt="${drink.strDrink}" style="height: 150px;">
      <h4>${drink.strDrink}</h4>
    </article>
  `).join('');

  document.querySelectorAll('.item').forEach(item => {
    item.addEventListener('click', () => {
      const drinkId = item.getAttribute('data-id');
      fetchDrinkDetails(drinkId);
    });
  });
}



// Загрузка и отображение категорий
//2

function categoriestype() {
  const categoriesDiv = document.getElementById('categories');

  fetch(`https://www.thecocktaildb.com/api/json/v1/1/list.php?c=list`)
    .then(response => response.json())
    .then(data => {
      const categories = data.drinks.map(obj => obj.strCategory);
      categories.unshift('All');

      categoriesDiv.innerHTML = categories.map(obj =>
        `<button class="category-btn" data-category="${obj}">${obj}</button>`
      ).join('');

      categoriesDiv.querySelectorAll('.category-btn').forEach(btn => {
        btn.addEventListener('click', e => {
          filterByCategory(e.target.dataset.category);
        });
      });
    })
    .catch(error => console.error(error));
}



// Фильтрация по категории (загрузка заново)
function filterByCategory(category) {
  if (category === 'All') {
    currentDrinks = allDrinks;
    currentPage = 1;
    drinks();
    pagination();
  } else {
    fetch(`https://www.thecocktaildb.com/api/json/v1/1/filter.php?c=${encodeURIComponent(category)}`)
      .then(response => response.json())
      .then(data => {
        currentDrinks = data.drinks || [];
        currentPage = 1;
        drinks();
        pagination();
      })
      .catch(error => console.error(error));
  }
}

// Случайный напиток
const randomBtn = document.getElementById('random');
randomBtn.addEventListener('click', () => {
  const randomIndex = Math.floor(Math.random() * allDrinks.length);
  const randomDrink = allDrinks[randomIndex];
  fetchDrinkDetails(randomDrink.idDrink);
});


// Поиск по названию
const searchInput = document.getElementById('search');
searchInput.addEventListener('input', e => {
  const value = e.target.value.toLowerCase();
  currentDrinks = allDrinks.filter(drink =>
    drink.strDrink.toLowerCase().includes(value)
  );
  currentPage = 0;
  pagination();
});