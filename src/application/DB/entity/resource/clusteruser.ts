import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity({ name: 't_cluster_user' })
export class ClusterUser {
  @PrimaryColumn({ name: 'cu_cid', type: 'varchar' })
  cuCid: string;

  @PrimaryColumn({ name: 'cu_uid', type: 'varchar' })
  cuUid: string;
}
