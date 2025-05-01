import { Expose } from 'class-transformer';

export class UserProfileDTO {
  @Expose()
  id: number;

  @Expose()
  name: string;

  @Expose()
  email: string;
}
