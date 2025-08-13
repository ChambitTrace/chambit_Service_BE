import { Entity, Column, PrimaryColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { Cluster } from './cluster';
import { Pod } from './pod';

@Entity({ name: 't_namespace' })
export class Namespace {
  @PrimaryColumn({ name: 'ns_id', type: 'varchar', default: () => 'gen_random_uuid()' })
  nsId: string;

  @Column({ name: 'ns_cid', type: 'varchar' })
  nsCid: string;

  @Column({ name: 'ns_name', type: 'varchar' })
  nsName: string;

  @Column({ name: 'ns_created_at', type: 'bigint' })
  nsCreatedAt: number;

  @ManyToOne(() => Cluster, (c) => c.namespaces, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'ns_cid', referencedColumnName: 'cId' })
  cluster: Cluster;

  @OneToMany(() => Pod, (p) => p.namespace)
  pods: Pod[];
}