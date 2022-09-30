import { v4 as uuidv4 } from 'uuid';

// 生成uuid
export const getUuid = () => {
  return uuidv4().split('-').join('');
}