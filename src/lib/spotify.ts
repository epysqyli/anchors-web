import axios, { AxiosResponse } from "axios";
import { IFeedRefTag } from "~/interfaces/IFeedRefTag";
import { IRefTag } from "~/interfaces/IRefTag";
import SpotifyTokenResp from "~/interfaces/ISpotifyTokenResp";

interface SpotifyTracksResponse {
  tracks: {
    items: {
      name: string;
      artists: { name: string }[];
      external_urls: { spotify: string };
      album: {
        name: string;
        images: { height: number; width: number; url: string }[];
      };
    }[];
  };
}

interface SpotifySingleTrackResponse {
  name: string;
  album: {
    name: string;
    images: { height: number; width: number; url: string }[];
  };
  artists: { name: string }[];
}

const getAccessToken = async (): Promise<void> => {
  const resp: AxiosResponse<SpotifyTokenResp> = await axios({
    method: "POST",
    url: "https://accounts.spotify.com/api/token",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    data: {
      grant_type: "client_credentials",
      client_id: import.meta.env.VITE_SPOTIFY_CLIENT_ID,
      client_secret: import.meta.env.VITE_SPOTIFY_CLIENT_SECRET
    }
  });

  const message: SpotifyTokenResp = { ...resp.data, tokenOp: "set", tokenProvider: "spotify" };
  navigator.serviceWorker.controller?.postMessage(message);
};

const searchSongs = async (query: string): Promise<IRefTag[]> => {
  const queryParams = query.split(" ").reduce((acc, s) => `${acc}+${s}`);
  const url = `https://api.spotify.com/v1/search?q=${queryParams}&type=track`;

  let resp;

  try {
    resp = await fetch(url);

    if (resp.status !== 200) {
      throw new Error("invalid or expired token");
    }
  } catch (error) {
    await getAccessToken();
    resp = await fetch(url);
  }

  const results: SpotifyTracksResponse = await resp.json();

  return results.tracks.items.map((item) => {
    return {
      category: "song",
      url: item.external_urls.spotify,
      preview: item.album.images[1].url,
      title: item.name,
      additionalInfoOne: item.album.name,
      additionalInfoTwo: item.artists.map((artist) => artist.name).join(", ")
    };
  });
};

const fetchSong = async (id: string, url: string): Promise<IFeedRefTag> => {
  const requestUrl = `https://api.spotify.com/v1/tracks/${id}`;
  let resp;

  try {
    resp = await fetch(requestUrl);
    if (resp.status !== 200) {
      throw new Error("invalid or expired token");
    }
  } catch (error) {
    await getAccessToken();
    resp = await fetch(requestUrl);
  }

  const track: SpotifySingleTrackResponse = await resp.json();

  return {
    preview: track.album.images[1].url,
    primaryInfo: track.name,
    secondaryInfo: track.artists.map((artist) => artist.name).join(", "),
    url: url,
    category: "song"
  };
};

export { searchSongs, fetchSong };
