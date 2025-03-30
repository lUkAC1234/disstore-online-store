import "./Footer.scss";
import { ReactNode } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInstagram, faTelegram, faTiktok, faYoutube } from '@fortawesome/free-brands-svg-icons';

function Footer(): ReactNode {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-brand">
          <h2 className="footer-logo">DISSTORE.UZ</h2>
          <p className="footer-description">
            У нас вы найдете стильную и качественную одежду, которая подчеркнет ваш стиль и подарит комфорт в любой ситуации.
            <span> Для мужчин и женщин</span>
          </p>
          <div className="footer-socials">
            <a href="#" aria-label="Instagram" className="footer-social-link">
              <FontAwesomeIcon icon={faInstagram} />
            </a>
            <a href="#" aria-label="Telegram" className="footer-social-link">
              <FontAwesomeIcon icon={faTelegram} />
            </a>
            <a href="#" aria-label="Tiktok" className="footer-social-link">
              <FontAwesomeIcon icon={faTiktok} />
            </a>
            <a href="#" aria-label="Youtube" className="footer-social-link">
              <FontAwesomeIcon icon={faYoutube} />
            </a>
          </div>
        </div>
        <div className="footer-links">
          <div className="footer-column">
            <h3 className="footer-heading">О компании</h3>
            <ul className="footer-column-ul">
              <li className="footer-column-list">
                <Link to="/about" aria-label="О нас">О нас</Link>
              </li>
              <li className="footer-column-list">
                <Link to="/features" aria-label="Особенности">Особенности</Link>
              </li>
              <li className="footer-column-list">
                <Link to="/how-it-works" aria-label="Как это работает">Как это работает</Link>
              </li>
              <li className="footer-column-list">
                <Link to="/careers" aria-label="Карьера в компании">Карьера</Link>
              </li>
            </ul>
          </div>

          <div className="footer-column">
            <h3 className="footer-heading">Помощь</h3>
            <ul className="footer-column-ul">
              <li className="footer-column-list">
                <Link to="/support" aria-label="Поддержка клиентов">Поддержка клиентов</Link>
              </li>
              <li className="footer-column-list">
                <Link to="/delivery-details" aria-label="Информация о доставке">Информация о доставке</Link>
              </li>
              <li className="footer-column-list">
                <Link to="/terms" aria-label="Условия использования">Условия использования</Link>
              </li>
              <li className="footer-column-list">
                <Link to="/privacy-policy" aria-label="Политика конфиденциальности">Политика конфиденциальности</Link>
              </li>
            </ul>
          </div>

          <div className="footer-column">
            <h3 className="footer-heading">Вопросы</h3>
            <ul className="footer-column-ul">
              <li className="footer-column-list">
                <Link to="/account" aria-label="Ваш аккаунт">Ваш аккаунт</Link>
              </li>
              <li className="footer-column-list">
                <Link to="/manage-deliveries" aria-label="Управление доставками">Управление доставками</Link>
              </li>
              <li className="footer-column-list">
                <Link to="/orders" aria-label="Ваши заказы">Ваши заказы</Link>
              </li>
              <li className="footer-column-list">
                <Link to="/payments" aria-label="Способы оплаты">Способы оплаты</Link>
              </li>
            </ul>
          </div>

          <div className="footer-column">
            <h3 className="footer-heading">Ресурсы</h3>
            <ul className="footer-column-ul">
              <li className="footer-column-list">
                <Link to="/ebooks" aria-label="Бесплатные электронные книги">Бесплатные электронные книги</Link>
              </li>
              <li className="footer-column-list">
                <Link to="/tutorial" aria-label="Руководства и статьи">Руководства и статьи</Link>
              </li>
              <li className="footer-column-list">
                <Link to="/blog" aria-label="Блог">Блог</Link>
              </li>
              <li className="footer-column-list">
                <Link to="/youtube-playlist" aria-label="Видео на YouTube">Видео на YouTube</Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
