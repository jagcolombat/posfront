export interface Department {
  id: string;
  name: string;
  priorityOrder: number;
  generic: boolean;
  tax: number;
  ageVerification?: boolean;
}
