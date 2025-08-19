import {
  Entity,
  Column,
  PrimaryColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { Namespace } from './namespace';
import { Node } from './node';
import { Sbom } from '../sbom';
import { Container } from './container';

@Entity({ name: 't_pod' })
export class Pod {
  @PrimaryColumn({
    name: 'p_id',
    type: 'varchar',
    default: () => 'gen_random_uuid()',
  })
  pId: string;

  @Column({ name: 'p_nid', type: 'varchar' })
  pNid: string; // node FK

  @Column({ name: 'p_nsid', type: 'varchar' })
  pNsid: string; // namespace FK

  @Column({ name: 'p_sid', type: 'varchar', nullable: true })
  pSid: string | null; // sbom FK (nullable 가능)

  @Column({ name: 'p_name', type: 'varchar', length: 128, nullable: true })
  pName: string;

  @Column({ name: 'p_created_at', type: 'bigint' })
  pCreatedAt: number;

  @ManyToOne(() => Namespace, (ns) => ns.pods, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'p_nsid', referencedColumnName: 'nsId' })
  namespace: Namespace;

  @ManyToOne(() => Node, (n) => n.pods, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'p_nid', referencedColumnName: 'nId' })
  node: Node;

  @ManyToOne(() => Sbom, (s) => s.pods, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'p_sid', referencedColumnName: 'sId' })
  sbom: Sbom | null;

  @OneToMany(() => Container, (c) => c.pod)
  containers: Container[];
}
