import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
export declare class UsersService {
    private usersRepository;
    constructor(usersRepository: Repository<User>);
    findOne(username: string): Promise<User | null>;
    create(createUserDto: CreateUserDto): Promise<User>;
}
