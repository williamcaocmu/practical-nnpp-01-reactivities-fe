type Activity = {
  id: string;
  createdAt?: string;
  updatedAt?: string;
  title: string;
  description: string;
  category: string;
  isCanceled: boolean;
  city: string;
  venue: string;
  latitude: number;
  longitude: number;
  date: Date | string;
  attendees: Profile[];
  isGoing: boolean;
  hostId: string;
  host: Profile;
  isHost: boolean;
  isGoing: boolean;
};

type CursorPagedList<T> = {
  items: T[];
  pageInfo: {
    hasNextPage: boolean;
    nextCursor: string;
  };
};

type User = {
  id: string;
  username: string;
  displayName: string;
  imageUrl?: string;
};

type Profile = {
  id: string;
  displayName: string;
  bio?: string;
  imageUrl?: string;
};

type Photo = {
  id: string;
  url: string;
};
