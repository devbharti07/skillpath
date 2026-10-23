import prisma from '../config/prisma.js';

export const getSkills = async (req, res, next) => {
  try {
    const { category, search } = req.query;

    const where = {};
    if (category) {
      where.category = { equals: category };
    }
    if (search) {
      where.OR = [
        { name: { contains: search } },
        { description: { contains: search } }
      ];
    }

    const skills = await prisma.skill.findMany({
      where,
      orderBy: { name: 'asc' }
    });

    return res.json(skills);
  } catch (error) {
    next(error);
  }
};

export const getUserSkills = async (req, res, next) => {
  try {
    const userSkills = await prisma.userSkill.findMany({
      where: { userId: req.user.id },
      include: {
        skill: true
      },
      orderBy: { updatedAt: 'desc' }
    });

    // Provide summary counts
    const verifiedCount = userSkills.filter(s => s.isVerified).length;
    const provisionalCount = userSkills.filter(s => !s.isVerified).length;

    return res.json({
      userSkills,
      stats: {
        total: userSkills.length,
        verifiedCount,
        provisionalCount
      }
    });
  } catch (error) {
    next(error);
  }
};

export const addOrUpdateUserSkill = async (req, res, next) => {
  try {
    const { skillId, proficiency } = req.body;

    if (!skillId) {
      return res.status(400).json({ error: 'skillId is required.' });
    }

    const skill = await prisma.skill.findUnique({ where: { id: skillId } });
    if (!skill) {
      return res.status(404).json({ error: 'Skill not found.' });
    }

    const validProficiencies = ['BEGINNER', 'INTERMEDIATE', 'ADVANCED'];
    const safeProficiency = validProficiencies.includes(proficiency) ? proficiency : 'BEGINNER';

    const userSkill = await prisma.userSkill.upsert({
      where: {
        userId_skillId: {
          userId: req.user.id,
          skillId
        }
      },
      create: {
        userId: req.user.id,
        skillId,
        proficiency: safeProficiency,
        isVerified: false
      },
      update: {
        proficiency: safeProficiency
      },
      include: { skill: true }
    });

    return res.json({ message: 'Skill updated.', userSkill });
  } catch (error) {
    next(error);
  }
};

export const deleteUserSkill = async (req, res, next) => {
  try {
    const { skillId } = req.params;

    await prisma.userSkill.deleteMany({
      where: {
        userId: req.user.id,
        skillId
      }
    });

    return res.json({ message: 'Skill removed from profile.' });
  } catch (error) {
    next(error);
  }
};
