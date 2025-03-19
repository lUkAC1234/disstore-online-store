declare global {
  interface FaqProps { }

  interface FaqData {
    question: string;
    answer: string;
  }
  
  interface FaqState {
    faqs: FaqData[];
    error: string | null;
  }
}

export { }