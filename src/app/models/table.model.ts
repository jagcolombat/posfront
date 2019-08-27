export interface ITable {
  id: string;
  label: string;
  employ: string;
}

export class Table implements ITable {
  id: string;
  constructor(public label: string, public employ: string) {
  }
}
