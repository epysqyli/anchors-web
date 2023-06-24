export default interface SpotifyTokenResp {
  access_token: string;
  expires_in: number;
  token_type: string;
  tokenOp: "set" | "clear";
  tokenProvider: string;
}
