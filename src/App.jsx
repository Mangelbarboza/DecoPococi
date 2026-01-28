import { useEffect, useMemo, useState } from "react";
import { client } from "./client";
import "./App.css";

import Header from "./components/Header.jsx";
import Footer from "./components/Footer.jsx";
import CategoryFilter from "./components/CategoryFilter.jsx";
import TagFilter from "./components/TagFilter.jsx";
import ProductCard from "./components/ProductCard.jsx";
import ImageModal from "./components/ImageModal.jsx";

import { normalizeProductEntry, normalizeUrl } from "./utils/contentful.js";

// ✅ Las 4 que quieres primero (después de "Todos")
const PINNED_CATS = ["Persianas", "Cortinas", "Alfombras", "Cortineros"];

// ✅ Estas NO deben aparecer en las opciones
const HIDDEN_CATS = ["Productos", "Cortinas en Tela"];

const norm = (s) => String(s ?? "").trim().toLowerCase();

export default function App() {
  const [productos, setProductos] = useState([]);
  const [categoriaActiva, setCategoriaActiva] = useState("Todos");
  const [tagsActivos, setTagsActivos] = useState([]);

  // Modal global
  const [modalOpen, setModalOpen] = useState(false);
  const [modalImages, setModalImages] = useState([]);
  const [modalIndex, setModalIndex] = useState(0);
  const [modalTitle, setModalTitle] = useState("");


 const openModal = (images, index, title) => {
  const safeImages = (images ?? [])
    .map((u) => (typeof u === "string" ? u.trim() : ""))
    .filter(Boolean);

  if (!safeImages.length) return;

  const safeIndex = Math.min(Math.max(index ?? 0, 0), safeImages.length - 1);

  setModalImages(safeImages);
  setModalIndex(safeIndex);
  setModalTitle(title ?? "");
  setModalOpen(true);
};

  const closeModal = () => setModalOpen(false);

  const modalPrev = () =>
    setModalIndex((i) => (i - 1 + modalImages.length) % modalImages.length);

  const modalNext = () =>
    setModalIndex((i) => (i + 1) % modalImages.length);

  useEffect(() => {
    client
      .getEntries({ content_type: "producto" })
      .then((response) => {
        const normalized = (response.items ?? []).map(normalizeProductEntry);
        setProductos(normalized);
      })
      .catch((err) => console.error(err));
  }, []);

  // ✅ Categorías ordenadas como pediste
  const categorias = useMemo(() => {
    const found = new Set();
    productos.forEach((p) => p.categorias.forEach((c) => found.add(c)));

    // Quita las ocultas (aunque existan en Contentful)
    const hiddenNorm = new Set(HIDDEN_CATS.map(norm));

    const foundVisible = [...found].filter((c) => !hiddenNorm.has(norm(c)));

    // Asegura que los pinned existan en la lista aunque no haya productos (para que se vean)
    const pinned = PINNED_CATS.filter((c) => !hiddenNorm.has(norm(c)));

    // Resto: lo que venga de Contentful, menos pinned y menos "Todos"
    const pinnedNorm = new Set(pinned.map(norm));

    const rest = foundVisible
      .filter((c) => !pinnedNorm.has(norm(c)))
      .sort((a, b) => a.localeCompare(b));

    return ["Todos", ...pinned, ...rest];
  }, [productos]);

  const productosPorCategoria = useMemo(() => {
    if (categoriaActiva === "Todos") return productos;
    const cat = norm(categoriaActiva);
    return productos.filter((p) => p.categorias.some((c) => norm(c) === cat));
  }, [productos, categoriaActiva]);

  const tagsDisponibles = useMemo(() => {
    const s = new Set();
    productosPorCategoria.forEach((p) => p.etiquetas.forEach((t) => s.add(t)));
    return [...s].sort((a, b) => a.localeCompare(b));
  }, [productosPorCategoria]);

  const productosFiltrados = useMemo(() => {
    if (!tagsActivos.length) return productosPorCategoria;
    const active = tagsActivos.map(norm);
    return productosPorCategoria.filter((p) =>
      active.every((t) => p.etiquetas.some((e) => norm(e) === t))
    );
  }, [productosPorCategoria, tagsActivos]);

  const onSelectCategoria = (cat) => {
    setCategoriaActiva(cat);
    setTagsActivos([]);
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

      <ImageModal
  open={modalOpen}
  title={modalTitle}
  images={modalImages}
  index={modalIndex}
  onClose={() => setModalOpen(false)}
/>



      <Footer />
    </div>
  );
}
