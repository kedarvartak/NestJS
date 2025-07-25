import { AuthService } from './auth.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { UsersService } from 'src/users/users.service';
export declare class AuthController {
    private authService;
    private usersService;
    constructor(authService: AuthService, usersService: UsersService);
    login(req: any): Promise<{
        access_token: string;
    }>;
    register(createUserDto: CreateUserDto): Promise<import("../users/entities/user.entity").User>;
}
