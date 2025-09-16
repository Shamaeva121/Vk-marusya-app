import './Footer.scss';

function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <section className="footer-section">
          <a className="footer-section__icon-link" href="#">
            <img className="footer-section__icon" src="/icons/icon-vk.svg" width="19" height="10" alt="VK" />
          </a>
          <a className="footer-section__icon-link" href="#">
            <img className="footer-section__icon" src="/icons/icon-youtube.svg" alt="Youtube" />
          </a>
          <a className="footer-section__icon-link" href="#">
            <img className="footer-section__icon" src="/icons/icon-odnoklasniki.svg" alt="Odnoklassniki" />
          </a>
          <a className="footer-section__icon-link" href="#">
            <img className="footer-section__icon" src="/icons/icon-telegram.svg" alt="Telegram" />
          </a>
        </section>
      </div>
    </footer>
  );
}

export default Footer;