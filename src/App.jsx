import { useEffect, useMemo, useState } from "react";
import { client } from "./client";
import "./App.css";

import Header from "./components/Header.jsx";
import CategoryFilter from "./components/CategoryFilter.jsx";
import TagFilter from "./components/TagFilter.jsx";
import ProductCard from "./components/ProductCard.jsx";
import ImageModal from "./components/ImageModal.jsx";

import { normalizeProductEntry } from "./utils/contentful.js";

const BASE_CATS = ["Todos", "Persianas", "Cortinas", "Servicios", "Alfombras", "Muebles"];

export default function App() {
  const [productos, setProductos] = useState([]);
  const [categoriaActiva, setCategoriaActiva] = useState("Todos");
  const [tagsActivos, setTagsActivos] = useState([]);

  // Modal global (1 solo)
  const [modalOpen, setModalOpen] = useState(false);
  const [modalSrc, setModalSrc] = useState("");
  const [modalAlt, setModalAlt] = useState("");

  const openModal = (src, alt) => {
    setModalSrc(src);
    setModalAlt(alt);
    setModalOpen(true);
  };

  const closeModal = () => setModalOpen(false);

  useEffect(() => {
    client
      .getEntries({ content_type: "producto" })
      .then((response) => {
        const normalized = (response.items ?? []).map(normalizeProductEntry);
        setProductos(normalized);
      })
      .catch((err) => console.error(err));
  }, []);

  // Categorías: usa base + detectadas
  const categorias = useMemo(() => {
    const found = new Set();
    productos.forEach((p) => p.categorias.forEach((c) => found.add(c)));

    const rest = [...found].filter((c) => !BASE_CATS.includes(c)).sort();
    return [...BASE_CATS, ...rest];
  }, [productos]);

  // Filtro por categoría (ya viene canonicalizada desde normalizeProductEntry)
  const productosPorCategoria = useMemo(() => {
    if (categoriaActiva === "Todos") return productos;
    return productos.filter((p) => p.categorias.includes(categoriaActiva));
  }, [productos, categoriaActiva]);

  // Tags disponibles según categoría
  const tagsDisponibles = useMemo(() => {
    const s = new Set();
    productosPorCategoria.forEach((p) => p.etiquetas.forEach((t) => s.add(t)));
    return [...s].sort();
  }, [productosPorCategoria]);

  // Filtro incremental por tags (AND)
  const productosFiltrados = useMemo(() => {
    if (!tagsActivos.length) return productosPorCategoria;
    return productosPorCategoria.filter((p) =>
      tagsActivos.every((t) => p.etiquetas.includes(t))
    );
  }, [productosPorCategoria, tagsActivos]);

  const onSelectCategoria = (cat) => {
    setCategoriaActiva(cat);
    setTagsActivos([]); // reset tags al cambiar categoría
  };

  const onToggleTag = (tag) => {
    setTagsActivos((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  return (
    <div className="app-container">
      <Header />

      <CategoryFilter
        categorias={categorias}
        categoriaActiva={categoriaActiva}
        onSelect={onSelectCategoria}
      />

      {categoriaActiva !== "Todos" && (
        <TagFilter
          titulo="Subcategorías / Variantes"
          tags={tagsDisponibles}
          selectedTags={tagsActivos}
          onToggle={onToggleTag}
        />
      )}

      <main className="catalog-grid">
        {productosFiltrados.length > 0 ? (
          productosFiltrados.map((p) => (
            <ProductCard key={p.id} product={p} onOpenImage={openModal} />
          ))
        ) : (
          <div className="empty-state">
            <p>No hay productos con ese filtro.</p>
          </div>
        )}
      </main>

      <ImageModal open={modalOpen} src={modalSrc} alt={modalAlt} onClose={closeModal} />
    </div>
  );
}
