import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';


jest.mock('bcrypt');
const mockedBcrypt = bcrypt as jest.Mocked<typeof bcrypt>;

const mockUserRepository = {
  create: jest.fn(),
  save: jest.fn(),
  findOneBy: jest.fn(),
};

describe('UsersService', () => {
  let service: UsersService;
  let repository: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repository = module.get<Repository<User>>(getRepositoryToken(User));

    
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findOne()', () => {
    it('should return a user when found', async () => {
      const username = 'testuser';
      const expectedUser = {
        id: 1,
        username: 'testuser',
        password: 'hashedpassword',
      };

      mockUserRepository.findOneBy.mockResolvedValue(expectedUser);

      const result = await service.findOne(username);

      expect(mockUserRepository.findOneBy).toHaveBeenCalledWith({ username });
      expect(result).toEqual(expectedUser);
    });

    it('should return null when user not found', async () => {
      const username = 'nonexistentuser';

      mockUserRepository.findOneBy.mockResolvedValue(null);

      const result = await service.findOne(username);

      expect(mockUserRepository.findOneBy).toHaveBeenCalledWith({ username });
      expect(result).toBeNull();
    });
  });

  describe('create()', () => {
    it('should successfully create and save a user with hashed password', async () => {
      const createUserDto = {
        username: 'newuser',
        password: 'plainpassword123',
      };

      const salt = 'mockedsalt';
      const hashedPassword = 'mockedhashedpassword';
      const createdUser = {
        id: 1,
        username: 'newuser',
        password: hashedPassword,
      };
      const savedUser = { ...createdUser };

      mockedBcrypt.genSalt.mockResolvedValue(salt as never);
      mockedBcrypt.hash.mockResolvedValue(hashedPassword as never);

      mockUserRepository.create.mockReturnValue(createdUser);
      mockUserRepository.save.mockResolvedValue(savedUser);

      const result = await service.create(createUserDto);

      expect(mockedBcrypt.genSalt).toHaveBeenCalled();
      expect(mockedBcrypt.hash).toHaveBeenCalledWith(createUserDto.password, salt);

      expect(mockUserRepository.create).toHaveBeenCalledWith({
        username: createUserDto.username,
        password: hashedPassword,
      });
      expect(mockUserRepository.save).toHaveBeenCalledWith(createdUser);

      expect(result).toEqual(savedUser);
    });

    it('should handle bcrypt errors during password hashing', async () => {
      const createUserDto = {
        username: 'newuser',
        password: 'plainpassword123',
      };

      const error = new Error('Bcrypt error');
      mockedBcrypt.genSalt.mockRejectedValue(error as never);

      await expect(service.create(createUserDto)).rejects.toThrow('Bcrypt error');

      expect(mockedBcrypt.genSalt).toHaveBeenCalled();
      expect(mockUserRepository.create).not.toHaveBeenCalled();
      expect(mockUserRepository.save).not.toHaveBeenCalled();
    });

    it('should handle repository save errors', async () => {
      const createUserDto = {
        username: 'newuser',
        password: 'plainpassword123',
      };

      const salt = 'mockedsalt';
      const hashedPassword = 'mockedhashedpassword';
      const createdUser = {
        id: 1,
        username: 'newuser',
        password: hashedPassword,
      };

      const saveError = new Error('Database error');

      mockedBcrypt.genSalt.mockResolvedValue(salt as never);
      mockedBcrypt.hash.mockResolvedValue(hashedPassword as never);

      mockUserRepository.create.mockReturnValue(createdUser);
      mockUserRepository.save.mockRejectedValue(saveError);

      await expect(service.create(createUserDto)).rejects.toThrow('Database error');

      expect(mockUserRepository.create).toHaveBeenCalledWith({
        username: createUserDto.username,
        password: hashedPassword,
      });
      expect(mockUserRepository.save).toHaveBeenCalledWith(createdUser);
    });
  });
});
