import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassEncryptionUtils } from 'src/common/PassEncryptionUtils';
import { EmployeeService } from 'src/employee/employee.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private employeeService: EmployeeService,
    private jwtService: JwtService,
  ) {}

  async signIn(id: string, pass: string): Promise<any> {
    const user = await this.employeeService.findOne(id);
    if (!user) {
      throw new UnauthorizedException();
    }
    const passwordMatch = await PassEncryptionUtils.verifyPassword(
      pass,
      user.pass,
    );
    if (!passwordMatch) {
      throw new UnauthorizedException();
    }

    const payload = { sub: user.id_employee, id_employee: user.id_employee };
    return {
      jwt_token: await this.jwtService.signAsync(payload),
    };
  }
}
