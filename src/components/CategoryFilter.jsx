export default function CategoryFilter({ categorias, categoriaActiva, onSelect }) {
  return (
    <div className="category-filter-container">
      {categorias.map((cat) => (
        <button
          key={cat}
          className={`cat-btn ${categoriaActiva === cat ? "active" : ""}`}
          onClick={() => onSelect(cat)}
        >
          {cat}
        </button>
      ))}
    </div>
  );
}
