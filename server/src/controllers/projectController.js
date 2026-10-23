import prisma from '../config/prisma.js';

export const getProjectTemplates = async (req, res, next) => {
  try {
    const templates = await prisma.project.findMany({
      where: { isTemplate: true },
      orderBy: { createdAt: 'asc' }
    });

    const parsed = templates.map(t => ({
      ...t,
      learningObjectives: JSON.parse(t.learningObjectives || '[]'),
      milestones: JSON.parse(t.milestones || '[]'),
      suggestedTech: JSON.parse(t.suggestedTech || '[]')
    }));

    return res.json(parsed);
  } catch (error) {
    next(error);
  }
};

export const getUserProjects = async (req, res, next) => {
  try {
    const projects = await prisma.userProject.findMany({
      where: { userId: req.user.id },
      include: { project: true },
      orderBy: { updatedAt: 'desc' }
    });

    const parsed = projects.map(p => ({
      ...p,
      milestonesProgress: p.milestonesProgress ? JSON.parse(p.milestonesProgress) : []
    }));

    return res.json(parsed);
  } catch (error) {
    next(error);
  }
};

export const createUserProject = async (req, res, next) => {
  try {
    const { title, description, category, difficulty, status, repoUrl, demoUrl, notes, templateId, milestonesProgress } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({ error: 'Project title is required.' });
    }

    // URL validation if provided
    const isValidUrl = (url) => {
      try {
        new URL(url);
        return true;
      } catch {
        return false;
      }
    };

    if (repoUrl && !isValidUrl(repoUrl)) {
      return res.status(400).json({ error: 'Please provide a valid repository URL (e.g. https://github.com/username/project).' });
    }

    if (demoUrl && !isValidUrl(demoUrl)) {
      return res.status(400).json({ error: 'Please provide a valid live demo URL.' });
    }

    const newProject = await prisma.userProject.create({
      data: {
        userId: req.user.id,
        projectId: templateId || null,
        title: title.trim(),
        description: description || '',
        category: category || 'Web Development',
        difficulty: difficulty || 'BEGINNER',
        status: status || 'NOT_STARTED',
        repoUrl: repoUrl || null,
        demoUrl: demoUrl || null,
        notes: notes || null,
        milestonesProgress: milestonesProgress ? JSON.stringify(milestonesProgress) : null,
        completedAt: status === 'COMPLETED' ? new Date() : null
      }
    });

    // Check achievement if project completed
    if (status === 'COMPLETED') {
      const existing = await prisma.achievement.findFirst({
        where: { userId: req.user.id, title: 'Project Builder' }
      });
      if (!existing) {
        await prisma.achievement.create({
          data: {
            userId: req.user.id,
            title: 'Project Builder',
            description: `Successfully completed project "${title.trim()}"!`,
            badgeIcon: 'Code',
            category: 'PROJECT'
          }
        });
      }
    }

    return res.status(201).json({
      message: 'Project created successfully.',
      project: {
        ...newProject,
        milestonesProgress: newProject.milestonesProgress ? JSON.parse(newProject.milestonesProgress) : []
      }
    });
  } catch (error) {
    next(error);
  }
};

export const updateUserProject = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, description, category, difficulty, status, repoUrl, demoUrl, notes, milestonesProgress } = req.body;

    const existing = await prisma.userProject.findUnique({
      where: { id }
    });

    if (!existing || existing.userId !== req.user.id) {
      return res.status(404).json({ error: 'Project not found.' });
    }

    const isValidUrl = (url) => {
      try {
        new URL(url);
        return true;
      } catch {
        return false;
      }
    };

    if (repoUrl && !isValidUrl(repoUrl)) {
      return res.status(400).json({ error: 'Please provide a valid repository URL.' });
    }

    if (demoUrl && !isValidUrl(demoUrl)) {
      return res.status(400).json({ error: 'Please provide a valid live demo URL.' });
    }

    const isNewlyCompleted = status === 'COMPLETED' && existing.status !== 'COMPLETED';

    const updated = await prisma.userProject.update({
      where: { id },
      data: {
        ...(title && { title: title.trim() }),
        ...(description !== undefined && { description }),
        ...(category && { category }),
        ...(difficulty && { difficulty }),
        ...(status && { status }),
        ...(repoUrl !== undefined && { repoUrl: repoUrl || null }),
        ...(demoUrl !== undefined && { demoUrl: demoUrl || null }),
        ...(notes !== undefined && { notes }),
        ...(milestonesProgress !== undefined && { milestonesProgress: JSON.stringify(milestonesProgress) }),
        ...(isNewlyCompleted && { completedAt: new Date() })
      }
    });

    if (isNewlyCompleted) {
      const existingBadge = await prisma.achievement.findFirst({
        where: { userId: req.user.id, title: 'Project Builder' }
      });
      if (!existingBadge) {
        await prisma.achievement.create({
          data: {
            userId: req.user.id,
            title: 'Project Builder',
            description: `Successfully completed project "${updated.title}"!`,
            badgeIcon: 'Code',
            category: 'PROJECT'
          }
        });
      }
    }

    return res.json({
      message: 'Project updated.',
      project: {
        ...updated,
        milestonesProgress: updated.milestonesProgress ? JSON.parse(updated.milestonesProgress) : []
      }
    });
  } catch (error) {
    next(error);
  }
};

export const deleteUserProject = async (req, res, next) => {
  try {
    const { id } = req.params;

    const existing = await prisma.userProject.findUnique({ where: { id } });
    if (!existing || existing.userId !== req.user.id) {
      return res.status(404).json({ error: 'Project not found.' });
    }

    await prisma.userProject.delete({ where: { id } });
    return res.json({ message: 'Project removed.' });
  } catch (error) {
    next(error);
  }
};

export const getPublicPortfolio = async (req, res, next) => {
  try {
    const { userId } = req.params;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        fullName: true,
        avatarUrl: true,
        profile: true,
        userSkills: {
          include: { skill: true }
        },
        projects: {
          where: { status: 'COMPLETED' },
          orderBy: { completedAt: 'desc' }
        },
        achievements: true
      }
    });

    if (!user || (!user.profile?.isPublic && req.user?.id !== userId)) {
      return res.status(404).json({ error: 'Public portfolio is unavailable or private.' });
    }

    return res.json({
      student: {
        id: user.id,
        fullName: user.fullName,
        avatarUrl: user.avatarUrl,
        educationLevel: user.profile?.educationLevel,
        bio: user.profile?.bio,
        primaryCareerInterest: user.profile?.primaryCareerInterest,
        portfolioWebsite: user.profile?.portfolioWebsite,
        githubUrl: user.profile?.githubUrl,
        linkedinUrl: user.profile?.linkedinUrl
      },
      verifiedSkills: user.userSkills.filter(s => s.isVerified).map(s => ({
        name: s.skill.name,
        category: s.skill.category,
        proficiency: s.proficiency,
        score: s.score
      })),
      completedProjects: user.projects,
      achievements: user.achievements
    });
  } catch (error) {
    next(error);
  }
};
