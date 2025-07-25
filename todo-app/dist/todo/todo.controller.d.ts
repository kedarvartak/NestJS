import { TodoService } from './todo.service';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
export declare class TodoController {
    private readonly todoService;
    constructor(todoService: TodoService);
    create(createTodoDto: CreateTodoDto): Promise<import("./entities/todo.entity").Todo>;
    findAll(): Promise<import("./entities/todo.entity").Todo[]>;
    findOne(id: string): Promise<import("./entities/todo.entity").Todo | null>;
    update(id: string, updateTodoDto: UpdateTodoDto): Promise<import("./entities/todo.entity").Todo | null>;
    remove(id: string): Promise<import("./entities/todo.entity").Todo | null>;
}
