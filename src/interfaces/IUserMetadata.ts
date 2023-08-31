interface IUserMetadata {
  name: string;
  about: string;
  picture: string;
}

interface IUserMetadataWithPubkey extends IUserMetadata {
  pubkey: string;
}

export { IUserMetadata, IUserMetadataWithPubkey };
