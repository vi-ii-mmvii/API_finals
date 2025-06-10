import useFetch from './Hook.jsx';

export default function App() {
  const { data, loading, error } = useFetch('https://www.thecocktaildb.com/api/json/v1/1/filter.php?c=Cocktail');

  if (loading) return <p>Загрузка</p>;
  if (error) return <p>Ошибка: {error.message}</p>;

  return (
    <div>
      <h1>Коктейли</h1>
      <ul>
        {data?.drinks?.map(drink => (
          <li key={drink.idDrink}>{drink.strDrink}</li>
        ))}
      </ul>
    </div>
  );
}