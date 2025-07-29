import { Test, TestingModule } from '@nestjs/testing';
import { TodoController } from './todo.controller';
import { TodoService } from './todo.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';

const mockTodoService = {
  create: jest.fn(),
  findAll: jest.fn(),
  findOne: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
};

describe('TodoController', () => {
  let controller: TodoController;
  let service: TodoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TodoController],
      providers: [
        {
          provide: TodoService,
          useValue: mockTodoService,
        },
      ],
    })
    .overrideGuard(JwtAuthGuard)
    .useValue({ canActivate: () => true })
    .compile();

    controller = module.get<TodoController>(TodoController);
    service = module.get<TodoService>(TodoService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create()', () => {
    it('should create a todo', async () => {
      const createTodoDto: CreateTodoDto = { title: 'New Todo', description: 'A new todo' };
      const expectedTodo = { id: 1, completed: false, ...createTodoDto };
      mockTodoService.create.mockResolvedValue(expectedTodo);

      const result = await controller.create(createTodoDto);

      expect(mockTodoService.create).toHaveBeenCalledWith(createTodoDto);
      expect(result).toEqual(expectedTodo);
    });
  });

  describe('findAll()', () => {
    it('should return an array of todos', async () => {
      const todos = [{ id: 1, title: 'Test', description: 'Test desc', completed: false }];
      mockTodoService.findAll.mockResolvedValue(todos);

      const result = await controller.findAll();

      expect(mockTodoService.findAll).toHaveBeenCalled();
      expect(result).toEqual(todos);
    });
  });

  describe('findOne()', () => {
    it('should return a single todo', async () => {
      const todo = { id: 1, title: 'Test', description: 'Test desc', completed: false };
      mockTodoService.findOne.mockResolvedValue(todo);

      const result = await controller.findOne('1');

      expect(mockTodoService.findOne).toHaveBeenCalledWith(1);
      expect(result).toEqual(todo);
    });
  });

  describe('update()', () => {
    it('should update a todo', async () => {
      const updateTodoDto: UpdateTodoDto = { title: 'Updated Todo' };
      const expectedTodo = { id: 1, title: 'Updated Todo', description: 'A test description', completed: false };
      mockTodoService.update.mockResolvedValue(expectedTodo);

      const result = await controller.update('1', updateTodoDto);

      expect(mockTodoService.update).toHaveBeenCalledWith(1, updateTodoDto);
      expect(result).toEqual(expectedTodo);
    });
  });

  describe('remove()', () => {
    it('should remove a todo', async () => {
      const todo = { id: 1, title: 'Test', description: 'Test desc', completed: false };
      mockTodoService.remove.mockResolvedValue(todo);

      const result = await controller.remove('1');

      expect(mockTodoService.remove).toHaveBeenCalledWith(1);
      expect(result).toEqual(todo);
    });
  });
});
