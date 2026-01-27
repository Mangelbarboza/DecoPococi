import { useMemo, useState } from "react";

export default function ProductCard({ product, phone = "50686714763", onOpenImage }) {
  const images = useMemo(() => {
    if (product.imagenes?.length) return product.imagenes;
    return ["https://via.placeholder.com/800x600?text=Sin+Foto"];
  }, [product.imagenes]);

  const [idx, setIdx] = useState(0);

  const prev = () => setIdx((v) => (v - 1 + images.length) % images.length);
  const next = () => setIdx((v) => (v + 1) % images.length);

  const msg = encodeURIComponent(`Hola, me interesa: ${product.nombre}`);

  return (
    <article className="product-card">
      <div className="carousel">
        <img
          src={images[idx]}
          alt={product.nombre}
          className="card-image"
          onClick={() => onOpenImage(images, idx)}
        />

        {images.length > 1 && (
          <>
            <button className="carousel-btn left" onClick={prev} aria-label="Anterior">
              ‹
            </button>
            <button className="carousel-btn right" onClick={next} aria-label="Siguiente">
              ›
            </button>

            <div className="carousel-dots">
              {images.map((_, i) => (
                <span key={i} className={`dot ${i === idx ? "active" : ""}`} />
              ))}
            </div>
          </>
        )}
      </div>

      <div className="card-info">
        <h3 className="card-title">{product.nombre}</h3>

        {product.etiquetas?.length > 0 && (
          <div className="badge-row">
            {product.etiquetas.slice(0, 4).map((t) => (
              <span key={t} className="badge">
                {t}
              </span>
            ))}
          </div>
        )}

        <p className="card-description">{product.descripcion || "Sin descripción por ahora."}</p>

        <a
          href={`https://wa.me/${phone}?text=${msg}`}
          target="_blank"
          rel="noreferrer"
          className="whatsapp-btn"
        >
          Cotizar
        </a>
      </div>
    </article>
  );
}
