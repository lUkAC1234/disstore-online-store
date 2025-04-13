
declare global {
  interface FaqProps {}
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