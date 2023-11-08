import { SetMetadata } from '@nestjs/common';
import { UserRole } from 'src/user/entities/user.entity';

export type AllowedRoles = UserRole | 'Any';

// guard 에서 reflector를 통해 불러올 수 있다.
export const Role = (roles: AllowedRoles[]) => SetMetadata('roles', roles);
