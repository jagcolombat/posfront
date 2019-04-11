export interface IPaidOut {
  amount: number;
  description?: string;
}

export class PaidOut implements IPaidOut {

  constructor(public amount: number, public description?: string) {}
}
