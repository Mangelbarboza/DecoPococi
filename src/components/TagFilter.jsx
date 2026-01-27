export default function TagFilter({ titulo = "Filtrar por", tags, selectedTags, onToggle }) {
  if (!tags?.length) return null;

  return (
    <div className="tag-filter-wrap">
      <div className="tag-filter-title">{titulo}</div>

      <div className="tag-filter-container">
        {tags.map((tag) => {
          const active = selectedTags.includes(tag);
          return (
            <button
              key={tag}
              className={`tag-btn ${active ? "active" : ""}`}
              onClick={() => onToggle(tag)}
            >
              {tag}
            </button>
          );
        })}
      </div>
    </div>
  );
}
