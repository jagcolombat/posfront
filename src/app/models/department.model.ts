import {EDepartmentType} from "../utils/department-type.enum";


export interface Department {
  id: string;
  name: string;
  priorityOrder: number;
  generic: boolean;
  tax: number;
  ageVerification?: boolean;
  departmentType?: EDepartmentType;
  parentId?: number;
}
