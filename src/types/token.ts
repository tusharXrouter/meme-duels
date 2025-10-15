export interface TokenData {
  name: string;
  fullName: string;
  poolSize: string;
  stake: string;
  price: string;
  color: string;
  gradient: string;
  cardGradient: string;
  textColor: string;
  borderColor: string;
  image?: string;
}

export interface Competition {
  id?: string;
  token1: TokenData;
  token2: TokenData;
  isLive?: boolean;
  startTime?: Date;
  endTime?: Date;
}