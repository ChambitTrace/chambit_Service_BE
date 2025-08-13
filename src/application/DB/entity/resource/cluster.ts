import { Entity, Column, PrimaryColumn, OneToMany } from 'typeorm';
import { Namespace } from './namespace';
import { Node } from './node';

@Entity({ name: 't_cluster' })
export class Cluster {
  @PrimaryColumn({ name: 'c_id', type: 'varchar', default: () => 'gen_random_uuid()' })
  cId: string;

  @Column({ name: 'c_uid', type: 'varchar'})
  cUid: string;

  @Column({ name: 'c_name', type: 'varchar'})
  cName: string;

  @Column({ name: 'c_region', type: 'text', nullable: true })
  cRegion: string;

  @Column({ name: 'c_created_at', type: 'bigint' })
  cCreatedAt: number;

  @OneToMany(() => Namespace, (ns) => ns.cluster)
  namespaces: Namespace[];

  @OneToMany(() => Node, (n) => n.cluster)
  nodes: Node[];
}