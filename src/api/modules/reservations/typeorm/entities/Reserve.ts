import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import User from 'src/api/modules/users/typeorm/entities/User';
import Car from 'src/api/modules/cars/typeorm/entities/Car';

import { Exclude } from 'class-transformer';

@Entity('reservations')
export class Reserve {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  startDate: string;

  @Column()
  endDate: string;

  @Column('decimal', { precision: 10, scale: 2 })
  finalValue: number;

  @Column()
  userId: number;

  @Column()
  carId: number;

  @ManyToOne(() => User, user => user.reservations)
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(() => Car, car => car.reservations)
  @JoinColumn({ name: 'carId' })
  car: Car;

  @CreateDateColumn()
  @Exclude()
  created_at: Date;

  @UpdateDateColumn()
  @Exclude()
  updated_at: Date;
}

export default Reserve;
