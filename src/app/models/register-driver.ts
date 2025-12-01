import { VehicleDto } from "./vehicle";

export interface RegisterDriverDto {
  FullName: string;
  Email: string;
  Gender:number;
  DateOfBirth:Date;
  PhoneNumber: string;
  Password: string;
  License: string;
  Vehicle: VehicleDto;
}
