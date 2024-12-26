import { PureComponent, ReactNode } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import Casual from "assets/main/images/main-page/casual.webp"
import BrandsSection from "./BrandsSection";
import welcomeImage from "assets/main/images/main-page/welcomeImage.webp";

class MainPage extends PureComponent {

  render(): ReactNode {
    return (
      <>
        <section className="welcome-section">
          <div className="welcome-container">
            <div className="welcome-text-column">
              <h1 className="welcome-main-title fade fadeInDown">
                Найдите одежду которая подходит вашему стилю
              </h1>
              <p className="welcome-text fade fadeInUp">
                Ознакомьтесь с нашим разнообразным ассортиментом тщательно
                созданной одежды, разработанной, чтобы подчеркнуть вашу
                индивидуальность и удовлетворить ваше чувство стиля
              </p>
              <a href="" className="welcome-link fade fadeInLeft">
                Купить сейчас
              </a>
              <div className="welcome-numbers-count-container">
                <div className="welcome-numbers-count-column">
                  <span className="welcome-numbers-count fade fadeInUp">
                    200+
                  </span>
                  <p className="welcome-numbers-count-text fade fadeInDown">
                    Международных брендов
                  </p>
                </div>
                <div className="welcome-numbers-count-column">
                  <span className="welcome-numbers-count fade fadeInUp">
                    2,000+
                  </span>
                  <p className="welcome-numbers-count-text fade fadeInDown">
                    Высококачественная продукция
                  </p>
                </div>
                <div className="welcome-numbers-count-column">
                  <span className="welcome-numbers-count fade fadeInUp">
                    30,000+
                  </span>
                  <p className="welcome-numbers-count-text fade fadeInDown">
                    Довольных клиентов
                  </p>
                </div>
              </div>
            </div>
            <div className="welcome-image-column fade fadeInRight">
              <img
                src={welcomeImage}
                alt="Fashion people"
                loading="lazy"
                decoding="async"
              />
            </div>
          </div>
        </section>

        <BrandsSection />

        <section className="swiper-section new-clothes-section">
          <div className="swiper-main-container new-clothes-container">
            <h2 className="swiper-subtitle new-clothes-subtitle fade fadeInDown">
              Новинки
            </h2>
            <Swiper
              className="mySwiper-new-clothes"
              slidesPerView={3}
              spaceBetween={30}
              navigation>
              {[...Array(5)].map((_, index) => (
                <SwiperSlide key={index} className="new-clothes-column">
                  <div className="swiper-object-image-container new-clothes-image-container">
                    <img
                      src="/static/main/images/layout/clothes.jpg"
                      alt=""
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                  <div className="new-clothes-content">
                    <h4 className="swiper-object-title new-clothes-title">
                      Футболка с деталями из
                    </h4>
                    <bdi className="swiper-price new-clothes-price">
                      23,420,000 сум{" "}
                      <span className="original-price">25,620,000 сум</span>
                      <span className="discount">-20%</span>
                    </bdi>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
            <div className="view-all-clothes-link-container fade fadeInUp">
              <a href="" className="view-all-clothes-link">
                Просмотреть все
              </a>
            </div>
          </div>
        </section>

        <div className="hr-line"></div>

        <section className="swiper-section top-selling-section">
          <div className="swiper-main-container top-selling-container">
            <h2 className="swiper-subtitle top-selling-subtitle fade fadeInDown">
              Популярные
            </h2>
            <Swiper
              className="mySwiper-top-selling"
              slidesPerView={3}
              spaceBetween={30}
              navigation>
              {[...Array(5)].map((_, index) => (
                <SwiperSlide key={index} className="top-selling-column">
                  <div className="swiper-object-image-container top-selling-image-container">
                    <img
                      src="/static/main/images/layout/clothes.jpg"
                      alt=""
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                  <div className="top-selling-content">
                    <h4 className="swiper-object-title top-selling-title">
                      Футболка с деталями из ленты
                    </h4>
                    <bdi className="swiper-price top-selling-price">
                      2,420,000 сум{" "}
                      <span className="original-price">2,620,000 сум</span>
                      <span className="discount">-20%</span>
                    </bdi>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
            <div className="view-all-clothes-link-container fade fadeInUp">
              <a href="" className="view-all-clothes-link">
                Просмотреть все
              </a>
            </div>
          </div>
        </section>

        <section className="extra-offer-section">
          <div className="extra-offer-container">
            <div className="extra-offer-content">
              <h3 className="extra-offer-title fade fadeInUp">
                Мы сделаем вашу повседневную моду лучше
              </h3>
              <p className="extra-offer-text fade fadeInUp">
                Откройте для себя модные новинки по отличным ценам, наслаждайтесь
                уникальными скидками и создайте стильный гардероб, который будет
                вдохновлять каждый день
              </p>
              <a href="" className="extra-offer-link fade fadeInUp">
                Купить сейчас
              </a>
            </div>
            <div className="extra-offer-image-container">
              <img
                src="/static/main/images/main-page/extraoffer.webp"
                alt="Offer image"
                loading="lazy"
                decoding="async"
              />
            </div>
          </div>
        </section>

        <section className="browse-style-section">
          <div className="browse-style-container">
            <h2 className="browse-style-subtitle fade fadeInDown">Поиск по стилю одежды</h2>
            <div className="browse-style-wrapper first">
              <a href="" className="browse-style-column casual">
                <h3 className="browse-style-column-title fade fadeInUp">Повседневный</h3>
                <div className="browse-style-column-image-container">
                  <img
                    src={Casual}
                    alt="Offer image"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
              </a>
              <a href="" className="browse-style-column formal">
                <h3 className="browse-style-column-title fade fadeInRight">Формальный</h3>
                <div className="browse-style-column-image-container">
                  <img src="static 'main/images/main-page/formal.webp'" alt="Formal clothes" loading="lazy" decoding="async" />
                </div>
              </a>
            </div>
            <div className="browse-style-wrapper second">
              <a href="" className="browse-style-column party">
                <h3 className="browse-style-column-title fade fadeInLeft">Вечеринка</h3>
                <div className="browse-style-column-image-container">
                  <img src="static 'main/images/main-page/party.webp'" alt="Party clothes" loading="lazy" decoding="async" />
                </div>
              </a>
              <a href="" className="browse-style-column gym">
                <h3 className="browse-style-column-title fade fadeInDown">Спортзал</h3>
                <div className="browse-style-column-image-container">
                  <img src="static 'main/images/main-page/gym.webp'" alt="Gym clothes" loading="lazy" decoding="async" />
                </div>
              </a>
            </div>
          </div>
        </section>

        <section className="feedbacks-section">
          <div className="swiper-main-container feedbacks-container">
            <div className="feedbacks-title-section">
              <h2 className="swiper-subtitle feedbacks-subtitle fade fadeInDown">Наши довольные клиенты</h2>
              <div className="swiper-buttons-together-right-container swiper-buttons-feedbacks-container fade fadeInUp">
                <div className="swiper-button-prev loop-button-feedbacks-prev">
                  <i className="fa-solid fa-arrow-left"></i>
                </div>
                <div className="swiper-button-next loop-button-feedbacks-next">
                  <i className="fa-solid fa-arrow-right"></i>
                </div>
              </div>
            </div>
            <div className="swiper mySwiper-feedbacks">
              <div className="feedbacks-wrapper swiper-wrapper">
                <div className="feedbacks-column swiper-slide">
                  <div className="feedbacks-content">
                    <div className="feedback-rate-container">
                      <img src="static 'main/images/main-page/5star.png'" alt="" />
                    </div>
                    <h5 className="feedbacks-username">Sarah M.</h5>
                    <p className="feedbacks-text">I'm blown away by the quality and style of the clothes I received from Shop.co. From casual wear to elegant dresses, every piece I've bought has exceeded my expectations.</p>
                  </div>
                </div>
                <div className="feedbacks-column swiper-slide">
                  <div className="feedbacks-content">
                    <div className="feedback-rate-container">
                      <img src="static 'main/images/main-page/5star.png'" alt="" />
                    </div>
                    <h5 className="feedbacks-username">Sarah M.</h5>
                    <p className="feedbacks-text">I'm blown away by the quality and style of the clothes I received from Shop.co. From casual wear to elegant dresses, every piece I've bought has exceeded my expectations.</p>
                  </div>
                </div>
                <div className="feedbacks-column swiper-slide">
                  <div className="feedbacks-content">
                    <div className="feedback-rate-container">
                      <img src="static 'main/images/main-page/5star.png'" alt="" />
                    </div>
                    <h5 className="feedbacks-username">Sarah M.</h5>
                    <p className="feedbacks-text">I'm blown away by the quality and style of the clothes I received from Shop.co. From casual wear to elegant dresses, every piece I've bought has exceeded my expectations.</p>
                  </div>
                </div>
                <div className="feedbacks-column swiper-slide">
                  <div className="feedbacks-content">
                    <div className="feedback-rate-container">
                      <img src="static 'main/images/main-page/5star.png'" alt="" />
                    </div>
                    <h5 className="feedbacks-username">Sarah M.</h5>
                    <p className="feedbacks-text">I'm blown away by the quality and style of the clothes I received from Shop.co. From casual wear to elegant dresses, every piece I've bought has exceeded my expectations.</p>
                  </div>
                </div>
                <div className="feedbacks-column swiper-slide">
                  <div className="feedbacks-content">
                    <div className="feedback-rate-container">
                      <img src="static 'main/images/main-page/5star.png'" alt="" />
                    </div>
                    <h5 className="feedbacks-username">Sarah M.</h5>
                    <p className="feedbacks-text">I'm blown away by the quality and style of the clothes I received from Shop.co. From casual wear to elegant dresses, every piece I've bought has exceeded my expectations.</p>
                  </div>
                </div>
                <div className="feedbacks-column swiper-slide">
                  <div className="feedbacks-content">
                    <div className="feedback-rate-container">
                      <img src="static 'main/images/main-page/5star.png'" alt="" />
                    </div>
                    <h5 className="feedbacks-username">Sarah M.</h5>
                    <p className="feedbacks-text">I'm blown away by the quality and style of the clothes I received from Shop.co. From casual wear to elegant dresses, every piece I've bought has exceeded my expectations.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </>
    );
  }
}

export default MainPage;
