import { useState, useEffect } from 'react';
import { client } from './client';
import './App.css';

function App() {
  const [productos, setProductos] = useState([]);
  const [categoriaActiva, setCategoriaActiva] = useState("Todos");

  const categorias = ["Todos", "Servicio", "Cortinas", "Persianas", "Alfombras", "Muebles"];

  useEffect(() => {
    client.getEntries({ content_type: 'producto' })
      .then((response) => {
        setProductos(response.items);
      })
      .catch((err) => console.error(err));
  }, []);

  const productosFiltrados = categoriaActiva === "Todos" 
    ? productos 
    : productos.filter(item => item.fields.categoria === categoriaActiva);

  return (
    <div className="app-container">
      
      {/* HEADER FULL WIDTH (Sin contenedor restrictivo) */}
      <header className="header">
        <div className="brand-container">
          <h1 className="brand-title">Cortinas Decopococi</h1>
          <span className="brand-slogan">Un lujo a su alcance</span>
        </div>
        
        <nav className="nav-menu">
          <a className="nav-link active">Catálogo</a>
          <a className="nav-link">Contáctenos</a>
          <a className="nav-link">Sobre Nosotros</a>
        </nav>
      </header>

      {/* FILTRO DE CATEGORÍAS */}
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

      {/* GRILLA FULL WIDTH */}
      <main className="catalog-grid">
        {productosFiltrados.length > 0 ? (
          productosFiltrados.map((item) => {
            const { nombre, precio, imagen } = item.fields;
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
                    href={`https://wa.me/50688888888?text=Hola, me interesa: ${nombre}`}
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
          <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px', color: '#666', width: '100%' }}>
            <p>No hay productos en la categoría <strong>{categoriaActiva}</strong>.</p>
          </div>
        )}
      </main>

    </div>
  );
}

export default App;