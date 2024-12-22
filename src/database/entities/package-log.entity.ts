import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { Package } from './package.entity';

@Entity('package_logs')
export class PackageLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  packageId: string;

  @Column()
  statusDescription: string;

  @Column()
  location: string;

  @CreateDateColumn()
  timestamp: Date;

  @ManyToOne(() => Package, (packageEntity) => packageEntity.statusLog)
  package: Package;
}
