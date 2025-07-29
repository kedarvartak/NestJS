import { Test, TestingModule } from '@nestjs/testing';
import { TodoService } from './todo.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Todo } from './entities/todo.entity';
import { Repository } from 'typeorm';

const mockTodoRepository = {
  create: jest.fn(),
  save: jest.fn(),
  find: jest.fn(),
  findOneBy: jest.fn(),
  remove: jest.fn(),
};

describe('TodoService', () => {
  let service: TodoService;
  let repository: Repository<Todo>;

  beforeEach(async () => {
    // alternatively, we could also use promises here
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TodoService,
        {
          provide: getRepositoryToken(Todo),
          useValue: mockTodoRepository,
        },
      ],
    }).compile();

    service = module.get<TodoService>(TodoService);
    repository = module.get<Repository<Todo>>(getRepositoryToken(Todo));
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create()', () => {
    it('should successfully create and save a todo', async () => {
      const createTodoDto = { title: 'Test Todo', description: 'A test description' };
      const expectedTodo = { id: 1, completed: false, ...createTodoDto };

      mockTodoRepository.create.mockReturnValue(expectedTodo);
      mockTodoRepository.save.mockResolvedValue(expectedTodo);

      const result = await service.create(createTodoDto);

      expect(mockTodoRepository.create).toHaveBeenCalledWith(createTodoDto);
      expect(mockTodoRepository.save).toHaveBeenCalledWith(expectedTodo);
      expect(result).toEqual(expectedTodo);
    });
  });

  describe('findAll()', () => {
    it('should return an array of todos', async () => {
      const todos = [{ id: 1, title: 'Test', description: 'Test desc', completed: false }];
      mockTodoRepository.find.mockResolvedValue(todos);

      const result = await service.findAll();

      expect(mockTodoRepository.find).toHaveBeenCalled();
      expect(result).toEqual(todos);
    });
  });

  describe('findOne()', () => {
    it('should return a todo when found', async () => {
      const todo = { id: 1, title: 'Test', description: 'Test desc', completed: false };
      mockTodoRepository.findOneBy.mockResolvedValue(todo);

      const result = await service.findOne(1);

      expect(mockTodoRepository.findOneBy).toHaveBeenCalledWith({ id: 1 });
      expect(result).toEqual(todo);
    });

    it('should return null when todo not found', async () => {
      mockTodoRepository.findOneBy.mockResolvedValue(null);

      const result = await service.findOne(99);

      expect(mockTodoRepository.findOneBy).toHaveBeenCalledWith({ id: 99 });
      expect(result).toBeNull();
    });
  });

  describe('update()', () => {
    it('should update a todo successfully', async () => {
      const existingTodo = { id: 1, title: 'Old Title', description: 'Old Desc', completed: false };
      const updateTodoDto = { title: 'New Title' };
      const updatedTodo = { ...existingTodo, ...updateTodoDto };

      mockTodoRepository.findOneBy.mockResolvedValue(existingTodo);
      mockTodoRepository.save.mockResolvedValue(updatedTodo);

      const result = await service.update(1, updateTodoDto);

      expect(mockTodoRepository.findOneBy).toHaveBeenCalledWith({ id: 1 });
      expect(mockTodoRepository.save).toHaveBeenCalledWith(expect.objectContaining(updateTodoDto));
      expect(result).toEqual(updatedTodo);
    });

    it('should return null if todo to update is not found', async () => {
      mockTodoRepository.findOneBy.mockResolvedValue(null);

      const result = await service.update(99, { title: 'New Title' });

      expect(mockTodoRepository.findOneBy).toHaveBeenCalledWith({ id: 99 });
      expect(mockTodoRepository.save).not.toHaveBeenCalled();
      expect(result).toBeNull();
    });
  });

  describe('remove()', () => {
    it('should remove a todo successfully', async () => {
      const todo = { id: 1, title: 'Test', description: 'Test desc', completed: false };
      mockTodoRepository.findOneBy.mockResolvedValue(todo);
      mockTodoRepository.remove.mockResolvedValue(todo);

      const result = await service.remove(1);

      expect(mockTodoRepository.findOneBy).toHaveBeenCalledWith({ id: 1 });
      expect(mockTodoRepository.remove).toHaveBeenCalledWith(todo);
      expect(result).toEqual(todo);
    });

    it('should return null if todo to remove is not found', async () => {
      mockTodoRepository.findOneBy.mockResolvedValue(null);

      const result = await service.remove(99);

      expect(mockTodoRepository.findOneBy).toHaveBeenCalledWith({ id: 99 });
      expect(mockTodoRepository.remove).not.toHaveBeenCalled();
      expect(result).toBeNull();
    });
  });
});