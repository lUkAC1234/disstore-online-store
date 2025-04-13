import styles from "./AboutUs.module.scss";
import { lazy, PureComponent, ReactNode, Suspense } from "react";
import historyImage from "assets/main/images/aboutus/historyImage.webp";
import statistics2 from "assets/main/images/aboutus/statistics2.webp";
import statistics3 from "assets/main/images/aboutus/statistics3.webp";
import thumbhistoryImage from "assets/main/images/aboutus/thumb_historyImage.webp"
import thumbStatistics2 from "assets/main/images/aboutus/thumb_statistics2.webp"
import thumbStatistics3 from "assets/main/images/aboutus/thumb_statistics3.webp"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronRight } from "@fortawesome/free-solid-svg-icons";
import SpinnerLoaderWrapper from "components/Loaders/SpinnerLoaderWrapper";
import OptimizedImage from "components/UI/OptimizedImage/OptimizedImage";
import { ActionButtonLink, Container, HeadingOne, HeadingThree, HeadingTwo, MDContainer, Section, SmallText, Text } from "components/UI/Html/Elements/Elements";

const Chart = lazy(() => import("components/UI/Chart/Chart"));
const Faq = lazy(() => import("components/UI/Faq/Faq"));

class AboutUs extends PureComponent<AboutUsProps, AboutUsState> {
  componentDidMount(): void { window.scrollTo({ top: 0, behavior: "smooth" }); }

  render(): ReactNode {
    return (
      <div className={styles["about-us-container"]}>
        <Section className={styles["about-us-heading-section"]}>
          <Container className={styles["about-us-heading-container"]}>
            <HeadingOne>О нас</HeadingOne>
            <Text className={styles["about-us-heading-text"]}>Наша основная цель — предложить уникальные и инновационные продукты, которые не только вдохновляют, но и приносят искреннюю радость и удовлетворение нашим клиентам, помогая им делать жизнь ярче и интереснее.</Text>
          </Container>
        </Section>

        <Section className={styles["about-us-history-section"]}>
          <Container centerGrid className={styles["about-us-history-container"]}>
            <MDContainer className={styles["about-us-history-content"]}>
              <HeadingTwo bold white>История и ценности нашей компании</HeadingTwo>
              <div className={styles["about-us-history-content-text-container"]}>
                <Text white>Наша компания была основана с целью предоставить клиентам лучшие товары и услуги. Мы верим в инновации и стремимся к постоянному совершенствованию. Наша миссия — делать жизнь наших клиентов лучше и удобнее.</Text>
                <div className={styles["about-us-history-links-controller"]}>
                  <ActionButtonLink white to={`/catalog`}>Каталог</ActionButtonLink>
                  <ActionButtonLink to={`/contact/us`} className={styles["about-us-history-link-black"]}>Связаться <FontAwesomeIcon icon={faChevronRight} /></ActionButtonLink>
                </div>
              </div>
            </MDContainer>
            <MDContainer className={styles["about-us-history-image-container"]}>
              <OptimizedImage
                src={historyImage}
                thumbnail={thumbhistoryImage}
                alt={"Фотография истории"}
                aspect_16_9
              />
            </MDContainer>
          </Container>
        </Section>

        <Section className={styles["achievements-section"]}>
          <Container centerGrid className={styles["achievements-container"]}>
            <MDContainer>
              <div className={styles["achievements-text-container"]}>
                <HeadingTwo bold>Удивительные достижения нашей компании за годы успешной работы на рынке</HeadingTwo>
                <Text className={styles["achievements-text"]}>Наша компания гордится тем, что на рынке уже более 5 лет. Мы достигли значительных успехов, включая расширение команды до 20 сотрудников. Каждый из них вносит свой вклад в наше общее дело.</Text>
              </div>
              <div className={styles["achievements-statistics-wrapper"]}>
                <div className={`${styles["achievements-statistics-column"]} ${styles["first"]}`}>
                  <HeadingThree className={styles["achievements-statistics-head-title"]}>Наши достижения говорят сами</HeadingThree>
                  <div className={styles["achievements-statistics-number-container"]}>
                    <HeadingThree bold className={styles["achievements-statistics-number"]}>20</HeadingThree>
                    <SmallText>Сотрудников, работающих над вашим успехом каждый день</SmallText>
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
                  <HeadingThree className={styles["achievements-statistics-head-title"]}>Годы на рынке</HeadingThree>
                  <div className={styles["achievements-statistics-number-container"]}>
                    <HeadingThree bold className={styles["achievements-statistics-number"]}>5</HeadingThree>
                    <SmallText>Лет успешной работы и роста в индустрии</SmallText>
                  </div>
                </div>
                <div className={`${styles["achievements-statistics-column"]} ${styles["forth"]}`}>
                  <HeadingThree className={styles["achievements-statistics-head-title"]}>Наши успехи впечатляют</HeadingThree>
                  <div className={styles["achievements-statistics-number-container"]}>
                    <HeadingThree bold className={styles["achievements-statistics-number"]}>500</HeadingThree>
                    <SmallText>Довольных клиентов, которые выбирают нас снова и снова</SmallText>
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
            </MDContainer>
          </Container>
        </Section>

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
