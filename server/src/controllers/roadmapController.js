import prisma from '../config/prisma.js';

export const getRoadmaps = async (req, res, next) => {
  try {
    const { level, careerId } = req.query;

    const where = { isPublished: true };
    if (level) where.level = level;
    if (careerId) where.careerId = careerId;

    const roadmaps = await prisma.roadmap.findMany({
      where,
      include: {
        career: { select: { id: true, title: true, slug: true, category: true } },
        phases: {
          include: {
            _count: { select: { items: true } }
          }
        }
      },
      orderBy: { title: 'asc' }
    });

    // If logged in, check user enrollment status
    let userRoadmaps = [];
    if (req.user) {
      userRoadmaps = await prisma.userRoadmap.findMany({
        where: { userId: req.user.id },
        select: { roadmapId: true, status: true, progressPercent: true }
      });
    }

    const roadmapList = roadmaps.map(r => {
      const enrollment = userRoadmaps.find(ur => ur.roadmapId === r.id);
      const totalItems = r.phases.reduce((sum, p) => sum + p._count.items, 0);

      return {
        id: r.id,
        slug: r.slug,
        title: r.title,
        description: r.description,
        durationWeeks: r.durationWeeks,
        level: r.level,
        career: r.career,
        totalPhases: r.phases.length,
        totalItems,
        enrollment: enrollment ? {
          status: enrollment.status,
          progressPercent: enrollment.progressPercent
        } : null
      };
    });

    return res.json(roadmapList);
  } catch (error) {
    next(error);
  }
};

export const getRoadmapBySlug = async (req, res, next) => {
  try {
    const { slug } = req.params;

    const roadmap = await prisma.roadmap.findUnique({
      where: { slug },
      include: {
        career: true,
        phases: {
          orderBy: { phaseNumber: 'asc' },
          include: {
            items: {
              orderBy: { orderIndex: 'asc' }
            }
          }
        }
      }
    });

    if (!roadmap) {
      return res.status(404).json({ error: 'Roadmap not found.' });
    }

    // Check if current user is enrolled and fetch progress
    let userRoadmap = null;
    let completedItemIds = new Set();

    if (req.user) {
      userRoadmap = await prisma.userRoadmap.findUnique({
        where: {
          userId_roadmapId: {
            userId: req.user.id,
            roadmapId: roadmap.id
          }
        },
        include: {
          progress: true
        }
      });

      if (userRoadmap) {
        userRoadmap.progress.forEach(p => {
          if (p.completed) completedItemIds.add(p.itemId);
        });
      }
    }

    // Format phases with user completion status
    const formattedPhases = roadmap.phases.map(phase => ({
      id: phase.id,
      phaseNumber: phase.phaseNumber,
      title: phase.title,
      description: phase.description,
      items: phase.items.map(item => ({
        id: item.id,
        title: item.title,
        description: item.description,
        estimatedHours: item.estimatedHours,
        orderIndex: item.orderIndex,
        learningResources: item.learningResources ? JSON.parse(item.learningResources) : [],
        completionCriteria: item.completionCriteria,
        isCompleted: completedItemIds.has(item.id)
      }))
    }));

    return res.json({
      id: roadmap.id,
      slug: roadmap.slug,
      title: roadmap.title,
      description: roadmap.description,
      durationWeeks: roadmap.durationWeeks,
      level: roadmap.level,
      career: roadmap.career,
      phases: formattedPhases,
      userRoadmap: userRoadmap ? {
        id: userRoadmap.id,
        status: userRoadmap.status,
        progressPercent: userRoadmap.progressPercent,
        weeklyHours: userRoadmap.weeklyHours,
        targetCompletionDate: userRoadmap.targetCompletionDate,
        notes: userRoadmap.notes,
        startedAt: userRoadmap.startedAt
      } : null
    });
  } catch (error) {
    next(error);
  }
};

export const enrollRoadmap = async (req, res, next) => {
  try {
    const { roadmapId, weeklyHours = 10 } = req.body;

    if (!roadmapId) {
      return res.status(400).json({ error: 'roadmapId is required.' });
    }

    const roadmap = await prisma.roadmap.findUnique({
      where: { id: roadmapId },
      include: {
        phases: {
          include: { items: true }
        }
      }
    });

    if (!roadmap) {
      return res.status(404).json({ error: 'Roadmap not found.' });
    }

    // Calculate estimated completion target based on weekly availability
    const totalHours = roadmap.phases.reduce((sum, p) =>
      sum + p.items.reduce((pSum, i) => pSum + i.estimatedHours, 0)
    , 0);

    const safeWeekly = Math.max(1, Math.min(80, Number(weeklyHours) || 10));
    const estimatedWeeks = Math.ceil(totalHours / safeWeekly);
    const targetDate = new Date(Date.now() + estimatedWeeks * 7 * 24 * 60 * 60 * 1000);

    const userRoadmap = await prisma.userRoadmap.upsert({
      where: {
        userId_roadmapId: {
          userId: req.user.id,
          roadmapId
        }
      },
      create: {
        userId: req.user.id,
        roadmapId,
        status: 'ACTIVE',
        weeklyHours: safeWeekly,
        targetCompletionDate: targetDate,
        progressPercent: 0
      },
      update: {
        status: 'ACTIVE',
        weeklyHours: safeWeekly,
        targetCompletionDate: targetDate
      }
    });

    // Award Achievement if first roadmap
    const roadmapCount = await prisma.userRoadmap.count({ where: { userId: req.user.id } });
    if (roadmapCount === 1) {
      await prisma.achievement.create({
        data: {
          userId: req.user.id,
          title: 'Pathfinder',
          description: `Enrolled in the ${roadmap.title}!`,
          badgeIcon: 'Compass',
          category: 'ROADMAP'
        }
      });
    }

    return res.status(201).json({
      message: 'Successfully enrolled in roadmap.',
      userRoadmap,
      estimatedTimeline: {
        totalHours,
        weeklyHours: safeWeekly,
        estimatedWeeks,
        targetDate
      }
    });
  } catch (error) {
    next(error);
  }
};

export const updateRoadmapItemProgress = async (req, res, next) => {
  try {
    const { roadmapId, itemId, completed } = req.body;

    if (!roadmapId || !itemId) {
      return res.status(400).json({ error: 'roadmapId and itemId are required.' });
    }

    let userRoadmap = await prisma.userRoadmap.findUnique({
      where: {
        userId_roadmapId: {
          userId: req.user.id,
          roadmapId
        }
      }
    });

    if (!userRoadmap) {
      // Auto-enroll if user completes an item directly
      userRoadmap = await prisma.userRoadmap.create({
        data: {
          userId: req.user.id,
          roadmapId,
          status: 'ACTIVE',
          weeklyHours: 10
        }
      });
    }

    // Toggle item progress
    await prisma.userRoadmapProgress.upsert({
      where: {
        userRoadmapId_itemId: {
          userRoadmapId: userRoadmap.id,
          itemId
        }
      },
      create: {
        userRoadmapId: userRoadmap.id,
        itemId,
        completed: Boolean(completed),
        completedAt: completed ? new Date() : null
      },
      update: {
        completed: Boolean(completed),
        completedAt: completed ? new Date() : null
      }
    });

    // Recalculate overall roadmap percentage
    const allItems = await prisma.roadmapItem.count({
      where: { phase: { roadmapId } }
    });

    const completedItems = await prisma.userRoadmapProgress.count({
      where: {
        userRoadmapId: userRoadmap.id,
        completed: true
      }
    });

    const newProgressPercent = allItems > 0 ? Math.round((completedItems / allItems) * 100) : 0;
    const isNowCompleted = newProgressPercent === 100;

    const updatedUserRoadmap = await prisma.userRoadmap.update({
      where: { id: userRoadmap.id },
      data: {
        progressPercent: newProgressPercent,
        status: isNowCompleted ? 'COMPLETED' : userRoadmap.status,
        completedAt: isNowCompleted ? new Date() : null
      }
    });

    // Award Achievement if completed
    if (isNowCompleted) {
      await prisma.achievement.create({
        data: {
          userId: req.user.id,
          title: 'Roadmap Conqueror',
          description: 'Completed 100% of a career learning roadmap!',
          badgeIcon: 'Award',
          category: 'ROADMAP'
        }
      });
    }

    return res.json({
      message: completed ? 'Topic marked complete!' : 'Topic marked incomplete.',
      progressPercent: newProgressPercent,
      completedItems,
      totalItems: allItems,
      userRoadmap: updatedUserRoadmap
    });
  } catch (error) {
    next(error);
  }
};

export const updateRoadmapSettings = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, weeklyHours, targetCompletionDate, notes } = req.body;

    const userRoadmap = await prisma.userRoadmap.findUnique({
      where: { id }
    });

    if (!userRoadmap || userRoadmap.userId !== req.user.id) {
      return res.status(404).json({ error: 'User roadmap record not found.' });
    }

    const updated = await prisma.userRoadmap.update({
      where: { id },
      data: {
        ...(status && { status }),
        ...(weeklyHours !== undefined && { weeklyHours: Number(weeklyHours) }),
        ...(targetCompletionDate !== undefined && { targetCompletionDate: new Date(targetCompletionDate) }),
        ...(notes !== undefined && { notes })
      }
    });

    return res.json({ message: 'Roadmap settings saved.', userRoadmap: updated });
  } catch (error) {
    next(error);
  }
};

export const getUserRoadmaps = async (req, res, next) => {
  try {
    const roadmaps = await prisma.userRoadmap.findMany({
      where: { userId: req.user.id },
      include: {
        roadmap: {
          include: {
            career: true,
            phases: {
              include: {
                _count: { select: { items: true } }
              }
            }
          }
        }
      },
      orderBy: { updatedAt: 'desc' }
    });

    const parsed = roadmaps.map(ur => {
      const totalItems = ur.roadmap.phases.reduce((sum, p) => sum + p._count.items, 0);
      return {
        id: ur.id,
        roadmapId: ur.roadmapId,
        title: ur.roadmap.title,
        slug: ur.roadmap.slug,
        level: ur.roadmap.level,
        career: ur.roadmap.career,
        status: ur.status,
        progressPercent: ur.progressPercent,
        weeklyHours: ur.weeklyHours,
        targetCompletionDate: ur.targetCompletionDate,
        notes: ur.notes,
        startedAt: ur.startedAt,
        totalItems
      };
    });

    return res.json(parsed);
  } catch (error) {
    next(error);
  }
};
