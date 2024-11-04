import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToOne,
} from 'typeorm';
import { Review } from '../reviews/reviews.entity';
import { CURRENT_TIMESTAMP } from '../utils/constants';
import { User } from 'src/users/user.entity';
@Entity({ name: 'products' })
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 150 })
  title: string;

  @Column()
  description: string;

  @Column({ type: 'float' })
  price: number;

  @CreateDateColumn({ type: 'timestamp', default: () => CURRENT_TIMESTAMP })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => CURRENT_TIMESTAMP,
    onUpdate: CURRENT_TIMESTAMP,
  })
  updatedAt: Date;

  @OneToMany(() => Review, (review) => review.product)
  reviews: Review[];

  @ManyToOne(() => User, (user) => user.products)
  user: User;
}
