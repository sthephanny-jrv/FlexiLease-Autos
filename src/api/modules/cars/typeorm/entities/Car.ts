import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { Exclude } from 'class-transformer';

@Entity('cars')
class Car {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  model: string;

  @Column()
  color: string;

  @Column()
  year: number;

  @Column()
  valuePerDay: number;

  @Column('simple-array')
  acessories: string[];

  @Column()
  numberOfPassengers: number;

  @CreateDateColumn()
  @Exclude()
  created_at: Date;

  @UpdateDateColumn()
  @Exclude()
  updated_at: Date;
}

export default Car;
