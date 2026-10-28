import { randomBytes } from 'node:crypto';
import type { TestUser, UserTemplate } from '../types/user.types';
export class TestDataFactory {
  static uniqueUser(template: UserTemplate): TestUser {
    const token = `${Date.now()}-${process.pid}-${randomBytes(3).toString('hex')}`;
    return { ...structuredClone(template), email: `${template.emailPrefix}+${token}@example.com` };
  }
}
