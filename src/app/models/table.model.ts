export interface ITable {
  id: string;
  number: number;
  label?: string;
}

export class Table implements ITable {
  id: string;
  constructor(public number: number, public label?: string) { }
}
