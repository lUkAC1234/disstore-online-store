import { WithTranslation } from "react-i18next";

declare global {
  interface FaqProps extends WithTranslation { }

  interface FaqData {
    id: number;
    question: string;
    answer: string;
  }
  
  interface FaqState {
    faqs: FaqData[];
    error: string | null;
  }
}

export { }