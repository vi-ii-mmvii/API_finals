import { useState, useEffect } from 'react';
import useFetch from './Hook.jsx';
import Categories from './Categories.jsx';
import Search from './Search.jsx';
import DrinkList from './DrinkList.jsx';

const drinksPerPage = 6;

export default function App() {
  const [currentUrl, setCurrentUrl] = useState(
    'https://www.thecocktaildb.com/api/json/v1/1/filter.php?c=Cocktail'
  );
  const { data, loading, error, refetch } = useFetch(currentUrl);

  // полный список напитков (для поиска)
  const [allDrinks, setAllDrinks] = useState([]);
  // напитки для показа (пагинация, фильтры)
  const [currentDrinks, setCurrentDrinks] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedDrink, setSelectedDrink] = useState(null);

  // При изменении data обновляем списки
  useEffect(() => {
    if (data?.drinks) {
      setAllDrinks(data.drinks);
      setCurrentDrinks(data.drinks);
      setCurrentPage(1);
    }
  }, [data]);

  // Функция для обработки выбора категории
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

  // Поиск по текущему списку напитков
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

  // Функция для возврата назад из деталей напитка
  const handleBack = () => {
    setSelectedDrink(null);
  };

  if (loading) return <p>Загрузка...</p>;
  if (error) return <p>Ошибка: {error.message}</p>;

  return (
    <div style={{ padding: 20 }}>
      <h1>Коктейли</h1>

      {selectedDrink ? (
        <div id="drink-details">
          <h2>{selectedDrink.strDrink}</h2>
          <img
            src={selectedDrink.strDrinkThumb}
            alt={selectedDrink.strDrink}
          />
          <p>{selectedDrink.strInstructions || 'Инструкция отсутствует.'}</p>
          <button>
            Назад
          </button>
        </div>
      ) : (
        <>
          <Search onSearch={handleSearch} />
          <Categories onSelectCategory={handleCategoryFilter} />
          <DrinkList drinks={drinksToShow} />
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
