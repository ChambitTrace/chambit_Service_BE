import {
  Entity,
  Column,
  PrimaryColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { Pod } from './pod';
import { Drift } from '../drift';

@Entity({ name: 't_container' })
export class Container {
  @PrimaryColumn({
    name: 'co_id',
    type: 'varchar',
    default: () => 'gen_random_uuid()',
  })
  coId: string;

  @Column({ name: 'co_pid', type: 'varchar' })
  coPid: string; // pod FK

  @Column({ name: 'co_name', type: 'varchar', length: 128 })
  coName: string;

  @Column({ name: 'co_image', type: 'varchar', length: 256 })
  coImage: string;

  @Column({ name: 'co_field', type: 'varchar', length: 128, nullable: true })
  coField: string | null;

  @ManyToOne(() => Pod, (p) => p.containers, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'co_pid', referencedColumnName: 'pId' })
  pod: Pod;

  @OneToMany(() => Drift, (d) => d.container)
  drifts: Drift[];
}
