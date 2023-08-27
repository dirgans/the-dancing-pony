import { JwtStrategy } from './jwt.strategy';
import { ExtractJwt, Strategy } from 'passport-jwt';

describe('JwtStrategy', () => {
  it('should be defined', () => {
    const strategy = new JwtStrategy();
    expect(strategy).toBeDefined();
  });

  it('Initialized', () => {
    const jwtFromRequestSpy = jest.spyOn(
      ExtractJwt,
      'fromAuthHeaderAsBearerToken',
    );
    const strategyConstructor = jest.spyOn(Strategy.prototype, 'constructor');

    const strategy = new JwtStrategy();

    expect(strategy).toBeDefined();
    expect(jwtFromRequestSpy).toHaveBeenCalled();

    jwtFromRequestSpy.mockRestore();
    strategyConstructor.mockRestore();
  });
});
