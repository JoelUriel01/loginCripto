import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const { userId, token, newPassword } = await req.json();

    if (!userId || !token) {
      return NextResponse.json(
        { error: 'userId y token son requeridos' },
        { status: 400 }
      );
    } 

    if (!newPassword || newPassword.length < 8) {
      return NextResponse.json(
        { error: 'La contraseña debe tener al menos 8 caracteres' },
        { status: 400 }
      );
    }

    const resetToken = await prisma.resetToken.findUnique({
      where: { token },
    });

    if (!resetToken || resetToken.userId !== userId) {
      return NextResponse.json(
        { error: 'Enlace inválido o expirado' },
        { status: 400 }
      );
    }

    if (new Date() > resetToken.expiresAt) {
      await prisma.resetToken.delete({
        where: { id: resetToken.id },
      });

      return NextResponse.json(
        { error: 'El enlace ha expirado' },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });

    await prisma.resetToken.delete({
      where: { id: resetToken.id },
    });

    return NextResponse.json({
      message: 'Contraseña actualizada exitosamente',
    });
  } catch (error) {
    console.error('Error en reset password:', error);
    return NextResponse.json(
      { error: 'Error al restablecer contraseña' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
