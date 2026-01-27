export function toArray(value) {
  if (!value) return [];
  if (Array.isArray(value)) return value.filter(Boolean);
  return [value].filter(Boolean);
}

export function normalizeUrl(url) {
  if (!url) return null;
  const clean = String(url).trim();
  if (!clean) return null;
  if (clean.startsWith("http://") || clean.startsWith("https://")) return clean;
  if (clean.startsWith("//")) return `https:${clean}`;
  return `https:${clean}`;
}

export function assetUrl(asset) {
  const url = asset?.fields?.file?.url;
  return normalizeUrl(url);
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

export function normalizeProductEntry(entry) {
  const f = entry?.fields ?? {};

  const nombre = f.nombre ?? "Producto";
  const descripcion = richTextToPlainText(f.descripcion ?? f.descripcionCorta ?? f.detalle ?? "");

  const categorias = toArray(f.categorias ?? f.categoria)
    .map((s) => String(s).trim())
    .filter(Boolean);

  const etiquetas = toArray(f.etiquetas ?? f.subcategorias ?? f.subcategoria ?? f.tags)
    .map((s) => String(s).trim())
    .filter(Boolean);

  const imagenes = toArray(f.imagen)
    .map(assetUrl)
    .filter(Boolean);

  return {
    id: entry?.sys?.id ?? crypto.randomUUID(),
    nombre,
    descripcion,
    categorias,
    etiquetas,
    imagenes,
  };
}
