import { Entity, Column, PrimaryGeneratedColumn, OneToMany, Index } from 'typeorm';
import { Drift } from './drift';
import { Pod } from './resource/pod';

@Entity({ name: 't_sbom' })
export class Sbom {
  @PrimaryGeneratedColumn('uuid', { name: 's_id' })
  sId: string;

  @Index()
  @Column({ name: 's_pid', type: 'varchar', nullable: true })
  sPid: string | null; // 컨테이너 기준 SBOM일 수도 있어 보여 nullable

  @Index()
  @Column({ name: 's_source', type: 'text', nullable: true, default: '' })
  sSource: string;

  @Column({ name: 's_format', type: 'varchar', length: 32 })
  sFormat: string;

  @Column({ name: 's_data', type: 'jsonb' })
  sData: Record<string, any>;

  @Index()
  @Column({ name: 's_generated_at', type: 'bigint' })
  sGeneratedAt: number;

  @OneToMany(() => Drift, (d) => d.sbom)
  drifts: Drift[];

  @OneToMany(() => Pod, (p) => p.sbom)
  pods: Pod[];
}
