import bcrypt from 'bcrypt';

export default async (string: string) => await bcrypt.hash(string, 10);
