import { Entity, Column, PrimaryColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { Cluster } from './cluster';
import { Pod } from './pod';

// src/application/DB/entity/resource/node.ts
@Entity({ name: 't_node' })
export class Node {
  @PrimaryColumn({ name: 'n_id', type: 'varchar', default: () => 'gen_random_uuid()' })
  nId: string;

  @Column({ name: 'n_cid', type: 'varchar' })
  nCid: string;

  @Column({ name: 'n_name', type: 'varchar' }) 
  nName: string;

  @Column({ name: 'n_zone', type: 'text', nullable: true })
  nZone: string | null;

  @Column({ name: 'n_created_at', type: 'int8', default: () => "EXTRACT(EPOCH FROM now())::bigint" })
  nCreatedAt: number;

  @ManyToOne(() => Cluster, (c) => c.nodes, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'n_cid', referencedColumnName: 'cId' })
  cluster: Cluster;

  @OneToMany(() => Pod, (p) => p.node)
  pods: Pod[];
}