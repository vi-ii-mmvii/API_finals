export default function Search({ onSearch }) {
    return (
      <div>
        <input
          type="text"
          placeholder="Прошу, к вашим услугам, поисковичок"
          onChange={(e) => onSearch(e.target.value)}
        />
      </div>
    );
  }