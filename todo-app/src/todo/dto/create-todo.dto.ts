import { IsString, IsBoolean, IsOptional } from 'class-validator';
// often used to validate data
export class CreateTodoDto {
  @IsString()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsBoolean()
  @IsOptional()
  completed?: boolean;
}
