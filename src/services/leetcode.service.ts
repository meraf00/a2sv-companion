import { LeetcodeEvent } from '../events';
import Leetcode from '../lib/leetcode/api';

const leetcodeHandler = (
  message: any,
  sender: chrome.runtime.MessageSender,
  sendResponse: (response?: any) => void
) => {
  if (message.type === LeetcodeEvent.PUSH_TO_SHEETS) {
    Leetcode.push(message, sendResponse);
  } else if (message.type === LeetcodeEvent.PUSH_LAST_SUBMISSION_TO_SHEETS) {
    const { titleSlug } = message.payload;
    console.log(titleSlug);
    Leetcode.getLastAcceptedSubmissionId(titleSlug).then(
      (submissionId): void => {
        console.log(submissionId);
        Leetcode.push({ ...message.payload, submissionId }, sendResponse);
        console.log(titleSlug, '<<<', message, {
          ...message.payload,
          submissionId,
        });
      }
    );
  }
};

export default leetcodeHandler;
