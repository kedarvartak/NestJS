import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { LocalAuthGuard } from './local-auth.guard';
import { CreateUserDto } from '../users/dto/create-user.dto';

const mockAuthService = {
  login: jest.fn(),
};

const mockUsersService = {
  create: jest.fn(),
};

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;
  let usersService: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    })
    .overrideGuard(LocalAuthGuard)
    .useValue({ canActivate: (context) => {
      const req = context.switchToHttp().getRequest();
      req.user = { id: 1, username: 'testuser' };
      return true;
    }})
    .compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('login()', () => {
    it('should return an access token', async () => {
      const req = { user: { id: 1, username: 'testuser' } };
      const expectedToken = { access_token: 'some-jwt-token' };
      mockAuthService.login.mockResolvedValue(expectedToken);

      const result = await controller.login(req);

      expect(mockAuthService.login).toHaveBeenCalledWith(req.user);
      expect(result).toEqual(expectedToken);
    });
  });

  describe('register()', () => {
    it('should create a new user', async () => {
      const createUserDto: CreateUserDto = { username: 'newuser', password: 'password123' };
      const expectedUser = { id: 2, username: 'newuser', password: 'hashedpassword' };
      mockUsersService.create.mockResolvedValue(expectedUser);

      const result = await controller.register(createUserDto);

      expect(mockUsersService.create).toHaveBeenCalledWith(createUserDto);
      expect(result).toEqual(expectedUser);
    });
  });
});
