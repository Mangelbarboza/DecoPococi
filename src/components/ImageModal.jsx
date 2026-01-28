import { useEffect, useMemo, useRef, useState } from "react";

export default function ImageModal({ open, images, index, onClose }) {
  const safeImages = useMemo(() => {
    return (images ?? [])
      .map((u) => (typeof u === "string" ? u.trim() : ""))
      .filter(Boolean);
  }, [images]);

  const [selected, setSelected] = useState(index ?? 0);

  // Zoom
  const [scale, setScale] = useState(1);

  // Pan (arrastre)
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const drag = useRef({
    dragging: false,
    startX: 0,
    startY: 0,
    baseX: 0,
    baseY: 0,
  });

  useEffect(() => {
    if (!open) return;
    setSelected(Math.min(Math.max(index ?? 0, 0), Math.max(safeImages.length - 1, 0)));
    setScale(1);
    setOffset({ x: 0, y: 0 });
  }, [open, index, safeImages.length]);

  useEffect(() => {
    if (!open) return;

    const onKey = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") {
        setSelected((s) => Math.max(s - 1, 0));
        setScale(1);
        setOffset({ x: 0, y: 0 });
      }
      if (e.key === "ArrowRight") {
        setSelected((s) => Math.min(s + 1, safeImages.length - 1));
        setScale(1);
        setOffset({ x: 0, y: 0 });
      }
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose, safeImages.length]);

  // Bloquear scroll del body mientras el modal está abierto
  useEffect(() => {
    if (!open) return;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [open]);

  if (!open) return null;

  const currentSrc = safeImages[selected];

  const clamp = (v, min, max) => Math.min(max, Math.max(min, v));

  const zoomIn = () => setScale((s) => clamp(Number((s + 0.25).toFixed(2)), 1, 3));
  const zoomOut = () =>
    setScale((s) => {
      const next = clamp(Number((s - 0.25).toFixed(2)), 1, 3);
      if (next === 1) setOffset({ x: 0, y: 0 });
      return next;
    });

  const resetZoom = () => {
    setScale(1);
    setOffset({ x: 0, y: 0 });
  };

  const startDrag = (clientX, clientY) => {
    if (scale <= 1) return;
    drag.current.dragging = true;
    drag.current.startX = clientX;
    drag.current.startY = clientY;
    drag.current.baseX = offset.x;
    drag.current.baseY = offset.y;
  };

  const moveDrag = (clientX, clientY) => {
    if (!drag.current.dragging) return;
    const dx = clientX - drag.current.startX;
    const dy = clientY - drag.current.startY;
    setOffset({
      x: drag.current.baseX + dx,
      y: drag.current.baseY + dy,
    });
  };

  const endDrag = () => {
    drag.current.dragging = false;
  };

  // Mouse handlers
  const onMouseDown = (e) => {
    e.preventDefault();
    startDrag(e.clientX, e.clientY);
  };
  const onMouseMove = (e) => moveDrag(e.clientX, e.clientY);
  const onMouseUp = () => endDrag();
  const onMouseLeave = () => endDrag();

  // Touch handlers (móvil)
  const onTouchStart = (e) => {
    if (e.touches?.length !== 1) return;
    const t = e.touches[0];
    startDrag(t.clientX, t.clientY);
  };
  const onTouchMove = (e) => {
    if (!drag.current.dragging) return;
    const t = e.touches[0];
    moveDrag(t.clientX, t.clientY);
  };
  const onTouchEnd = () => endDrag();

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-panel" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label="Cerrar">
          ✕
        </button>

        {safeImages.length === 0 ? (
          <div className="modal-empty">
            <div className="modal-empty-title">Sin imágenes</div>
            <div className="modal-empty-text">Este producto no tiene galería todavía.</div>
          </div>
        ) : (
          <div className="modal-content">
            <div className="modal-toolbar">
              <div className="zoom-pill">
                <button className="zoom-btn" onClick={zoomOut} aria-label="Zoom menos">
                  −
                </button>
                <span className="zoom-value">{Math.round(scale * 100)}%</span>
                <button className="zoom-btn" onClick={zoomIn} aria-label="Zoom más">
                  +
                </button>
                <button className="zoom-reset" onClick={resetZoom} aria-label="Reset zoom">
                  Reset
                </button>
              </div>

              <div className="modal-hint">
                {scale > 1 ? "Arrastrá para mover la imagen" : "Usá + para acercar"}
              </div>
            </div>

            <div className="modal-view">
              <div
                className={`modal-image-wrap ${scale > 1 ? "is-zoomed" : ""}`}
                onMouseDown={onMouseDown}
                onMouseMove={onMouseMove}
                onMouseUp={onMouseUp}
                onMouseLeave={onMouseLeave}
                onTouchStart={onTouchStart}
                onTouchMove={onTouchMove}
                onTouchEnd={onTouchEnd}
              >
                <img
                  className="modal-img"
                  src={currentSrc}
                  alt="Imagen del producto"
                  style={{
                    transform: `translate(${offset.x}px, ${offset.y}px) scale(${scale})`,
                  }}
                  draggable={false}
                  onError={(e) => {
                    e.currentTarget.src =
                      "https://via.placeholder.com/1200x900?text=Imagen+no+disponible";
                  }}
                />
              </div>

              {safeImages.length > 1 && (
                <>
                  <button
                    className="modal-nav left"
                    onClick={() => {
                      setSelected((s) => Math.max(s - 1, 0));
                      resetZoom();
                    }}
                    aria-label="Anterior"
                    disabled={selected === 0}
                  >
                    ‹
                  </button>

                  <button
                    className="modal-nav right"
                    onClick={() => {
                      setSelected((s) => Math.min(s + 1, safeImages.length - 1));
                      resetZoom();
                    }}
                    aria-label="Siguiente"
                    disabled={selected === safeImages.length - 1}
                  >
                    ›
                  </button>
                </>
              )}
            </div>

            <div className="modal-thumbs">
              {safeImages.map((src, i) => (
                <button
                  key={src + i}
                  className={`thumb ${i === selected ? "active" : ""}`}
                  onClick={() => {
                    setSelected(i);
                    resetZoom();
                  }}
                  type="button"
                  aria-label={`Ver imagen ${i + 1}`}
                >
                  <img
                    src={src}
                    alt={`Miniatura ${i + 1}`}
                    draggable={false}
                    onError={(e) => {
                      e.currentTarget.src =
                        "https://via.placeholder.com/300x200?text=Sin+imagen";
                    }}
                  />
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
