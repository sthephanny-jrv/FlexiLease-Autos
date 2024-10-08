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

@Entity('users')
class User {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  name: string;

  @Column()
  cpf: string;

  @Column()
  birth: string;

  @Column()
  cep: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column()
  qualified: boolean;

  @Column()
  neighbordhood: string;

  @Column()
  street: string;

  @Column()
  complement: string;

  @Column()
  city: string;

  @Column()
  uf: string;

  @OneToMany(() => Reserve, reserve => reserve.user)
  reservations: Reserve[];

  @CreateDateColumn()
  @Exclude()
  created_at: Date;

  @UpdateDateColumn()
  @Exclude()
  updated_at: Date;
}

export default User;
