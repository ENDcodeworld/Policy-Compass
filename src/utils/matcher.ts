import { Policy, UserProfile, MatchedPolicy, EducationLevel } from "@/types";

const EDUCATION_ORDER: EducationLevel[] = [
  "junior_college",
  "undergraduate",
  "master",
  "phd",
];

const educationIndex = (edu: EducationLevel): number => {
  return EDUCATION_ORDER.indexOf(edu);
};

export const matchPolicies = (
  policies: Policy[],
  profile: UserProfile
): MatchedPolicy[] => {
  return policies
    .map((policy) => {
      let score = 0;
      const reasons: string[] = [];

      const userEduIndex = educationIndex(profile.education);
      const policyEduIndexes = policy.education.map(educationIndex);
      const maxPolicyEduIndex = Math.max(...policyEduIndexes);

      if (userEduIndex >= Math.min(...policyEduIndexes)) {
        const eduScore = Math.min(userEduIndex, maxPolicyEduIndex) + 1;
        score += eduScore * 20;
        reasons.push("学历条件符合");
      } else {
        score -= 100;
      }

      if (profile.targetCities.length > 0) {
        if (profile.targetCities.includes(policy.city)) {
          score += 30;
          reasons.push(`${policy.city}是意向城市`);
        } else {
          score -= 10;
        }
      }

      if (profile.isFreshGraduate) {
        if (policy.tags.some((tag) => tag.includes("应届"))) {
          score += 15;
          reasons.push("应届毕业生专项政策");
        }
      }

      if (profile.hasEntrepreneurshipPlan) {
        if (policy.category === "startup") {
          score += 25;
          reasons.push("创业相关扶持政策");
        }
      }

      if (policy.difficulty === "easy") {
        score += 10;
        reasons.push("申请难度较低");
      } else if (policy.difficulty === "medium") {
        score += 5;
      }

      if (policy.viewCount > 20000) {
        score += 5;
        reasons.push("热门政策");
      }

      return {
        ...policy,
        matchScore: Math.max(0, score),
        matchReasons: reasons,
      };
    })
    .filter((p) => p.matchScore > 0)
    .sort((a, b) => b.matchScore - a.matchScore);
};

export const getMatchLevel = (score: number): { level: string; color: string } => {
  if (score >= 80) return { level: "非常匹配", color: "emerald" };
  if (score >= 60) return { level: "比较匹配", color: "blue" };
  if (score >= 40) return { level: "一般匹配", color: "amber" };
  return { level: "匹配度较低", color: "slate" };
};
