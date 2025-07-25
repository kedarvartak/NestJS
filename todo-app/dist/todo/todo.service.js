"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TodoService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const todo_entity_1 = require("./entities/todo.entity");
const typeorm_2 = require("typeorm");
let TodoService = class TodoService {
    todoRepository;
    constructor(todoRepository) {
        this.todoRepository = todoRepository;
    }
    create(createTodoDto) {
        const newTodo = this.todoRepository.create(createTodoDto);
        return this.todoRepository.save(newTodo);
    }
    findAll() {
        return this.todoRepository.find();
    }
    findOne(id) {
        return this.todoRepository.findOneBy({ id });
    }
    async update(id, updateTodoDto) {
        const todo = await this.findOne(id);
        if (!todo) {
            return null;
        }
        Object.assign(todo, updateTodoDto);
        return this.todoRepository.save(todo);
    }
    async remove(id) {
        const todo = await this.findOne(id);
        if (!todo) {
            return null;
        }
        return this.todoRepository.remove(todo);
    }
};
exports.TodoService = TodoService;
exports.TodoService = TodoService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(todo_entity_1.Todo)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], TodoService);
//# sourceMappingURL=todo.service.js.map