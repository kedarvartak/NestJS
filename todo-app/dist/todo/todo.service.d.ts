import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { Todo } from './entities/todo.entity';
import { Repository } from 'typeorm';
export declare class TodoService {
    private todoRepository;
    constructor(todoRepository: Repository<Todo>);
    create(createTodoDto: CreateTodoDto): Promise<Todo>;
    findAll(): Promise<Todo[]>;
    findOne(id: number): Promise<Todo | null>;
    update(id: number, updateTodoDto: UpdateTodoDto): Promise<Todo | null>;
    remove(id: number): Promise<Todo | null>;
}
