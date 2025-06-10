import { useState } from 'react';
import useFetch from './Hook.jsx';
import Categories from './Categories.jsx';

export default function App() {
  const { data, loading, error } = useFetch('https://www.thecocktaildb.com/api/json/v1/1/filter.php?c=Cocktail');
  const [filteredDrinks, setFilteredDrinks] = useState(null);

  const handleCategorySelect = (category) => {
    if (category === 'All') {
      setFilteredDrinks(null);
    } else {
      fetch(`https://www.thecocktaildb.com/api/json/v1/1/filter.php?c=${encodeURIComponent(category)}`)
        .then(res => res.json())
        .then(data => setFilteredDrinks(data.drinks))
        .catch(console.error);
    }
  };

  if (loading) return <p>Загрузка...</p>;
  if (error) return <p>Ошибка: {error.message}</p>;

  const drinksToShow = filteredDrinks || data?.drinks || [];

  return (
    <div>
      <h1>Коктейли</h1>
      <Categories onSelectCategory={handleCategorySelect} />
      <ul>
        {drinksToShow.map(drink => (
          <li key={drink.idDrink}>{drink.strDrink}</li>
        ))}
      </ul>
    </div>
  );
}