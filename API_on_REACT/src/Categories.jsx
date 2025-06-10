import { useEffect, useState } from 'react';

export default function Categories({ onSelectCategory }) {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetch(`https://www.thecocktaildb.com/api/json/v1/1/list.php?c=list`)
      .then(res => res.json())
      .then(data => {
        const cats = data.drinks.map(d => d.strCategory);
        setCategories(['All', ...cats]);
      })
      .catch(console.error);
  }, []);

  return (
    <div id="categories">
      {categories.map(category => (
        <button
          key={category}
          className="category-btn"
          onClick={() => onSelectCategory(category)}
        >
          {category}
        </button>
      ))}
    </div>
  );
}
