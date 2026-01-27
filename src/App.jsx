import { useState, useEffect } from 'react';
import { client } from './client';
import './App.css';

function App() {
  const [productos, setProductos] = useState([]);
  const [categoriaActiva, setCategoriaActiva] = useState('Todos');

  // Estas son las categorías fijas que pidió tu hermano
  const categorias = ["Todos", "Servicio", "Cortinas", "Persianas", "Alfombras", "Muebles"];

  useEffect(() => {
    client.getEntries({ content_type: 'producto' })
      .then((response) => {
        setProductos(response.items);
      })
      .catch((err) => console.error(err));
  }, []);

  // Lógica de filtrado
  const productosFiltrados = categoriaActiva === 'Todos' 
    ? productos 
    : productos.filter(item => item.fields.categoria === categoriaActiva);

  return (
    <div className="app-container">
      
      {/* HEADER */}
      <header className="header">
        <div className="brand-container">
          <h1 className="brand-title">Cortinas Decopococi</h1>
          <span className="brand-slogan">Un lujo a su alcance</span>
        </div>
        <nav className="nav-menu">
          <span className="nav-link active">Catálogo</span>
          <span className="nav-link">Contáctenos</span>
          <span className="nav-link">Sobre Nosotros</span>
        </nav>
      </header>

      {/* FILTRO DE CATEGORÍAS (Carrusel) */}
      <div className="category-filter-container">
        {categorias.map(cat => (
          <button 
            key={cat}
            className={`cat-btn ${categoriaActiva === cat ? 'active' : ''}`}
            onClick={() => setCategoriaActiva(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* GRILLA DE PRODUCTOS */}
      <main className="catalog-grid">
        {productosFiltrados.length > 0 ? (
          productosFiltrados.map((item) => {
            const { nombre, precio, imagen } = item.fields;
            // Si hay imagen, usa la primera, si no, usa un placeholder gris
            const imgUrl = imagen && imagen.length > 0 
              ? imagen[0].fields.file.url 
              : 'https://via.placeholder.com/300x300?text=Sin+Foto';

            return (
              <article key={item.sys.id} className="product-card">
                <img 
                  src={imgUrl.startsWith('http') ? imgUrl : 'https:' + imgUrl} 
                  alt={nombre} 
                  className="card-image" 
                />
                <div className="card-info">
                  <h3 className="card-title">{nombre}</h3>
                  <p className="card-price">₡{precio}</p>
                  
                  <a 
                    href={`https://wa.me/50688888888?text=Hola Decopococi, me interesa: ${nombre}`}
                    target="_blank" 
                    rel="noreferrer"
                    className="whatsapp-btn"
                  >
                    Cotizar
                  </a>
                </div>
              </article>
            );
          })
        ) : (
          <p style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '20px', color: '#666' }}>
            No hay productos en la categoría "{categoriaActiva}" por ahora.
          </p>
        )}
      </main>

    </div>
  );
}

export default App;