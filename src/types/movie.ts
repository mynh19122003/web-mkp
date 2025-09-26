export interface Movie {
  id: string;
  title: string;
  originalTitle?: string;
  slug?: string;
  year: number;
  poster: string;
  thumbnail?: string;
  backdrop?: string;
  description: string;
  genres: string[];
  country: string;
  duration: number; // in minutes
  quality: string; // HD, 4K, etc.
  rating: number; // 0-10
  imdbRating?: number; // IMDb rating 0-10
  totalEpisodes?: number; // Total number of episodes for TV series
  currentEpisode?: number; // Current episode number
  episodes?: Episode[];
  isCompleted: boolean;
  releaseDate?: string;
  director?: string;
  cast?: string[];
  trailer?: string;
  videoUrl?: string;
  views?: number;
  type?: 'movie' | 'tv';
  tmdbId?: number;
}

export interface Episode {
  id: string;
  episodeNumber: number;
  title: string;
  duration: number;
  videoUrl: string;
  thumbnail: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
}

export interface Country {
  id: string;
  name: string;
  slug: string;
  flag: string;
}
