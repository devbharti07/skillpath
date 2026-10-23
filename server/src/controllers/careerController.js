import prisma from '../config/prisma.js';

export const getCareers = async (req, res, next) => {
  try {
    const { search, category, difficulty, skill } = req.query;

    const where = { isPublished: true };

    if (category) {
      where.category = { equals: category };
    }

    if (difficulty) {
      where.difficulty = { contains: difficulty };
    }

    if (search) {
      where.OR = [
        { title: { contains: search } },
        { description: { contains: search } },
        { technicalSkills: { contains: search } }
      ];
    }

    if (skill) {
      where.technicalSkills = { contains: skill };
    }

    const careers = await prisma.career.findMany({
      where,
      orderBy: { title: 'asc' }
    });

    // Check bookmarks if user logged in
    let userBookmarks = [];
    if (req.user) {
      userBookmarks = await prisma.bookmark.findMany({
        where: { userId: req.user.id, itemType: 'CAREER' },
        select: { itemId: true }
      });
    }
    const bookmarkedIds = new Set(userBookmarks.map(b => b.itemId));

    const parsedCareers = careers.map(c => ({
      ...c,
      responsibilities: JSON.parse(c.responsibilities || '[]'),
      technicalSkills: JSON.parse(c.technicalSkills || '[]'),
      softSkills: JSON.parse(c.softSkills || '[]'),
      prerequisites: JSON.parse(c.prerequisites || '[]'),
      exampleProjects: JSON.parse(c.exampleProjects || '[]'),
      isBookmarked: bookmarkedIds.has(c.id)
    }));

    return res.json(parsedCareers);
  } catch (error) {
    next(error);
  }
};

export const getCareerBySlug = async (req, res, next) => {
  try {
    const { slug } = req.params;

    const career = await prisma.career.findUnique({
      where: { slug },
      include: {
        roadmaps: {
          where: { isPublished: true },
          select: { id: true, slug: true, title: true, durationWeeks: true, level: true }
        }
      }
    });

    if (!career) {
      return res.status(404).json({ error: 'Career profile not found.' });
    }

    let isBookmarked = false;
    if (req.user) {
      const bm = await prisma.bookmark.findUnique({
        where: {
          userId_itemType_itemId: {
            userId: req.user.id,
            itemType: 'CAREER',
            itemId: career.id
          }
        }
      });
      isBookmarked = Boolean(bm);
    }

    // Find relevant assessments based on technical skills
    const techSkills = JSON.parse(career.technicalSkills || '[]');
    const relevantAssessments = await prisma.assessment.findMany({
      where: {
        isPublished: true,
        OR: techSkills.map(skill => ({
          OR: [
            { category: { contains: skill } },
            { title: { contains: skill } }
          ]
        }))
      },
      take: 4,
      select: { id: true, slug: true, title: true, difficulty: true, durationMinutes: true }
    });

    // Find related careers in same category
    const relatedCareers = await prisma.career.findMany({
      where: {
        category: career.category,
        id: { not: career.id },
        isPublished: true
      },
      take: 3,
      select: { id: true, slug: true, title: true, difficulty: true }
    });

    return res.json({
      ...career,
      responsibilities: JSON.parse(career.responsibilities || '[]'),
      technicalSkills: techSkills,
      softSkills: JSON.parse(career.softSkills || '[]'),
      prerequisites: JSON.parse(career.prerequisites || '[]'),
      exampleProjects: JSON.parse(career.exampleProjects || '[]'),
      isBookmarked,
      relevantAssessments,
      relatedCareers
    });
  } catch (error) {
    next(error);
  }
};

export const compareCareers = async (req, res, next) => {
  try {
    const { ids } = req.body; // array of career IDs or slugs

    if (!Array.isArray(ids) || ids.length < 2) {
      return res.status(400).json({ error: 'Please select at least 2 careers to compare.' });
    }

    const careers = await prisma.career.findMany({
      where: {
        OR: [
          { id: { in: ids } },
          { slug: { in: ids } }
        ]
      },
      include: {
        roadmaps: {
          where: { isPublished: true },
          select: { id: true, slug: true, title: true, durationWeeks: true }
        }
      }
    });

    const parsed = careers.map(c => ({
      id: c.id,
      slug: c.slug,
      title: c.title,
      category: c.category,
      difficulty: c.difficulty,
      estimatedLearningWeeks: c.estimatedLearningWeeks,
      technicalSkills: JSON.parse(c.technicalSkills || '[]'),
      softSkills: JSON.parse(c.softSkills || '[]'),
      prerequisites: JSON.parse(c.prerequisites || '[]'),
      exampleProjects: JSON.parse(c.exampleProjects || '[]'),
      roadmaps: c.roadmaps,
      salaryNote: c.salaryNote
    }));

    // Calculate common vs unique skills
    const allSkills = parsed.map(c => new Set(c.technicalSkills));
    const commonSkills = parsed[0].technicalSkills.filter(s =>
      allSkills.every(skillSet => skillSet.has(s))
    );

    return res.json({
      careers: parsed,
      comparisonInsights: {
        commonSkills,
        careerCount: parsed.length
      }
    });
  } catch (error) {
    next(error);
  }
};
