import styles from "./AboutUs.module.scss";
import { lazy, PureComponent, ReactNode, Suspense } from "react";
import { Link } from "react-router-dom";
import historyImage from "assets/main/images/aboutus/historyImage.webp";
import statistics2 from "assets/main/images/aboutus/statistics2.webp";
import statistics3 from "assets/main/images/aboutus/statistics3.webp";
import thumbhistoryImage from "assets/main/images/aboutus/thumb_historyImage.webp"
import thumbStatistics2 from "assets/main/images/aboutus/thumb_statistics2.webp"
import thumbStatistics3 from "assets/main/images/aboutus/thumb_statistics3.webp"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronRight } from "@fortawesome/free-solid-svg-icons";
import SpinnerLoaderWrapper from "components/Loaders/SpinnerLoaderWrapper";
import OptimizedImage from "components/OptimizedImage/OptimizedImage";

const Chart = lazy(() => import("./Chart/Chart"));
const Faq = lazy(() => import("components/Faq/Faq"));

class AboutUs extends PureComponent<AboutUsProps, AboutUsState> {
  render(): ReactNode {

    return (
      <div className={styles["about-us-container"]}>
        <section className={styles["about-us-heading-section"]}>
          <div className={styles["about-us-heading-container"]}>
            <h1 className={styles["about-us-heading-title"]}>О нас</h1>
            <p className={styles["about-us-heading-text"]}>Наша основная цель — предложить уникальные и инновационные продукты, которые не только вдохновляют, но и приносят искреннюю радость и удовлетворение нашим клиентам, помогая им делать жизнь ярче и интереснее.</p>
          </div>
        </section>

        <section className={styles["about-us-history-section"]}>
          <div className={styles["about-us-history-container"]}>
            <div className={styles["about-us-history-content"]}>
              <h2 className={styles["about-us-history-subtitle"]}>История и ценности нашей компании</h2>
              <div className={styles["about-us-history-content-text-container"]}>
                <p className={styles["about-us-history-text"]}>Наша компания была основана с целью предоставить клиентам лучшие товары и услуги. Мы верим в инновации и стремимся к постоянному совершенствованию. Наша миссия — делать жизнь наших клиентов лучше и удобнее.</p>
                <div className={styles["about-us-history-links-controller"]}>
                  <Link className={styles["about-us-history-link-white"]} to={""}>Каталог</Link>
                  <Link className={styles["about-us-history-link-black"]} to={""}>
                    Связаться
                    <FontAwesomeIcon icon={faChevronRight} />
                  </Link>
                </div>
              </div>
            </div>
            <div className={styles["about-us-history-image-container"]}>
              <OptimizedImage
                src={historyImage}
                thumbnail={thumbhistoryImage}
                alt={"Фотография истории"}
                aspect_16_9
              />
            </div>
          </div>
        </section>

        <section className={styles["achievements-section"]}>
          <div className={styles["achievements-container"]}>
            <div className={styles["achievements-text-container"]}>
              <h2 className={styles["achievements-subtitle"]}>Удивительные достижения нашей компании за годы успешной работы на рынке</h2>
              <p className={styles["achievements-text"]}>Наша компания гордится тем, что на рынке уже более 5 лет. Мы достигли значительных успехов, включая расширение команды до 20 сотрудников. Каждый из них вносит свой вклад в наше общее дело.</p>
            </div>
            <div className={styles["achievements-statistics-wrapper"]}>
              <div className={`${styles["achievements-statistics-column"]} ${styles["first"]}`}>
                <h3 className={styles["achievements-statistics-head-title"]}>Наши достижения говорят сами</h3>
                <div className={styles["achievements-statistics-number-container"]}>
                  <h3 className={styles["achievements-statistics-number"]}>20</h3>
                  <p className={styles["achievements-statistics-number-description"]}>Сотрудников, работающих над вашим успехом каждый день</p>
                </div>
              </div>
              <div className={`${styles["achievements-statistics-column"]} ${styles["second"]}`}>
                <OptimizedImage
                  src={statistics3}
                  thumbnail={thumbStatistics3}
                  alt={"Фотография Cтатистики"}
                  no_aspect
                />
              </div>
              <div className={`${styles["achievements-statistics-column"]} ${styles["third"]}`}>
                <h3 className={styles["achievements-statistics-head-title"]}>Годы на рынке</h3>
                <div className={styles["achievements-statistics-number-container"]}>
                  <h3 className={styles["achievements-statistics-number"]}>5</h3>
                  <p className={styles["achievements-statistics-number-description"]}>Лет успешной работы и роста в индустрии</p>
                </div>
              </div>
              <div className={`${styles["achievements-statistics-column"]} ${styles["forth"]}`}>
                <h3 className={styles["achievements-statistics-head-title"]}>Наши успехи впечатляют</h3>
                <div className={styles["achievements-statistics-number-container"]}>
                  <h3 className={styles["achievements-statistics-number"]}>500</h3>
                  <p className={styles["achievements-statistics-number-description"]}>Довольных клиентов, которые выбирают нас снова и снова</p>
                </div>
              </div>
              <div className={`${styles["achievements-statistics-column"]} ${styles["fifth"]}`}>
                <OptimizedImage
                  src={statistics2}
                  thumbnail={thumbStatistics2}
                  alt={"Фотография Cтатистики"}
                  no_aspect
                />
              </div>
            </div>
          </div>
        </section>

        <Suspense fallback={<SpinnerLoaderWrapper relativeCentered />}>
          <Chart />
        </Suspense>
        <Suspense fallback={<SpinnerLoaderWrapper relativeCentered />}>
          <Faq />
        </Suspense>
      </div>
    );
  }
}

export default AboutUs;
