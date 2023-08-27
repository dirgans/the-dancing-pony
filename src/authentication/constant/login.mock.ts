import { IResponse } from 'src/common/interfaces/response.interface';
import { LoginDto } from '../dto/login.dto';
import { ILoginResponse } from '../interfaces/authentication.interface';

export const loginDto: LoginDto = {
  nickname: 'baggins',
  password: 'Th3R1ng$',
};

export const loginSucces: IResponse<ILoginResponse> = {
  status: 'Success',
  message: 'Login successfully!',
  data: {
    accessToken:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Ijk2NWFlM2NmLWM5NDYtNGIwMi1iOTI3LTlmZDI0MTc1ZmZmZiIsIm5hbWUiOiJGcm9nbyBCYWdnaW5zIiwidXNlcm5hbWUiOiJiYWdnaW5zIiwicGFzc3dvcmQiOiJUaDNSMW5nJCIsImlzQWN0aXZlIjp0cnVlLCJhZ2UiOjMwLCJwZXJtaXNzaW9ucyI6WyJkaXNoZXMubGlzdCIsImRpc2hlcy5kZXRhaWwiLCJkaXNoZXMuY3JlYXRlIiwiZGlzaGVzLnVwZGF0ZSIsImRpc2hlcy5kZWxldGUiLCJkaXNoZXMucmF0ZSJdLCJpYXQiOjE2OTI4MDc2MzQsImV4cCI6MTY5MjgxMTIzNH0.NW0Ek3rByOo_ONKpEaeqIC25GOpdXqpLu3XhSS_Ftzc',
  },
};

export const wrongUsernameOrPasswordError: IResponse<any> = {
  status: 'Failed',
  message: 'Wrong nickname or password!',
};
