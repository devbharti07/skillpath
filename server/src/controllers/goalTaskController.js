import prisma from '../config/prisma.js';

export const getGoals = async (req, res, next) => {
  try {
    const goals = await prisma.goal.findMany({
      where: { userId: req.user.id },
      include: {
        tasks: {
          orderBy: { createdAt: 'desc' }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    const parsed = goals.map(g => {
      const totalTasks = g.tasks.length;
      const completedTasks = g.tasks.filter(t => t.status === 'COMPLETED').length;
      const progressPercent = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : (g.isCompleted ? 100 : 0);

      return {
        ...g,
        totalTasks,
        completedTasks,
        progressPercent
      };
    });

    return res.json(parsed);
  } catch (error) {
    next(error);
  }
};

export const createGoal = async (req, res, next) => {
  try {
    const { title, description, targetDate, category } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({ error: 'Goal title is required.' });
    }

    const goal = await prisma.goal.create({
      data: {
        userId: req.user.id,
        title: title.trim(),
        description: description || null,
        targetDate: targetDate ? new Date(targetDate) : null,
        category: category || 'CAREER'
      }
    });

    return res.status(201).json({ message: 'Goal created.', goal });
  } catch (error) {
    next(error);
  }
};

export const updateGoal = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, description, targetDate, category, isCompleted } = req.body;

    const existing = await prisma.goal.findUnique({ where: { id } });
    if (!existing || existing.userId !== req.user.id) {
      return res.status(404).json({ error: 'Goal not found.' });
    }

    const updated = await prisma.goal.update({
      where: { id },
      data: {
        ...(title && { title: title.trim() }),
        ...(description !== undefined && { description }),
        ...(targetDate !== undefined && { targetDate: targetDate ? new Date(targetDate) : null }),
        ...(category && { category }),
        ...(isCompleted !== undefined && {
          isCompleted: Boolean(isCompleted),
          completedAt: isCompleted ? new Date() : null
        })
      }
    });

    return res.json({ message: 'Goal updated.', goal: updated });
  } catch (error) {
    next(error);
  }
};

export const deleteGoal = async (req, res, next) => {
  try {
    const { id } = req.params;

    const existing = await prisma.goal.findUnique({ where: { id } });
    if (!existing || existing.userId !== req.user.id) {
      return res.status(404).json({ error: 'Goal not found.' });
    }

    await prisma.goal.delete({ where: { id } });
    return res.json({ message: 'Goal removed.' });
  } catch (error) {
    next(error);
  }
};

export const getTasks = async (req, res, next) => {
  try {
    const { status, priority, filter } = req.query;

    const where = { userId: req.user.id };
    if (status) where.status = status;
    if (priority) where.priority = priority;

    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const endOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);

    if (filter === 'today') {
      where.dueDate = {
        gte: startOfToday,
        lte: endOfToday
      };
    } else if (filter === 'overdue') {
      where.dueDate = { lt: startOfToday };
      where.status = { not: 'COMPLETED' };
    } else if (filter === 'upcoming') {
      where.dueDate = { gt: endOfToday };
    }

    const tasks = await prisma.task.findMany({
      where,
      include: {
        goal: { select: { id: true, title: true } },
        userRoadmap: {
          select: {
            id: true,
            roadmap: { select: { title: true } }
          }
        }
      },
      orderBy: [
        { status: 'asc' },
        { dueDate: 'asc' }
      ]
    });

    return res.json(tasks);
  } catch (error) {
    next(error);
  }
};

export const createTask = async (req, res, next) => {
  try {
    const { title, goalId, userRoadmapId, priority, status, dueDate } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({ error: 'Task title is required.' });
    }

    const task = await prisma.task.create({
      data: {
        userId: req.user.id,
        goalId: goalId || null,
        userRoadmapId: userRoadmapId || null,
        title: title.trim(),
        priority: priority || 'MEDIUM',
        status: status || 'TODO',
        dueDate: dueDate ? new Date(dueDate) : null
      },
      include: {
        goal: { select: { id: true, title: true } }
      }
    });

    return res.status(201).json({ message: 'Task created.', task });
  } catch (error) {
    next(error);
  }
};

export const updateTask = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, goalId, priority, status, dueDate } = req.body;

    const existing = await prisma.task.findUnique({ where: { id } });
    if (!existing || existing.userId !== req.user.id) {
      return res.status(404).json({ error: 'Task not found.' });
    }

    const isNewlyCompleted = status === 'COMPLETED' && existing.status !== 'COMPLETED';

    const updated = await prisma.task.update({
      where: { id },
      data: {
        ...(title && { title: title.trim() }),
        ...(goalId !== undefined && { goalId: goalId || null }),
        ...(priority && { priority }),
        ...(status && { status }),
        ...(dueDate !== undefined && { dueDate: dueDate ? new Date(dueDate) : null }),
        ...(isNewlyCompleted && { completedAt: new Date() }),
        ...(status && status !== 'COMPLETED' && { completedAt: null })
      },
      include: {
        goal: { select: { id: true, title: true } }
      }
    });

    return res.json({ message: 'Task updated.', task: updated });
  } catch (error) {
    next(error);
  }
};

export const deleteTask = async (req, res, next) => {
  try {
    const { id } = req.params;

    const existing = await prisma.task.findUnique({ where: { id } });
    if (!existing || existing.userId !== req.user.id) {
      return res.status(404).json({ error: 'Task not found.' });
    }

    await prisma.task.delete({ where: { id } });
    return res.json({ message: 'Task removed.' });
  } catch (error) {
    next(error);
  }
};
