export interface Profile {
  id: string;
  name: string;
  age: number;
  location: string;
  bio: string;
  interests: string[];
  image: string;
  distance?: string;
  /** If true, liking this profile will trigger a match */
  willMatch: boolean;
}

export type SwipeDirection = "left" | "right" | "up";
export type SwipeAction = "like" | "pass" | "superlike";

export interface SwipeHistoryItem {
  profile: Profile;
  direction: SwipeDirection;
  action: SwipeAction;
}

export interface ChatMessage {
  id: string;
  sender: "user" | "them";
  text: string;
  timestamp: string;
}

export interface Conversation {
  profileId: string;
  messages: ChatMessage[];
}

export interface SwipeState {
  currentIndex: number;
  likes: string[];
  passes: string[];
  superlikes: string[];
  matches: Profile[];
  history: SwipeHistoryItem[];
}
