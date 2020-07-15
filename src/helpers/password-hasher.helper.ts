import * as bcrypt from 'bcrypt';

export const hashPassword = (password: string): Promise<string> => bcrypt.hash(password, 10);
export const comparePassword = (password: string, hashPassword: string): Promise<boolean> => bcrypt.compare(password, hashPassword);
