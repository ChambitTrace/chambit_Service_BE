import { Entity, Column, PrimaryColumn, OneToMany } from 'typeorm';
import { Drift } from './drift';
import { Pod } from './resource/pod';

@Entity({ name: 't_sbom' })
export class Sbom {
  @PrimaryColumn({
    name: 's_id',
    type: 'varchar',
    default: () => 'gen_random_uuid()',
  })
  sId: string;

  @Column({ name: 's_coid', type: 'varchar', nullable: true })
  sCoid: string | null; // 컨테이너 기준 SBOM일 수도 있어 보여 nullable

  @Column({ name: 's_source', type: 'varchar', length: 64 })
  sSource: string;

  @Column({ name: 's_format', type: 'varchar', length: 32 })
  sFormat: string;

  @Column({ name: 's_data', type: 'jsonb' })
  sData: Record<string, any>;

  @Column({ name: 's_generated_at', type: 'bigint' })
  sGeneratedAt: number;

  @OneToMany(() => Drift, (d) => d.sbom)
  drifts: Drift[];

  @OneToMany(() => Pod, (p) => p.sbom)
  pods: Pod[];
}
