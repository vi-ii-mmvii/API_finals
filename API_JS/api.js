let allDrinks = [];
let currentDrinks = [];
let currentPage = 1;
const drinksPerPage = 6;

// Начальная загрузка
fetch('https://www.thecocktaildb.com/api/json/v1/1/filter.php?c=Cocktail')
  .then(response => response.json())
  .then(data => {
    allDrinks = data.drinks || [];
    currentDrinks = allDrinks;
    drinks();
    categoriestype();
    pagination();
  })
  .catch(error => console.error(error));

// Отображение напитков
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

// Загрузка категорий
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

// Поиск
document.getElementById('search').addEventListener('input', e => {
  const value = e.target.value.toLowerCase();
  currentDrinks = allDrinks.filter(drink =>
    drink.strDrink.toLowerCase().includes(value)
  );
  currentPage = 1;
  drinks();
  pagination();
});

// Случайный напиток (кнопка)
document.getElementById('random').addEventListener('click', () => {
  const randomIndex = Math.floor(Math.random() * allDrinks.length);
  const randomDrink = allDrinks[randomIndex];
  fetchDrinkDetails(randomDrink.idDrink);
});

// Пагинация
function pagination() {
  const pagination = document.getElementById('pagination');
  const pages = Math.ceil(currentDrinks.length / drinksPerPage);

  pagination.innerHTML = '';
  for (let i = 1; i <= pages; i++) {
    const btn = document.createElement('button');
    btn.className = 'page-btn';
    btn.textContent = i;
    btn.dataset.page = i;
    btn.addEventListener('click', e => {
      currentPage = Number(e.target.dataset.page);
      drinks(); 
    });
    pagination.appendChild(btn);
  }
}

// Подробности напитка
function fetchDrinkDetails(id) {
  fetch(`https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${id}`)
    .then(response => response.json())
    .then(data => {
      const drink = data.drinks[0];
      displayDrinkDetails(drink);
    })
    .catch(error => console.error(error));
}

function displayDrinkDetails(drink) {
  const drinkList = document.getElementById('list');

  const ingredients = [];
  for (let i = 1; i <= 15; i++) {
    const ingredient = drink[`strIngredient${i}`];
    const measure = drink[`strMeasure${i}`];
    if (ingredient && ingredient.trim() !== '') {
      ingredients.push({
        ingredient,
        measure: measure || ''
      });
    }
  }

  drinkList.innerHTML = `
    <article class="item">
      <div class="drink-image">
        <img src="${drink.strDrinkThumb}" alt="${drink.strDrink}" style="max-height: 400px; max-width: 100%;">
        <h2>${drink.strDrink}</h2>
      </div>
      <div class="drink-details">
        <h3>Instructions</h3>
        <p>${drink.strInstructions || "No instructions available."}</p>
        
        <div class="ingredients-list">
          <h3>Ingredients</h3>
          <ul>
            ${ingredients.map(item => 
              `<li>${item.ingredient}${item.measure ? ' - ' + item.measure : ''}</li>`
            ).join('')}
          </ul>
        </div>
        
        <button id="backBtn">Back to List</button>
      </div>
    </article>
  `;

  document.getElementById('backBtn').addEventListener('click', () => {
    drinks();
    pagination();
  });
}
