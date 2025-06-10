import useFetch from './Hook.jsx';

export default function Categories({ onSelectCategory }) {
  const { data, loading, error } = useFetch('https://www.thecocktaildb.com/api/json/v1/1/list.php?c=list');

  if (loading) return <p>Загрузка категорий...</p>;
  if (error) return <p>Ошибка загрузки: {error.message}</p>;

  const categories = ['All', ...(data?.drinks?.map(cat => cat.strCategory) || [])];

  return (
    <div>
      {categories.map(category => (
        <button key={category} onClick={() => onSelectCategory(category)}>
          {category}
        </button>
      ))}
    </div>
  );
}
