import styles from "./Faq.module.scss";
import { PureComponent, ReactNode } from "react";
import FaqItem from "./FaqItem/FaqItem";
import BlockLoader from "components/UI/BlockLoaders/BlockLoader";
import { origin } from "../../../project.config.json";
import { Link } from "react-router-dom";
import SmoothResizable from "components/UI/SmoothResizable/SmoothResizable";

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
        <div className={styles["faq-container"]}>
          <h2 className={styles["faq-subtitle"]}>Часто задаваемые вопросы</h2>
          <p className={styles["faq-text"]}>
            Здесь вы найдете ответы на наиболее распространенные вопросы о нашей компании и услугах.
          </p>

          {error ? (
            <p>Error loading FAQs: {error}</p>
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
                <h3 className={styles["faq-contact-us-subtitle"]}>Все еще есть вопросы?</h3>
                <p className={styles["faq-contact-us-text"]}>Свяжитесь с нами для получения дополнительной информации.</p>
                <Link to="" className={styles["faq-contact-us-link"]}>Связаться</Link>
              </div>
            </div>
          )}
        </div>
      </section>
    );
  }
}

export default Faq;