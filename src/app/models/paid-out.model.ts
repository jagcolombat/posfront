export interface IPaidOut {
  amount: number;
  description?: string;
  type?: number;
}

export class PaidOut implements IPaidOut {

  constructor(public amount: number, public description?: string, public type?: number) {}
}
