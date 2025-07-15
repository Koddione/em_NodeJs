import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { prisma } from '../prismaClient';

export const register = async (req: Request, res: Response) => {
  try {
    const { fullName, birthDate, email, password } = req.body;

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(400).json({ message: 'This email is already in use' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        fullName,
        birthDate: new Date(birthDate),
        email,
        password: hashedPassword,
      },
    });

    res.status(201).json({
      message: 'The user has been successfully registered',
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error during registration' });
  }
};
