declare global {
  interface FeedbackProps { }
  
  interface FeedbackData {
      id: number;
      user: UserData;
      text: string;
      created_at: string;
      is_allowed: boolean;
  }
  
  interface FeedbackState {
      feedbacks: FeedbackData[];
      error: string | null;
  }
}

export { }