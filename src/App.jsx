import { useState, useEffect } from 'react';
import { client } from './client';
import './App.css'; // Usaremos el CSS por defecto un momento

function App() {
  const [productos, setProductos] = useState([]);

  useEffect(() => {
    // Pedimos los datos a Contentful
    client.getEntries({ content_type: 'producto' })
      .then((response) => {
        console.log("Datos recibidos:", response.items); // Para depurar en consola
        setProductos(response.items);
      })
      .catch((err) => console.error("Error conectando:", err));
  }, []);

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <header style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h1>Catálogo de Cortinas</h1>
        <p>Calidad y estilo para tu hogar</p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px' }}>
        
        {productos.map((item) => {
          // Desempaquetamos los datos de cada cortina
          const { nombre, precio, descripcion, imagen, disponible } = item.fields;
          
          // OJO: Como pusiste "Many files", imagen es un ARRAY (lista). 
          // Tomamos la primera foto [0] para la portada.
          const imgUrl = imagen && imagen.length > 0 ? imagen[0].fields.file.url : '';

          return (
            <article key={item.sys.id} style={{ border: '1px solid #ddd', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
              
              {/* Imagen del producto */}
              {imgUrl && (
                <img 
                  src={'https:' + imgUrl} 
                  alt={nombre} 
                  style={{ width: '100%', height: '200px', objectFit: 'cover' }} 
                />
              )}

              <div style={{ padding: '15px' }}>
                <h2 style={{ fontSize: '1.2rem', margin: '0 0 10px 0' }}>{nombre}</h2>
                
                {/* Etiqueta de Disponibilidad */}
                {disponible ? 
                  <span style={{ background: '#e6fffa', color: '#047857', padding: '4px 8px', borderRadius: '4px', fontSize: '0.8rem' }}>Disponible</span> 
                  : 
                  <span style={{ background: '#fff5f5', color: '#c53030', padding: '4px 8px', borderRadius: '4px', fontSize: '0.8rem' }}>Agotado</span>
                }

                <p style={{ color: '#555', fontSize: '0.9rem' }}>{descripcion}</p>
                <h3 style={{ color: '#2b6cb0' }}>₡{precio}</h3>

                {/* Botón WhatsApp */}
                <a 
                  href={`https://wa.me/50688888888?text=Hola, me interesa: ${nombre}`}
                  target="_blank" 
                  rel="noreferrer"
                  style={{ 
                    display: 'block', 
                    width: '100%', 
                    padding: '10px', 
                    background: '#25D366', 
                    color: 'white', 
                    textAlign: 'center', 
                    textDecoration: 'none', 
                    borderRadius: '5px',
                    fontWeight: 'bold'
                  }}
                >
                  Consultar
                </a>
              </div>
            </article>
          );
        })}

      </div>
    </div>
  );
}

export default App;