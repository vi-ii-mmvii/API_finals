import { useState, useEffect } from 'react';
import useFetch from './Hook.jsx';
import Categories from './Categories.jsx';
import Search from './Search.jsx';
import DrinkList from './DrinkList.jsx';
import Random from './Random.jsx';

const drinksPerPage = 6;

export default function App() {
  const [currentUrl, setCurrentUrl] = useState(
    'https://www.thecocktaildb.com/api/json/v1/1/filter.php?c=Cocktail'
  );
  const { data, loading, error } = useFetch(currentUrl);

  const [allDrinks, setAllDrinks] = useState([]);
  const [currentDrinks, setCurrentDrinks] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedDrink, setSelectedDrink] = useState(null);

  useEffect(() => {
    if (data?.drinks) {
      setAllDrinks(data.drinks);
      setCurrentDrinks(data.drinks);
      setCurrentPage(1);
    }
  }, [data]);

  const handleCategoryFilter = category => {
    if (category === 'All') {
      setCurrentUrl(
        'https://www.thecocktaildb.com/api/json/v1/1/filter.php?c=Cocktail'
      );
    } else {
      setCurrentUrl(
        `https://www.thecocktaildb.com/api/json/v1/1/filter.php?c=${encodeURIComponent(
          category
        )}`
      );
    }
    setSelectedDrink(null);
  };

  const handleSearch = query => {
    if (!query.trim()) {
      setCurrentDrinks(allDrinks);
      setCurrentPage(1);
      return;
    }
    const filtered = allDrinks.filter(drink =>
      drink.strDrink.toLowerCase().includes(query.toLowerCase())
    );
    setCurrentDrinks(filtered);
    setCurrentPage(1);
  };

  // Функция для получения деталей напитка по id
  const handleDrinkClick = (id) => {
    fetch(`https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${id}`)
      .then(res => res.json())
      .then(data => setSelectedDrink(data.drinks[0]))
      .catch(console.error);
  };

  const handleBack = () => {
    setSelectedDrink(null);
  };

  const totalPages = Math.ceil(currentDrinks.length / drinksPerPage);
  const start = (currentPage - 1) * drinksPerPage;
  const end = start + drinksPerPage;
  const drinksToShow = currentDrinks.slice(start, end);

  if (loading) return <p>Загрузка...</p>;
  if (error) return <p>Ошибка: {error.message}</p>;

  return (
    <div>
      <h1>Коктейли</h1>

      {selectedDrink ? (
        <div id="drink-details">
          <h2>{selectedDrink.strDrink}</h2>
          <img
            src={selectedDrink.strDrinkThumb}
            alt={selectedDrink.strDrink}
          />
          <p>{selectedDrink.strInstructions || 'Инструкция отсутствует.'}</p>
          <button onClick={handleBack}>Назад</button>
        </div>
      ) : (
        <>
          <Search onSearch={handleSearch} />
          <Random allDrinks={allDrinks} onSelectRandom={handleDrinkClick} />
          <Categories onSelectCategory={handleCategoryFilter} />
          <DrinkList drinks={drinksToShow} onSelect={handleDrinkClick} />
          <div>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
