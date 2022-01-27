export interface IMediaValue {
  name: string;
  quantity: number;
  value: number;
}

export class MediaValue implements IMediaValue{
  constructor(public name: string,public quantity: number,public value: number) {}
}

export class Media {
  constructor(public values: MediaValue[], public total: number) {}
}
