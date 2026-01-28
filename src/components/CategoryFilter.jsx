import { useEffect, useRef } from "react";

export default function CategoryFilter({
  categorias,
  categoriaActiva,
  onSelect,
  hidden = false,
}) {
  const railRef = useRef(null);

  useEffect(() => {
    const rail = railRef.current;
    if (!rail) return;

    let isDown = false;
    let startX = 0;
    let scrollLeft = 0;

    const onMouseDown = (e) => {
      // Solo click izquierdo
      if (e.button !== 0) return;
      isDown = true;
      rail.classList.add("is-dragging");
      startX = e.pageX - rail.offsetLeft;
      scrollLeft = rail.scrollLeft;
    };

    const onMouseLeave = () => {
      isDown = false;
      rail.classList.remove("is-dragging");
    };

    const onMouseUp = () => {
      isDown = false;
      rail.classList.remove("is-dragging");
    };

    const onMouseMove = (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - rail.offsetLeft;
      const walk = (x - startX) * 1.2; // “sensibilidad”
      rail.scrollLeft = scrollLeft - walk;
    };

    rail.addEventListener("mousedown", onMouseDown);
    rail.addEventListener("mouseleave", onMouseLeave);
    rail.addEventListener("mouseup", onMouseUp);
    rail.addEventListener("mousemove", onMouseMove);

    return () => {
      rail.removeEventListener("mousedown", onMouseDown);
      rail.removeEventListener("mouseleave", onMouseLeave);
      rail.removeEventListener("mouseup", onMouseUp);
      rail.removeEventListener("mousemove", onMouseMove);
    };
  }, []);

  return (
    <div className={`category-filter-container ${hidden ? "is-hidden" : ""}`}>
      <div className="category-rail" ref={railRef}>
        {categorias.map((cat) => (
          <button
            key={cat}
            className={`cat-btn ${categoriaActiva === cat ? "active" : ""}`}
            onClick={() => onSelect(cat)}
            type="button"
            // Evita que un “drag” dispare click accidental (funciona bien en la práctica)
            onMouseDown={(e) => e.stopPropagation()}
          >
            {cat}
          </button>
        ))}
      </div>
    </div>
  );
}
