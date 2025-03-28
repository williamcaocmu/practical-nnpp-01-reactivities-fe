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
  followersCount?: number;
  followingCount?: number;
  following?: boolean;
};

type Photo = {
  id: string;
  url: string;
  isMain: boolean;
};

type LocationIQSuggestion = {
  place_id: string;
  osm_id: string;
  osm_type: string;
  licence: string;
  lat: string;
  lon: string;
  boundingbox: string[];
  class: string;
  type: string;
  display_name: string;
  display_place: string;
  display_address: string;
  address: LocationIQAddress;
};

type LocationIQAddress = {
  name: string;
  house_number: string;
  road: string;
  suburb?: string;
  town?: string;
  village?: string;
  city?: string;
  county: string;
  state: string;
  postcode: string;
  country: string;
  country_code: string;
  neighbourhood?: string;
};
