import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import Reserve from 'src/api/modules/reservations/typeorm/entities/Reserve';

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

  @Column('decimal', { precision: 10, scale: 2 })
  valuePerDay: number;

  @Column('simple-array')
  acessories: string[];

  @Column()
  numberOfPassengers: number;

  @OneToMany(() => Reserve, reserve => reserve.car)
  reservations: Reserve[];

  @CreateDateColumn()
  @Exclude()
  created_at: Date;

  @UpdateDateColumn()
  @Exclude()
  updated_at: Date;
}

export default Car;
