import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity({ name: 't_clusterowner' })
export class ClusterOwner {
  @PrimaryColumn({ name: 'cow_cid', type: 'varchar' })
  cowCid: string;

  @PrimaryColumn({ name: 'cow_uid', type: 'varchar' })
  cowUid: string;
}
