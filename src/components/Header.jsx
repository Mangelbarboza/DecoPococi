import logo from "../assets/logo.svg";
import logo2 from "../assets/logo2.png";
export default function Header() {
  return (
    <header className="header">
      <div className="header-left">
        <img className="brand-logo" src={logo2} alt="Cortinas Decopococi" />
        <img className="brand-logo" src={logo} alt="Cortinas Decopococi" />
        <div className="brand-meta">

        </div>
        <h1 className="visually-hidden">Cortinas Decopococi</h1>
      </div>

      <nav className="nav-menu">
        <a className="nav-link active">Catálogo</a>
        <a className="nav-link">Contáctenos</a>
        <a className="nav-link">Sobre Nosotros</a>
      </nav>
    </header>
  );
}
