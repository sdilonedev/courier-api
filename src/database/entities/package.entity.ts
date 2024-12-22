import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './user.entity';
import { PackageLog } from './package-log.entity';
import { Branch } from './branch.entity';

@Entity('packages')
export class Package {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  trackingNumber: string;

  @Column()
  currentStatus: string;

  @Column()
  deliveryTerms: string;

  @Column()
  deliveryAddress: string;

  @Column('float')
  packageWeight: number;

  @Column()
  userId: string;

  @ManyToOne(() => User, (user) => user.packages)
  user: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Branch, (branch) => branch.packages)
  associatedBranches: Branch[];

  @OneToMany(() => PackageLog, (packageLog) => packageLog.package)
  statusLog: PackageLog[];
}
