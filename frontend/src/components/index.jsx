import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';

const MainPage = () => {
  return (
    <main className="main index-main">
      <section className="welcome-section">
        <div className="welcome-container">
          <div className="welcome-text-column">
            <h1 className="welcome-main-title fade fadeInDown">
              Найдите одежду которая подходит вашему стилю
            </h1>
            <p className="welcome-text fade fadeInUp">
              Ознакомьтесь с нашим разнообразным ассортиментом тщательно созданной одежды, разработанной, чтобы подчеркнуть вашу индивидуальность и удовлетворить ваше чувство стиля
            </p>
            <a href="" className="welcome-link fade fadeInLeft">
              Купить сейчас
            </a>
            <div className="welcome-numbers-count-container">
              <div className="welcome-numbers-count-column">
                <span className="welcome-numbers-count fade fadeInUp">200+</span>
                <p className="welcome-numbers-count-text fade fadeInDown">Международных брендов</p>
              </div>
              <div className="welcome-numbers-count-column">
                <span className="welcome-numbers-count fade fadeInUp">2,000+</span>
                <p className="welcome-numbers-count-text fade fadeInDown">Высококачественная продукция</p>
              </div>
              <div className="welcome-numbers-count-column">
                <span className="welcome-numbers-count fade fadeInUp">30,000+</span>
                <p className="welcome-numbers-count-text fade fadeInDown">Довольных клиентов</p>
              </div>
            </div>
          </div>
          <div className="welcome-image-column fade fadeInRight">
            <img
              src="/static/main/images/main-page/welcomeImage.webp"
              alt="Fashion people"
              loading="lazy"
              decoding="async"
            />
          </div>
        </div>
      </section>

      <section className="brands-section">
        <div className="brands-container">
          {['versace', 'zara', 'gucci', 'prada', 'calvinKlein'].map((brand, index) => (
            <div key={index} className="brands-column fade fadeInUp">
              <img
                src={`/static/main/images/brands/${brand}.webp`}
                alt={`${brand} brand`}
                loading="lazy"
                decoding="async"
              />
            </div>
          ))}
        </div>
      </section>

      <section className="swiper-section new-clothes-section">
        <div className="swiper-main-container new-clothes-container">
          <h2 className="swiper-subtitle new-clothes-subtitle fade fadeInDown">Новинки</h2>
          <Swiper
            className="mySwiper-new-clothes"
            slidesPerView={3}
            spaceBetween={30}
            navigation
          >
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
                  <h4 className="swiper-object-title new-clothes-title">Футболка с деталями из</h4>
                  <bdi className="swiper-price new-clothes-price">
                    23,420,000 сум <span className="original-price">25,620,000 сум</span>
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
          <h2 className="swiper-subtitle top-selling-subtitle fade fadeInDown">Популярные</h2>
          <Swiper
            className="mySwiper-top-selling"
            slidesPerView={3}
            spaceBetween={30}
            navigation
          >
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
                  <h4 className="swiper-object-title top-selling-title">Футболка с деталями из ленты</h4>
                  <bdi className="swiper-price top-selling-price">
                    2,420,000 сум <span className="original-price">2,620,000 сум</span>
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
              Откройте для себя модные новинки по отличным ценам, наслаждайтесь уникальными скидками и создайте стильный гардероб, который будет вдохновлять каждый день
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
    </main>
  );
};

export default MainPage;
