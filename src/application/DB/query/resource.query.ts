import { Injectable } from '@nestjs/common';


@Injectable()
export class ResourceQuery {
  async getClusters() {
    return []; // 실제 DB 쿼리로 변경 필요
  }
}