import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

jest.mock('bcrypt');
const mockedBcrypt = bcrypt as jest.Mocked<typeof bcrypt>;

const mockUsersService = {
  findOne: jest.fn(),
};

const mockJwtService = {
  sign: jest.fn(),
};

describe('AuthService', () => {
  let service: AuthService;
  let usersService: UsersService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    jwtService = module.get<JwtService>(JwtService);

    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('validateUser()', () => {
    it('should return user data without password when credentials are valid', async () => {
      const username = 'testuser';
      const password = 'plainpassword123';
      const hashedPassword = 'hashedpassword123';
      const user = {
        id: 1,
        username: 'testuser',
        password: hashedPassword,
      };

      mockUsersService.findOne.mockResolvedValue(user);
      mockedBcrypt.compare.mockResolvedValue(true as never);

      const result = await service.validateUser(username, password);

      expect(mockUsersService.findOne).toHaveBeenCalledWith(username);
      expect(mockedBcrypt.compare).toHaveBeenCalledWith(password, hashedPassword);
      expect(result).toEqual({
        id: 1,
        username: 'testuser',
      });
    });

    it('should return null when user is not found', async () => {
      const username = 'nonexistentuser';
      const password = 'somepassword';

      mockUsersService.findOne.mockResolvedValue(null);

      const result = await service.validateUser(username, password);

      expect(mockUsersService.findOne).toHaveBeenCalledWith(username);
      expect(mockedBcrypt.compare).not.toHaveBeenCalled();
      expect(result).toBeNull();
    });

    it('should return null when password is incorrect', async () => {
      const username = 'testuser';
      const password = 'wrongpassword';
      const hashedPassword = 'hashedpassword123';
      const user = {
        id: 1,
        username: 'testuser',
        password: hashedPassword,
      };

      mockUsersService.findOne.mockResolvedValue(user);
      mockedBcrypt.compare.mockResolvedValue(false as never);

      const result = await service.validateUser(username, password);

      expect(mockUsersService.findOne).toHaveBeenCalledWith(username);
      expect(mockedBcrypt.compare).toHaveBeenCalledWith(password, hashedPassword);
      expect(result).toBeNull();
    });

    it('should handle bcrypt compare errors', async () => {
      const username = 'testuser';
      const password = 'plainpassword123';
      const hashedPassword = 'hashedpassword123';
      const user = {
        id: 1,
        username: 'testuser',
        password: hashedPassword,
      };

      mockUsersService.findOne.mockResolvedValue(user);
      mockedBcrypt.compare.mockRejectedValue(new Error('Bcrypt error') as never);

      await expect(service.validateUser(username, password)).rejects.toThrow('Bcrypt error');

      expect(mockUsersService.findOne).toHaveBeenCalledWith(username);
      expect(mockedBcrypt.compare).toHaveBeenCalledWith(password, hashedPassword);
    });

    it('should handle users service errors', async () => {
      const username = 'testuser';
      const password = 'plainpassword123';

      mockUsersService.findOne.mockRejectedValue(new Error('Database error'));

      await expect(service.validateUser(username, password)).rejects.toThrow('Database error');

      expect(mockUsersService.findOne).toHaveBeenCalledWith(username);
      expect(mockedBcrypt.compare).not.toHaveBeenCalled();
    });
  });

  describe('login()', () => {
    it('should return access token when user data is provided', async () => {
      const user = {
        id: 1,
        username: 'testuser',
      };
      const expectedPayload = {
        username: user.username,
        sub: user.id,
      };
      const expectedToken = 'jwt.access.token';

      mockJwtService.sign.mockReturnValue(expectedToken);

      const result = await service.login(user);

      expect(mockJwtService.sign).toHaveBeenCalledWith(expectedPayload);
      expect(result).toEqual({
        access_token: expectedToken,
      });
    });
    
    it('should throw an error when JWT signing fails', async () => {
      const user = {
        id: 1,
        username: 'testuser',
      };

      mockJwtService.sign.mockImplementation(() => {
        throw new Error('JWT signing error');
      });

      await expect(service.login(user)).rejects.toThrow('JWT signing error');
    });

    it('should create payload with correct structure', async () => {
      const user = {
        id: 42,
        username: 'anotheruser',
      };
      const expectedPayload = {
        username: 'anotheruser',
        sub: 42,
      };
      const expectedToken = 'another.jwt.token';

      mockJwtService.sign.mockReturnValue(expectedToken);

      const result = await service.login(user);

      expect(mockJwtService.sign).toHaveBeenCalledWith(expectedPayload);
      expect(result).toEqual({
        access_token: expectedToken,
      });
    });
  });
});
