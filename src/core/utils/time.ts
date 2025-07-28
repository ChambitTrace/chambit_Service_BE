import * as dayjs from 'dayjs';
import * as timezone from 'dayjs/plugin/timezone';
import * as utc from 'dayjs/plugin/utc';

dayjs.extend(timezone);
dayjs.extend(utc);

/**
 * 서울 시간 반환
 * @returns 서울 시간
 */
export function getSeoulTimestamp() {
  return dayjs().tz('Asia/Seoul').valueOf();
}
