import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity({ name: 't_user' })
export class User {
  @PrimaryColumn({
    name: 'u_id',
    type: 'varchar',
    default: () => 'gen_random_uuid()',
  })
  uId: string;

  @Column({ name: 'u_role', type: 'varchar', length: 10, default: 'admin' })
  uRole: string;

  @Column({ name: 'u_name', type: 'varchar', length: 15, nullable: true })
  uName: string;

  @Column({ name: 'u_email', type: 'varchar', length: 20, unique: true })
  uEmail: string;

  @Column({ name: 'u_password', type: 'varchar', length: 255 })
  uPassword: string;

  @Column({
    name: 'u_refresh_token',
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  uRefreshToken: string;

  @Column({ name: 'u_created_at', type: 'bigint' })
  uCreatedAt: number;

  @Column({ name: 'u_mod_at', type: 'bigint', nullable: true })
  uModAt: number;
}
