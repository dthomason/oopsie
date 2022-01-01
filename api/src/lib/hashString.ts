import bcrypt from 'bcrypt';

export default (string: string) => bcrypt.hash(string, 10);
