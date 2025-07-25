import { Test, TestingModule } from '@nestjs/testing';
import { TodoService } from './todo.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Todo } from './entities/todo.entity';
import { Repository } from 'typeorm';

// mock repo
const mockTodoRepository = {
  create: jest.fn(),
  save: jest.fn(),
  find: jest.fn(),
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
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create()', () => {
    it('should successfully create and save a todo', async () => {
      const createTodoDto = { title: 'Test Todo', description: 'A test description' };
      const expectedTodo = { id: 1, completed: false, ...createTodoDto };

      // We tell our mock what to do when its methods are called
      mockTodoRepository.create.mockReturnValue(expectedTodo);
      mockTodoRepository.save.mockResolvedValue(expectedTodo);

      const result = await service.create(createTodoDto);

      // We assert that the methods were called correctly and the result is what we expect
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
}); 