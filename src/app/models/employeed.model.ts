export interface IEmployeedModel {
    firstname?: string;
    lastname?: string;
    username?: string;
    password?: string;
    userPositionId?: string;
    companyId?: number;
}

export interface IPositionModel {
  name: string;
  roleId: string;
  id: string;
}

export class EmployeedModel implements IEmployeedModel{
  constructor(public firstname?: string, public lastname?: string, public username?: string, public password?: string,
              public userPositionId?: string, public companyId?: number) {}
}
