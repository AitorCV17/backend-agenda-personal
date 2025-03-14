import nodeCron from 'node-cron';
import nodemailer from 'nodemailer';
import { config } from '../config';
import { prisma } from '../config/prisma';
import { logger } from '../utils/logger';

let isJobRunning = false;

const transporter = nodemailer.createTransport({
  host: config.email.host,
  port: config.email.port,
  auth: {
    user: config.email.user,
    pass: config.email.pass,
  },
});

export const sendReminderEmails = async (): Promise<void> => {
  if (isJobRunning) {
    logger.warn('El job de recordatorios ya está en ejecución, saltando este ciclo.');
    return;
  }
  isJobRunning = true;

  const jobTimeout = setTimeout(() => {
    logger.error('El job de recordatorios ha excedido el tiempo de ejecución esperado.');
  }, 5 * 60 * 1000);

  try {
    const now = new Date();
    const reminders = await prisma.recordatorio.findMany({
      where: {
        enviado: false,
        evento: {
          fechaInicio: { gt: now },
        },
      },
      include: { evento: true, usuario: true },
    });

    for (const reminder of reminders) {
      // Se utiliza "usuario.email" en lugar de "usuario.correo"
      if (!reminder.usuario?.email) {
        logger.warn(`No se encontró email para el recordatorio ${reminder.id}`);
        continue;
      }
      const mailOptions = {
        from: config.email.user,
        to: reminder.usuario.email,
        subject: `Recordatorio para el evento: ${reminder.evento.titulo}`,
        text: `Este es un recordatorio para el evento "${reminder.evento.titulo}" que inicia el ${reminder.evento.fechaInicio}.`,
      };
      await transporter.sendMail(mailOptions);
      await prisma.recordatorio.update({
        where: { id: reminder.id },
        data: { enviado: true },
      });
    }
  } catch (error) {
    logger.error(`Error en el envío de recordatorios: ${error}`);
  } finally {
    clearTimeout(jobTimeout);
    isJobRunning = false;
  }
};

const jobSchedule = process.env.REMINDER_JOB_SCHEDULE || '* * * * *';
export const initReminderJob = (): void => {
  nodeCron.schedule(jobSchedule, () => {
    logger.info('Ejecutando job de recordatorios...');
    sendReminderEmails();
  });
};
