import { SetMetadata } from '@nestjs/common';
import { EmployeeRoles } from '../employee/entities/employee.roles';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: EmployeeRoles[]) =>
  SetMetadata(ROLES_KEY, roles);
