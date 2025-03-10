import cron from 'node-cron';
import nodemailer from 'nodemailer';
import { config } from '../config';
import { prisma } from '../config/prisma';
import { logger } from '../utils/logger';

let isJobRunning = false;

// Configuración de Nodemailer
const transporter = nodemailer.createTransport({
  host: config.email.host,
  port: config.email.port,
  auth: {
    user: config.email.user,
    pass: config.email.pass,
  },
});

const sendReminderEmails = async () => {
  if (isJobRunning) {
    logger.warn('El job de recordatorios ya está en ejecución, saltando este ciclo.');
    return;
  }
  isJobRunning = true;

  try {
    const now = new Date();
    // Buscar recordatorios pendientes y cuyo evento aún no ha iniciado
    const reminders = await prisma.recordatorio.findMany({
      where: {
        enviado: false,
        evento: {
          fecha_inicio: { gt: now },
        },
      },
      include: { evento: true, usuario: true },
    });

    for (const reminder of reminders) {
      const mailOptions = {
        from: config.email.user,
        to: reminder.usuario?.email,
        subject: `Recordatorio para el evento: ${reminder.evento.titulo}`,
        text: `Este es un recordatorio para el evento "${reminder.evento.titulo}" que inicia el ${reminder.evento.fecha_inicio}.`,
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
    isJobRunning = false;
  }
};

// Se puede configurar el schedule vía .env
const jobSchedule = process.env.REMINDER_JOB_SCHEDULE || '* * * * *';

export const initReminderJob = () => {
  cron.schedule(jobSchedule, () => {
    logger.info('Ejecutando job de recordatorios...');
    sendReminderEmails();
  });
};
