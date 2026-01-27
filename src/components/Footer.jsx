export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <div className="footer-title">Cortinas Decopococi</div>
          <div className="footer-subtitle">Un lujo a su alcance</div>

          <div className="footer-note">
            Cotizaciones y atención por WhatsApp. Respuesta lo antes posible.
          </div>
        </div>

        <div className="footer-section">
          <div className="footer-heading">Datos de contacto</div>

          <ul className="footer-list">
            <li>
              <span className="footer-label">WhatsApp / Tel:</span>{" "}
              <a className="footer-link" href="https://wa.me/50686714763" target="_blank" rel="noreferrer">
                +506 8671 4763
              </a>{" "}
              <span className="footer-sep">•</span>{" "}
              <a className="footer-link" href="https://wa.me/50686606394" target="_blank" rel="noreferrer">
                +506 8660 6394
              </a>
            </li>

            <li>
              <span className="footer-label">Correo:</span>{" "}
              <a className="footer-link" href="mailto:l_bbr13@hotmail.com">
                l_bbr13@hotmail.com
              </a>
            </li>

            <li>
              <span className="footer-label">Dirección:</span> Guápiles, Limón, Costa Rica
            </li>
          </ul>
        </div>

        <div className="footer-section">
          <div className="footer-heading">Redes sociales</div>

          <div className="social-grid">
            <a className="social-btn" href="https://wa.me/50686714763" target="_blank" rel="noreferrer">
              WhatsApp
            </a>

            <a
              className="social-btn"
              href="https://www.facebook.com/CortinasDecoPococi"
              target="_blank"
              rel="noreferrer"
            >
              Facebook
            </a>

            <a
              className="social-btn"
              href="https://www.instagram.com/cortinas_decopococi/"
              target="_blank"
              rel="noreferrer"
            >
              Instagram
            </a>

            <a
              className="social-btn"
              href="https://www.tiktok.com/@cortinas.decopococ?lang=es-419"
              target="_blank"
              rel="noreferrer"
            >
              TikTok
            </a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <span>© {new Date().getFullYear()} Cortinas Decopococi. Todos los derechos reservados.</span>
      </div>
    </footer>
  );
}
