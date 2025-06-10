export default function Search({ onSearch }) {
    return (
      <div>
        <input id="search"
        input="text"
          placeholder="Прошу, к вашим услугам, поисковичок"
          onChange={(e) => onSearch(e.target.value)}
        />
      </div>
    );
  }