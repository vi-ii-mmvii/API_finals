export default function Search({ onSearch }) {
    return (
      <div>
        <input
          type="text"
          placeholder="Поиск коктейлей..."
          onChange={(e) => onSearch(e.target.value)}
        />
      </div>
    );
  }