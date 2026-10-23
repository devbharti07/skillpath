import prisma from '../config/prisma.js';

export const getResources = async (req, res, next) => {
  try {
    const { category, type, difficulty, search } = req.query;

    const where = { isPublished: true };
    if (category) where.category = category;
    if (type) where.type = type;
    if (difficulty) where.difficulty = difficulty;
    if (search) {
      where.OR = [
        { title: { contains: search } },
        { description: { contains: search } }
      ];
    }

    const resources = await prisma.learningResource.findMany({
      where,
      orderBy: { createdAt: 'desc' }
    });

    let bookmarkedIds = new Set();
    if (req.user) {
      const bookmarks = await prisma.bookmark.findMany({
        where: { userId: req.user.id, itemType: 'RESOURCE' },
        select: { itemId: true }
      });
      bookmarkedIds = new Set(bookmarks.map(b => b.itemId));
    }

    const mapped = resources.map(r => ({
      ...r,
      isBookmarked: bookmarkedIds.has(r.id)
    }));

    return res.json(mapped);
  } catch (error) {
    next(error);
  }
};

export const toggleBookmark = async (req, res, next) => {
  try {
    const { itemType, itemId } = req.body;

    if (!itemType || !itemId) {
      return res.status(400).json({ error: 'itemType and itemId are required.' });
    }

    const existing = await prisma.bookmark.findUnique({
      where: {
        userId_itemType_itemId: {
          userId: req.user.id,
          itemType,
          itemId
        }
      }
    });

    if (existing) {
      await prisma.bookmark.delete({ where: { id: existing.id } });
      return res.json({ bookmarked: false, message: 'Bookmark removed.' });
    } else {
      await prisma.bookmark.create({
        data: {
          userId: req.user.id,
          itemType,
          itemId
        }
      });
      return res.json({ bookmarked: true, message: 'Bookmark saved!' });
    }
  } catch (error) {
    next(error);
  }
};

export const getUserBookmarks = async (req, res, next) => {
  try {
    const bookmarks = await prisma.bookmark.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: 'desc' }
    });

    const resourceIds = bookmarks.filter(b => b.itemType === 'RESOURCE').map(b => b.itemId);
    const careerIds = bookmarks.filter(b => b.itemType === 'CAREER').map(b => b.itemId);

    const [resources, careers] = await Promise.all([
      prisma.learningResource.findMany({ where: { id: { in: resourceIds } } }),
      prisma.career.findMany({ where: { id: { in: careerIds } } })
    ]);

    return res.json({
      resources: resources.map(r => ({ ...r, isBookmarked: true })),
      careers: careers.map(c => ({
        ...c,
        responsibilities: JSON.parse(c.responsibilities || '[]'),
        technicalSkills: JSON.parse(c.technicalSkills || '[]'),
        isBookmarked: true
      }))
    });
  } catch (error) {
    next(error);
  }
};
