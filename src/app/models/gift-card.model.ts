export interface IGiftModel {
    clientId?: string;
    amount?: number;
    giftCards?: IGiftCardModel[];
}

export interface IGiftCardModel {
  cardId: string;
  cardPin: string;
}

export class GiftModel implements IGiftModel{
  constructor(public clientId?:string, public amount?: number, public giftCards?: IGiftCardModel[]){}
}

export class GiftCardModel implements IGiftCardModel{
  constructor(public cardId:string, public cardPin: string){}
}

