import prisma from "../db/db";

export async function sendNotification(
  userId: string,
  type: string,
  message: string,
) {
  return prisma.notification.create({
    data: {
      userId,
      type,
      message,
    },
  });
}
