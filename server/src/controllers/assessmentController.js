import prisma from '../config/prisma.js';

export const getAssessments = async (req, res, next) => {
  try {
    const { category, difficulty } = req.query;

    const where = { isPublished: true };
    if (category) where.category = category;
    if (difficulty) where.difficulty = difficulty;

    const assessments = await prisma.assessment.findMany({
      where,
      include: {
        _count: {
          select: { questions: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    // Check if user has completed any of these
    let userAttempts = [];
    if (req.user) {
      userAttempts = await prisma.assessmentAttempt.findMany({
        where: { userId: req.user.id },
        select: {
          assessmentId: true,
          scorePercent: true,
          proficiencyResult: true,
          completedAt: true
        },
        orderBy: { completedAt: 'desc' }
      });
    }

    const assessmentCards = assessments.map(a => {
      const pastAttempt = userAttempts.find(att => att.assessmentId === a.id);
      return {
        id: a.id,
        slug: a.slug,
        title: a.title,
        category: a.category,
        difficulty: a.difficulty,
        durationMinutes: a.durationMinutes,
        passingScorePercent: a.passingScorePercent,
        description: a.description,
        totalQuestions: a._count.questions,
        lastAttempt: pastAttempt ? {
          scorePercent: pastAttempt.scorePercent,
          proficiencyResult: pastAttempt.proficiencyResult,
          completedAt: pastAttempt.completedAt
        } : null
      };
    });

    return res.json(assessmentCards);
  } catch (error) {
    next(error);
  }
};

export const getAssessmentBySlug = async (req, res, next) => {
  try {
    const { slug } = req.params;

    const assessment = await prisma.assessment.findUnique({
      where: { slug },
      include: {
        questions: {
          orderBy: { orderIndex: 'asc' },
          include: {
            options: {
              orderBy: { orderIndex: 'asc' },
              select: {
                id: true,
                questionId: true,
                optionText: true,
                orderIndex: true
                // Note: isCorrect is NEVER returned to client to prevent client manipulation!
              }
            }
          }
        }
      }
    });

    if (!assessment) {
      return res.status(404).json({ error: 'Assessment not found.' });
    }

    return res.json({
      id: assessment.id,
      slug: assessment.slug,
      title: assessment.title,
      category: assessment.category,
      difficulty: assessment.difficulty,
      durationMinutes: assessment.durationMinutes,
      passingScorePercent: assessment.passingScorePercent,
      description: assessment.description,
      instructions: assessment.instructions,
      questions: assessment.questions.map(q => ({
        id: q.id,
        questionText: q.questionText,
        orderIndex: q.orderIndex,
        options: q.options
      }))
    });
  } catch (error) {
    next(error);
  }
};

export const submitAssessment = async (req, res, next) => {
  try {
    const { assessmentId, responses = [], timeSpentSeconds = 0 } = req.body;

    if (!assessmentId) {
      return res.status(400).json({ error: 'assessmentId is required.' });
    }

    if (!Array.isArray(responses) || responses.length === 0) {
      return res.status(400).json({ error: 'Please submit responses to complete the assessment.' });
    }

    const assessment = await prisma.assessment.findUnique({
      where: { id: assessmentId },
      include: {
        questions: {
          include: { options: true }
        }
      }
    });

    if (!assessment) {
      return res.status(404).json({ error: 'Assessment not found.' });
    }

    // Evaluate answers strictly on server
    const totalQuestions = assessment.questions.length;
    let correctCount = 0;
    const evaluatedResponses = [];
    const questionReview = [];

    for (const question of assessment.questions) {
      const correctOption = question.options.find(opt => opt.isCorrect);
      const userSubmission = responses.find(r => r.questionId === question.id);
      const selectedOptionId = userSubmission?.selectedOptionId;

      const isCorrect = selectedOptionId ? selectedOptionId === correctOption?.id : false;
      if (isCorrect) correctCount++;

      evaluatedResponses.push({
        questionId: question.id,
        selectedOptionId: selectedOptionId || (question.options[0]?.id || ''),
        isCorrect
      });

      questionReview.push({
        questionId: question.id,
        questionText: question.questionText,
        explanation: question.explanation,
        selectedOptionId,
        correctOptionId: correctOption?.id,
        isCorrect,
        options: question.options.map(opt => ({
          id: opt.id,
          optionText: opt.optionText,
          isCorrect: opt.isCorrect
        }))
      });
    }

    const scorePercent = Math.round((correctCount / totalQuestions) * 100);

    let proficiencyResult = 'BEGINNER';
    if (scorePercent >= 85) {
      proficiencyResult = 'ADVANCED';
    } else if (scorePercent >= 60) {
      proficiencyResult = 'INTERMEDIATE';
    }

    // Save Attempt and individual responses in a transaction
    const attempt = await prisma.$transaction(async (tx) => {
      const newAttempt = await tx.assessmentAttempt.create({
        data: {
          assessmentId: assessment.id,
          userId: req.user.id,
          scorePercent,
          totalQuestions,
          correctAnswers: correctCount,
          proficiencyResult,
          timeSpentSeconds: Number(timeSpentSeconds) || 0
        }
      });

      for (const item of evaluatedResponses) {
        if (item.selectedOptionId) {
          await tx.assessmentResponse.create({
            data: {
              attemptId: newAttempt.id,
              questionId: item.questionId,
              selectedOptionId: item.selectedOptionId,
              isCorrect: item.isCorrect
            }
          });
        }
      }

      return newAttempt;
    });

    // Update or verify corresponding skill
    const matchedSkill = await prisma.skill.findFirst({
      where: {
        OR: [
          { name: { contains: assessment.category } },
          { name: { contains: assessment.title.split(' ')[0] } }
        ]
      }
    });

    if (matchedSkill) {
      await prisma.userSkill.upsert({
        where: {
          userId_skillId: {
            userId: req.user.id,
            skillId: matchedSkill.id
          }
        },
        create: {
          userId: req.user.id,
          skillId: matchedSkill.id,
          proficiency: proficiencyResult,
          isVerified: scorePercent >= assessment.passingScorePercent,
          score: scorePercent
        },
        update: {
          proficiency: proficiencyResult,
          isVerified: scorePercent >= assessment.passingScorePercent ? true : undefined,
          score: Math.max(scorePercent, 0)
        }
      });
    }

    // Award Achievement if score >= 80%
    if (scorePercent >= 80) {
      const existingBadge = await prisma.achievement.findFirst({
        where: { userId: req.user.id, title: 'Knowledge Champion' }
      });
      if (!existingBadge) {
        await prisma.achievement.create({
          data: {
            userId: req.user.id,
            title: 'Knowledge Champion',
            description: `Scored ${scorePercent}% on the ${assessment.title} assessment!`,
            badgeIcon: 'Zap',
            category: 'ASSESSMENT'
          }
        });
      }
    }

    // Fetch recommended roadmaps & resources
    const recommendedRoadmaps = await prisma.roadmap.findMany({
      where: { isPublished: true },
      take: 2,
      select: { id: true, slug: true, title: true, level: true, durationWeeks: true }
    });

    const recommendedResources = await prisma.learningResource.findMany({
      where: { category: assessment.category },
      take: 3
    });

    return res.status(201).json({
      attemptId: attempt.id,
      scorePercent,
      totalQuestions,
      correctAnswers: correctCount,
      proficiencyResult,
      passed: scorePercent >= assessment.passingScorePercent,
      timeSpentSeconds,
      strongAreas: scorePercent >= 60
        ? ['Core concepts and theoretical definitions', 'Standard API execution semantics']
        : ['Foundational syntax understanding'],
      areasForImprovement: scorePercent < 80
        ? ['Deep edge-case handling', 'Complex asynchronous execution pipelines and performance nuances']
        : ['Continuous advanced real-world project application'],
      disclaimer: 'This assessment score is an educational estimate for self-directed study and does not represent an accredited certification or guaranteed professional competence.',
      questionReview,
      recommendedRoadmaps,
      recommendedResources
    });
  } catch (error) {
    next(error);
  }
};

export const getAttemptsHistory = async (req, res, next) => {
  try {
    const attempts = await prisma.assessmentAttempt.findMany({
      where: { userId: req.user.id },
      include: {
        assessment: {
          select: { id: true, slug: true, title: true, category: true, difficulty: true }
        }
      },
      orderBy: { completedAt: 'desc' }
    });

    return res.json(attempts);
  } catch (error) {
    next(error);
  }
};

export const getAttemptById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const attempt = await prisma.assessmentAttempt.findUnique({
      where: { id },
      include: {
        assessment: true,
        responses: {
          include: {
            question: {
              include: { options: true }
            },
            selectedOption: true
          }
        }
      }
    });

    if (!attempt || (attempt.userId !== req.user.id && req.user.role !== 'ADMIN')) {
      return res.status(404).json({ error: 'Assessment attempt record not found.' });
    }

    return res.json(attempt);
  } catch (error) {
    next(error);
  }
};
