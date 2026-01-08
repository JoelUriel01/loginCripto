import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { PrismaClient } from '@prisma/client';
import { sendEmail } from '../../../../../lib/sendEmail';

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    const user = await prisma.user.findUnique({ 
      where: { email },
    });

    if (!user) {
      return NextResponse.json({
        message: 'Si el email existe, recibirás un enlace de recuperación',
      });
    }

    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 3600 * 1000);

    await prisma.resetToken.create({
      data: {
        userId: user.id,
        token,
        expiresAt,
      },
    });

    const resetLink = `${process.env.NEXT_PUBLIC_BASE_URL}/reset-password/${user.id}/${token}`;

    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Recuperación de Contraseña</h2>
        <p>Has solicitado restablecer tu contraseña.</p>
        <p>Haz clic en el siguiente enlace para crear una nueva contraseña:</p>
        <a href="${resetLink}" 
           style="display: inline-block; padding: 12px 24px; margin: 20px 0; 
                  background-color: #4F46E5; color: white; text-decoration: none; 
                  border-radius: 6px;">
          Restablecer Contraseña
        </a>
        <p style="color: #666; font-size: 14px;">
          Este enlace expirará en 1 hora.
        </p>
        <p style="color: #666; font-size: 14px;">
          Si no solicitaste esto, puedes ignorar este email.
        </p>
      </div>
    `;

    await sendEmail(user.email, 'Recuperación de Contraseña', emailHtml);

    return NextResponse.json({
      message: 'Si el email existe, recibirás un enlace de recuperación',
    });
  } catch (error) {
    console.error('Error en forgot password:', error);
    return NextResponse.json(
      { error: 'Error al procesar solicitud' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
  
}


