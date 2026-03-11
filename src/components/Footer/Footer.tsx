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
            <span className="footer__label">Ayudaventa</span>
            <span className="footer__by">by habi.co</span>
          </div>
        </a>
        <div className="footer__links">
          <span className="footer__copyright">© ayudaventas 2025. All rights reserved</span>
          <a href="#terminos" className="footer__link">Terms &amp; Conditions</a>
          <a href="#privacidad" className="footer__link">Privacy Policy</a>
        </div>
      </div>
    </footer>
  )
}
