import prisma from '../config/database';

export const getDashboardStatsService = async () => {
  // Usamos Promise.all para ejecutar todas las consultas en paralelo para mayor eficiencia
  const [totalUsers, totalSubjects, totalSchedules, totalGroups] = await Promise.all([
    prisma.user.count({ where: { isActive: true } }),
    prisma.subject.count({ where: { isActive: true } }),
    prisma.schedule.count({ where: { estado: 'PROGRAMADO' } }),
    prisma.group.count({ where: { isActive: true } })
  ]);

  return {
    totalUsers,
    totalSubjects,
    totalSchedules,
    totalGroups,
  };
};