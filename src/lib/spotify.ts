import axios, { AxiosResponse } from "axios";

interface SpotifyTokenResp {
  access_token: string;
  expires_in: number;
  token_type: string;
}

const getAccessToken = async (): Promise<AxiosResponse<SpotifyTokenResp>> => {
  return await axios({
    method: "POST",
    url: "https://accounts.spotify.com/api/token",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    data: {
      grant_type: "client_credentials",
      client_id: import.meta.env.VITE_SPOTIFY_CLIENT_ID,
      client_secret: import.meta.env.VITE_SPOTIFY_CLIENT_SECRET
    }
  });
};

export { getAccessToken };
