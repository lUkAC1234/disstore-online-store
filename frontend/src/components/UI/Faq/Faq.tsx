import styles from "./Faq.module.scss";
import { PureComponent, ReactNode } from "react";
import FaqItem from "./FaqItem/FaqItem";
import BlockLoader from "components/UI/BlockLoaders/BlockLoader";
import { origin } from "../../../../project.config.json";
import SmoothResizable from "components/UI/SmoothResizable/SmoothResizable";
import { ActionButtonLink, HeadingFive, HeadingTwo, MDContainer, Text } from "../Html/Elements/Elements";

class Faq extends PureComponent<FaqProps, FaqState> {
  state: Readonly<FaqState> = {
    faqs: [],
    error: null,
  };

  componentDidMount() {
    const cachedFaqs = sessionStorage.getItem("faqs");
    if (cachedFaqs) {
      this.setState({ faqs: JSON.parse(cachedFaqs) });
    } else {
      this.fetchData();
    }
  }

  async fetchData(): Promise<void> {
    try {
      const response: Response = await fetch(`${origin}/faqs/`);
      if (!response.ok) {
        throw new Error("Не получилось получить данные");
      }

      const faqs: FaqData[] = await response.json();
      this.setState({ faqs }, () => {
        sessionStorage.setItem("faqs", JSON.stringify(faqs));
      });
    } catch (err) {
      this.setState({ error: err.message });
      console.error(err);
    }
  }

  render(): ReactNode {
    const { faqs, error } = this.state;
    return (
      <section className={styles["faq-section"]}>
        <MDContainer className={styles["faq-container"]}>
          <HeadingTwo className={styles["faq-subtitle"]}>Часто задаваемые вопросы</HeadingTwo>
          <Text className={styles["faq-text"]}>
            Здесь вы найдете ответы на наиболее распространенные вопросы о нашей компании и услугах.
          </Text>

          {error ? (
            <Text>Error loading FAQs: {error}</Text>
          ) : (
            <div className={styles["faq-wrapper"]}>
              {faqs.map((faq, index) => (
                <BlockLoader key={faq.id || index} isLoaded={!!faq}>
                  <SmoothResizable key={faq.id || index}>
                    <FaqItem question={faq.question} answer={faq.answer} />
                  </SmoothResizable>
                </BlockLoader>
              ))}
              <div className={styles["faq-contact-us-container"]}>
                <HeadingFive bold className={styles["faq-contact-us-subtitle"]}>Все еще есть вопросы?</HeadingFive>
                <Text className={styles["faq-contact-us-text"]}>Свяжитесь с нами для получения дополнительной информации.</Text>
                <ActionButtonLink white to={`/contact/us`} className={styles["faq-contact-us-link"]}>Связаться</ActionButtonLink>
              </div>
            </div>
          )}
        </MDContainer>
      </section>
    );
  }
}

export default Faq;