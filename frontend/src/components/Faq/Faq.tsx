import styles from "./Faq.module.scss";
import { PureComponent, ReactNode } from "react";
import FaqItem from "./FaqItem/FaqItem";
import BlockLoader from "components/BlockLoaders/BlockLoader";
import { origin } from "../../../project.config.json";

interface FaqProps { }


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
      fetch(`${origin}/faqs/`)
        .then((response) => {
          if (!response.ok) {
            throw new Error("Не получилось получить данные");
          }
          return response.json();
        })
        .then((data: FaqData[]) => {
          sessionStorage.setItem("faqs", JSON.stringify(data));
          this.setState({ faqs: data });
        })
        .catch((error) => {
          console.error("Fetching FAQs failed:", error);
          this.setState({ error: error.message });
        });
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
                <BlockLoader isLoaded={!!faq}>
                  <FaqItem key={index} question={faq.question} answer={faq.answer} />
                </BlockLoader>
              ))}
            </div>
          )}
        </div>
      </section>
    );
  }
}

export default Faq;