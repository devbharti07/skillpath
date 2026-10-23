import prisma from '../config/prisma.js';

export const getAdminOverview = async (req, res, next) => {
  try {
    const [
      totalUsers,
      totalCareers,
      totalSkills,
      totalAssessments,
      totalAttempts,
      totalRoadmaps,
      totalProjects
    ] = await Promise.all([
      prisma.user.count(),
      prisma.career.count(),
      prisma.skill.count(),
      prisma.assessment.count(),
      prisma.assessmentAttempt.count(),
      prisma.userRoadmap.count(),
      prisma.userProject.count()
    ]);

    const recentUsers = await prisma.user.findMany({
      take: 6,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        fullName: true,
        email: true,
        role: true,
        createdAt: true,
        profile: { select: { primaryCareerInterest: true, educationLevel: true } }
      }
    });

    const recentAttempts = await prisma.assessmentAttempt.findMany({
      take: 6,
      orderBy: { completedAt: 'desc' },
      include: {
        user: { select: { fullName: true, email: true } },
        assessment: { select: { title: true } }
      }
    });

    return res.json({
      stats: {
        totalUsers,
        totalCareers,
        totalSkills,
        totalAssessments,
        totalAttempts,
        totalRoadmaps,
        totalProjects
      },
      recentUsers,
      recentAttempts
    });
  } catch (error) {
    next(error);
  }
};

export const getAdminUsers = async (req, res, next) => {
  try {
    const { search, role, page = 1, limit = 20 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const where = {};
    if (role) where.role = role;
    if (search) {
      where.OR = [
        { fullName: { contains: search } },
        { email: { contains: search } }
      ];
    }

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip,
        take: Number(limit),
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          fullName: true,
          email: true,
          role: true,
          createdAt: true,
          profile: true,
          _count: {
            select: { attempts: true, roadmaps: true, projects: true }
          }
        }
      }),
      prisma.user.count({ where })
    ]);

    return res.json({
      users,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    next(error);
  }
};

export const createAdminCareer = async (req, res, next) => {
  try {
    const { title, slug, category, description, difficulty, estimatedLearningWeeks, technicalSkills, softSkills, responsibilities, prerequisites, salaryNote, marketOutlook } = req.body;

    if (!title || !slug || !category || !description) {
      return res.status(400).json({ error: 'Title, slug, category, and description are required.' });
    }

    const career = await prisma.career.create({
      data: {
        title,
        slug,
        category,
        description,
        difficulty: difficulty || 'Beginner',
        estimatedLearningWeeks: Number(estimatedLearningWeeks) || 24,
        technicalSkills: JSON.stringify(Array.isArray(technicalSkills) ? technicalSkills : [technicalSkills]),
        softSkills: JSON.stringify(Array.isArray(softSkills) ? softSkills : [softSkills]),
        responsibilities: JSON.stringify(Array.isArray(responsibilities) ? responsibilities : [responsibilities]),
        prerequisites: JSON.stringify(Array.isArray(prerequisites) ? prerequisites : [prerequisites]),
        exampleProjects: JSON.stringify([]),
        salaryNote: salaryNote || null,
        marketOutlook: marketOutlook || null,
        isPublished: true
      }
    });

    return res.status(201).json({ message: 'Career created successfully.', career });
  } catch (error) {
    next(error);
  }
};

export const updateAdminCareer = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };

    if (updateData.technicalSkills && Array.isArray(updateData.technicalSkills)) {
      updateData.technicalSkills = JSON.stringify(updateData.technicalSkills);
    }
    if (updateData.softSkills && Array.isArray(updateData.softSkills)) {
      updateData.softSkills = JSON.stringify(updateData.softSkills);
    }
    if (updateData.responsibilities && Array.isArray(updateData.responsibilities)) {
      updateData.responsibilities = JSON.stringify(updateData.responsibilities);
    }

    const career = await prisma.career.update({
      where: { id },
      data: updateData
    });

    return res.json({ message: 'Career updated.', career });
  } catch (error) {
    next(error);
  }
};

export const deleteAdminCareer = async (req, res, next) => {
  try {
    const { id } = req.params;
    await prisma.career.delete({ where: { id } });
    return res.json({ message: 'Career deleted.' });
  } catch (error) {
    next(error);
  }
};

export const createAdminSkill = async (req, res, next) => {
  try {
    const { name, slug, category, description, icon, isCore } = req.body;

    if (!name || !slug || !category || !description) {
      return res.status(400).json({ error: 'Name, slug, category, and description are required.' });
    }

    const skill = await prisma.skill.create({
      data: {
        name,
        slug,
        category,
        description,
        icon: icon || 'Code',
        isCore: Boolean(isCore)
      }
    });

    return res.status(201).json({ message: 'Skill created.', skill });
  } catch (error) {
    next(error);
  }
};

export const createAdminResource = async (req, res, next) => {
  try {
    const { title, description, category, type, difficulty, durationMinutes, url } = req.body;

    if (!title || !description || !category || !url) {
      return res.status(400).json({ error: 'Title, description, category, and URL are required.' });
    }

    const resource = await prisma.learningResource.create({
      data: {
        title,
        description,
        category,
        type: type || 'ARTICLE',
        difficulty: difficulty || 'BEGINNER',
        durationMinutes: Number(durationMinutes) || 30,
        url,
        isPublished: true
      }
    });

    return res.status(201).json({ message: 'Learning resource created.', resource });
  } catch (error) {
    next(error);
  }
};
