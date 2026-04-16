import prisma from "../../db/db";

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

export async function getMyNotifications(userId: string) {
  return prisma.notification.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
}

export async function markedAsRead(notificationId: string) {
  return prisma.notification.update({
    where: { id: notificationId },
    data: { read: true },
  });
}

export async function markedAllAsRead(userId: string) {
  return prisma.notification.updateMany({
    where: {
      userId,
      read: false,
    },
    data: {
      read: true,
    },
  });
}
