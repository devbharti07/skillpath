import prisma from '../config/prisma.js';

export const getOnboarding = async (req, res, next) => {
  try {
    const profile = await prisma.userProfile.findUnique({
      where: { userId: req.user.id }
    });

    if (!profile) {
      return res.json({ onboardingCompleted: false, data: {} });
    }

    return res.json({
      onboardingCompleted: profile.onboardingCompleted,
      data: {
        educationLevel: profile.educationLevel,
        primaryCareerInterest: profile.primaryCareerInterest,
        technicalSkills: profile.technicalSkills ? JSON.parse(profile.technicalSkills) : [],
        softSkills: profile.softSkills ? JSON.parse(profile.softSkills) : [],
        topicsEnjoyed: profile.topicsEnjoyed ? JSON.parse(profile.topicsEnjoyed) : [],
        preferredCareers: profile.preferredCareers ? JSON.parse(profile.preferredCareers) : [],
        proficiencyLevel: profile.proficiencyLevel,
        weeklyAvailabilityHours: profile.weeklyAvailabilityHours,
        shortTermGoals: profile.shortTermGoals,
        longTermGoals: profile.longTermGoals
      }
    });
  } catch (error) {
    next(error);
  }
};

export const saveOnboarding = async (req, res, next) => {
  try {
    const {
      educationLevel,
      technicalSkills = [],
      softSkills = [],
      topicsEnjoyed = [],
      preferredCareers = [],
      proficiencyLevel = 'BEGINNER',
      weeklyAvailabilityHours = 10,
      shortTermGoals = '',
      longTermGoals = '',
      isCompleted = true
    } = req.body;

    // Validate availability
    const hours = Math.max(1, Math.min(80, Number(weeklyAvailabilityHours) || 10));

    // Update profile
    const updatedProfile = await prisma.userProfile.upsert({
      where: { userId: req.user.id },
      create: {
        userId: req.user.id,
        educationLevel: educationLevel || 'College Student',
        primaryCareerInterest: preferredCareers[0] || 'Web Development',
        technicalSkills: JSON.stringify(technicalSkills),
        softSkills: JSON.stringify(softSkills),
        topicsEnjoyed: JSON.stringify(topicsEnjoyed),
        preferredCareers: JSON.stringify(preferredCareers),
        proficiencyLevel,
        weeklyAvailabilityHours: hours,
        shortTermGoals,
        longTermGoals,
        onboardingCompleted: Boolean(isCompleted)
      },
      update: {
        educationLevel: educationLevel || undefined,
        primaryCareerInterest: preferredCareers[0] || undefined,
        technicalSkills: JSON.stringify(technicalSkills),
        softSkills: JSON.stringify(softSkills),
        topicsEnjoyed: JSON.stringify(topicsEnjoyed),
        preferredCareers: JSON.stringify(preferredCareers),
        proficiencyLevel,
        weeklyAvailabilityHours: hours,
        shortTermGoals,
        longTermGoals,
        onboardingCompleted: Boolean(isCompleted)
      }
    });

    // Sync self-reported skills into UserSkill table as unverified
    for (const skillName of technicalSkills) {
      const dbSkill = await prisma.skill.findFirst({
        where: { name: { equals: skillName } }
      });
      if (dbSkill) {
        await prisma.userSkill.upsert({
          where: {
            userId_skillId: {
              userId: req.user.id,
              skillId: dbSkill.id
            }
          },
          create: {
            userId: req.user.id,
            skillId: dbSkill.id,
            proficiency: proficiencyLevel,
            isVerified: false
          },
          update: {
            proficiency: proficiencyLevel
          }
        });
      }
    }

    // Auto-unlock initial achievement if completed
    if (isCompleted) {
      const existingAchievement = await prisma.achievement.findFirst({
        where: { userId: req.user.id, category: 'SPECIAL', title: 'Curious Explorer' }
      });
      if (!existingAchievement) {
        await prisma.achievement.create({
          data: {
            userId: req.user.id,
            title: 'Curious Explorer',
            description: 'Completed student onboarding and mapped your career goals.',
            badgeIcon: 'Compass',
            category: 'SPECIAL'
          }
        });
      }
    }

    // Generate Career Discovery Summary
    // Fetch all careers from DB to compute relevance match score based on student answers
    const allCareers = await prisma.career.findMany();
    const verifiedUserSkills = await prisma.userSkill.findMany({
      where: { userId: req.user.id, isVerified: true },
      include: { skill: true }
    });
    const verifiedSkillNames = verifiedUserSkills.map(us => us.skill.name);

    const careerSuggestions = allCareers.map(career => {
      const techSkills = JSON.parse(career.technicalSkills || '[]');
      // Matched skills based on student's self-selected interests or skills
      const selfReportedMatch = techSkills.filter(s => technicalSkills.includes(s));
      const confirmedMatch = techSkills.filter(s => verifiedSkillNames.includes(s));
      const untestedSkills = techSkills.filter(s => !verifiedSkillNames.includes(s));

      let matchScore = 40; // baseline
      if (preferredCareers.some(pc => career.title.toLowerCase().includes(pc.toLowerCase()))) {
        matchScore += 35;
      }
      matchScore += selfReportedMatch.length * 10;
      matchScore = Math.min(98, matchScore);

      return {
        id: career.id,
        slug: career.slug,
        title: career.title,
        category: career.category,
        matchScore,
        selfReportedSkillsCount: selfReportedMatch.length,
        untestedSkills,
        confirmedSkills: confirmedMatch,
        summary: `Suggested based on your expressed interest in ${topicsEnjoyed.slice(0, 2).join(' and ') || 'technology'}.`
      };
    }).sort((a, b) => b.matchScore - a.matchScore);

    return res.json({
      message: isCompleted ? 'Onboarding successfully completed!' : 'Progress saved.',
      profile: updatedProfile,
      discoverySummary: {
        userSelectedPreferences: {
          educationLevel,
          preferredCareers,
          topicsEnjoyed,
          weeklyHours: hours,
          proficiencyLevel
        },
        selfReportedSkills: technicalSkills,
        verifiedSkillsConfirmedByAssessment: verifiedSkillNames,
        untestedSkillsNotice: 'Self-reported skills are provisional until tested through SkillPath assessments.',
        topCareerSuggestions: careerSuggestions.slice(0, 4)
      }
    });
  } catch (error) {
    next(error);
  }
};
