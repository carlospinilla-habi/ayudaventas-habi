import './Footer.css'

export function Footer() {
  return (
    <footer className="footer" data-node-id="232:30793">
      <div className="footer__inner">
        <a href="/" className="footer__brand">
          <div className="footer__logo">
            <div className="footer__logo-bg" />
            <img
              src="/2bc36bdde701d513cede283c7a15271c0c1b36bf.svg"
              alt="Habi"
              width={36}
              height={36}
            />
          </div>
          <div className="footer__text">
            <span className="footer__label">Ayuda<span className="footer__label-accent">ventas</span></span>
            <span className="footer__by">habi.co.</span>
          </div>
        </a>
        <div className="footer__links">
          <span className="footer__copyright">© Ayudaventas Habi 2025. Todos los derechos reservados.</span>
          <a href="https://habi.co/terminosycondiciones" target="_blank" rel="noopener noreferrer" className="footer__link">Términos y condiciones.</a>
          <a href="https://habi.co/terminosycondiciones-1-0" target="_blank" rel="noopener noreferrer" className="footer__link">Política de privacidad.</a>
        </div>
      </div>
    </footer>
  )
}
