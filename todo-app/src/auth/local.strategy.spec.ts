import { Test, TestingModule } from '@nestjs/testing';
import { LocalStrategy } from './local.strategy';
import { AuthService } from './auth.service';
import { UnauthorizedException } from '@nestjs/common';

const mockAuthService = {
  validateUser: jest.fn(),
};

describe('LocalStrategy', () => {
  let strategy: LocalStrategy;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LocalStrategy,
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    strategy = module.get<LocalStrategy>(LocalStrategy);
    authService = module.get<AuthService>(AuthService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(strategy).toBeDefined();
  });

  describe('validate', () => {
    it('should return the user if validation is successful', async () => {
      const user = { userId: 1, username: 'testuser' };
      mockAuthService.validateUser.mockResolvedValue(user);

      const result = await strategy.validate('testuser', 'password');

      expect(mockAuthService.validateUser).toHaveBeenCalledWith('testuser', 'password');
      expect(result).toEqual(user);
    });

    it('should throw an UnauthorizedException if validation fails', async () => {
      mockAuthService.validateUser.mockResolvedValue(null);

      await expect(strategy.validate('testuser', 'wrongpassword')).rejects.toThrow(UnauthorizedException);
      expect(mockAuthService.validateUser).toHaveBeenCalledWith('testuser', 'wrongpassword');
    });
  });
});
