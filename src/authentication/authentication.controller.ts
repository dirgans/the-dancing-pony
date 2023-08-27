import { Controller, Post, Body, UseFilters } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { LoginDto } from './dto/login.dto';
import { ILoginResponse } from './interfaces/authentication.interface';
import { IResponse } from '../common/interfaces/response.interface';
import { ResponseFilter } from '../common/filters/response.filter';

@UseFilters(ResponseFilter)
@Controller('authentication')
export class AuthenticationController {
  constructor(private readonly authenticationService: AuthenticationService) {}

  /**
   * Endpoint to handle user login.
   *
   * @param {LoginDto} loginDto - The data transfer object containing login credentials.
   * @returns {IResponse<ILoginResponse>} An object representing the response containing login status and data.
   */
  @Post('login')
  login(@Body() loginDto: LoginDto): IResponse<ILoginResponse> {
    return this.authenticationService.login(loginDto);
  }
}
