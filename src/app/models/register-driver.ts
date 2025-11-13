import { VehicleDto } from "./vehicle";

export interface RegisterDriverDto {
  FullName: string;
  Email: string;
  PhoneNumber: string;
  Password: string;
  License: string;
  Vehicle: VehicleDto;
}
