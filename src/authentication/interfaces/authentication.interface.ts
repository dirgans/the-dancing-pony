import { IResponse } from 'src/common/interfaces/response.interface';
import { LoginDto } from '../dto/login.dto';

export interface ILoginResponse {
  accessToken: string;
}

export interface IAuthenticationService {
  login(loginDto: LoginDto): IResponse<ILoginResponse>;
}
