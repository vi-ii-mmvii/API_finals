export default function DrinkList({ drinks, onSelect }) {
    return (
      <div id="list">
        {drinks.map(drink => (
          <article
            key={drink.idDrink}
            className="item"
            onClick={() => onSelect(drink.idDrink)}
          >
            <img
              src={drink.strDrinkThumb}
              alt={drink.strDrink}
            />
            <h4>{drink.strDrink}</h4>
          </article>
        ))}
      </div>
    );
  }
  