import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
// data modelling is done here, similar to mongoose, typeORM for sqlite db
@Entity()
export class Todo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ nullable: true })
  description: string;

  @Column({ default: false })
  completed: boolean;
}
