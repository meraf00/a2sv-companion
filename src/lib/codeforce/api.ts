import { CodeforcesSubmission } from './types';

const getSubmissions = async (codeforcesHandle: string) => {
  const response = await fetch(
    `https://codeforces.com/api/user.status?handle=${codeforcesHandle}`
  );

  if (response.status == 200) {
    const submissions = (await response.json())
      .result as CodeforcesSubmission[];

    return submissions;
  }
  return [];
};

const getLastSubmission = async (
  codeforcesHandle: string
): Promise<CodeforcesSubmission | null> => {
  const submissions = await getSubmissions(codeforcesHandle);

  for (const submission of submissions) {
    if (submission.verdict === 'OK') {
      return submission;
    }
  }

  return null;
};

const getTries = async (codeforcesHandle: string, submissionId: string) => {
  const id = parseInt(submissionId);

  const submissions = await getSubmissions(codeforcesHandle);
  let minAccepted = Infinity;

  for (let submission of submissions) {
    if (submission.verdict === 'OK')
      minAccepted = Math.min(minAccepted, submission.creationTimeSeconds);
  }

  let tries = 1;

  for (let submission of submissions) {
    if (submission.creationTimeSeconds < minAccepted) tries++;
  }

  return minAccepted !== Infinity ? tries : 0;
};

export default {
  getSubmissions,
  getLastSubmission,
  getTries,
};
