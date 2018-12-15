export interface Department {
  id: number;
  name: string;
  priorityOrder: number;
  generic: boolean;
  tax: number;
  ageVerification?: boolean;
}
