export interface RegisterRiderDto {
  fullName: string;
  email: string;
  phoneNumber: string;
  password: string;
  provider?: string;
  DateOfBirth:Date;
  Gender:number;
}
