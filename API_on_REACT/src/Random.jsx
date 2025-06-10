import React from 'react';

export default function Random({ allDrinks, onSelectRandom }) {
  const handleRandomClick = () => {
    if (!allDrinks || allDrinks.length === 0) return;
    const randomIndex = Math.floor(Math.random() * allDrinks.length);
    const randomDrink = allDrinks[randomIndex];
    onSelectRandom(randomDrink.idDrink);
  };

  return (
    <button id="random" onClick={handleRandomClick}>
      Random
    </button>
  );
}
