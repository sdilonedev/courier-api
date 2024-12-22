import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Package } from './package.entity';

@Entity('branches')
export class Branch {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  branchName: string;

  @Column({ nullable: true })
  branchAddress: string;

  @Column()
  branchCity: string;

  @Column({ nullable: true })
  contactNumber: string;

  @OneToMany(() => Package, (packageEntity) => packageEntity.associatedBranches)
  packages: Package[];
}
