export function toArray(value) {
  if (!value) return [];
  if (Array.isArray(value)) return value.filter(Boolean);
  return [value].filter(Boolean);
}

export function assetUrl(asset) {
  const url = asset?.fields?.file?.url;
  if (!url) return null;
  return url.startsWith("http") ? url : `https:${url}`;
}

export function richTextToPlainText(rich) {
  if (!rich) return "";
  if (typeof rich === "string") return rich;

  const walk = (node) => {
    if (!node) return "";
    if (typeof node === "string") return node;
    if (node.nodeType === "text") return node.value || "";
    if (Array.isArray(node.content)) return node.content.map(walk).join(" ");
    return "";
  };

  return walk(rich).replace(/\s+/g, " ").trim();
}

const norm = (s) => String(s ?? "").trim().toLowerCase();

/* ✅ Mapa anti-errores ortográficos/variantes */
function canonicalCategory(value) {
  const v = norm(value);

  if (!v) return "";

  // Persianas
  if (v === "persiana" || v === "persianas") return "Persianas";

  // Cortinas
  if (v === "cortina" || v === "cortinas") return "Cortinas";

  // Servicios
  if (v === "servicio" || v === "servicios") return "Servicios";

  // Alfombras
  if (v === "alfombra" || v === "alfombras") return "Alfombras";

  // Muebles
  if (v === "mueble" || v === "muebles") return "Muebles";

  // Si no match, capitaliza “bonito”
  return v.charAt(0).toUpperCase() + v.slice(1);
}

export function normalizeProductEntry(entry) {
  const f = entry?.fields ?? {};

  const nombre = f.nombre ?? "Producto";
  const descripcion = richTextToPlainText(
    f.descripcion ?? f.descripcionCorta ?? f.detalle ?? ""
  );

  // categorías: soporta string (categoria) o list (categorias)
  const categoriasRaw = toArray(f.categorias ?? f.categoria);
  const categorias = categoriasRaw
    .map(canonicalCategory)
    .filter(Boolean);

  // etiquetas / subcategorías (se mantienen como texto, también normalizadas levemente)
  const etiquetas = toArray(f.etiquetas ?? f.subcategorias ?? f.subcategoria ?? f.tags)
    .map((s) => String(s).trim())
    .filter(Boolean);

  // imágenes múltiples
  const imagenes = toArray(f.imagen).map(assetUrl).filter(Boolean);

  return {
    id: entry?.sys?.id ?? crypto.randomUUID(),
    nombre,
    descripcion,
    categorias,
    etiquetas,
    imagenes,
  };
}
