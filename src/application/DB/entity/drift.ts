import { Entity, Column, PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Container } from './resource/container';
import { Sbom } from './sbom';

@Entity({ name: 't_drift' })
export class Drift {
  @PrimaryColumn({ name: 'd_id', type: 'varchar', default: () => 'gen_random_uuid()' })
  dId: string;

  @Column({ name: 'd_coid', type: 'varchar' })
  dCoid: string; // container FK

  @Column({ name: 'd_sid', type: 'varchar' })
  dSid: string; // sbom FK

  @Column({ name: 'd_diff', type: 'jsonb' })
  dDiff: Record<string, any>;

  @Column({ name: 'd_detected_at', type: 'bigint' })
  dDetectedAt: number;

  @ManyToOne(() => Container, (c) => c.drifts, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'd_coid', referencedColumnName: 'coId' })
  container: Container;

  @ManyToOne(() => Sbom, (s) => s.drifts, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'd_sid', referencedColumnName: 'sId' })
  sbom: Sbom;
}