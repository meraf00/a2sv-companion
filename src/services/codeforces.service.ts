import { CodeforcesEvent } from '../events';
import Codeforces from '../lib/codeforce/api';
import { upload } from '../lib/github';
import { getCodeforcesLangExtenson } from '../utils/lang';

const codeforcesHandler = (
  message: any,
  sender: chrome.runtime.MessageSender,
  sendResponse: (response?: any) => void
) => {
  if (message.type === CodeforcesEvent.GET_LAST_SUBMISSION) {
    Codeforces.getLastSubmission(message.codeforcesHandle).then(
      (submission) => {
        sendResponse(submission);
      }
    );
  } else if (message.type === CodeforcesEvent.PUSH_LAST_SUBMISSION_TO_SHEETS) {
    chrome.storage.local.get(['selectedRepo', 'folderPath']).then((result) => {
      const { selectedRepo, folderPath } = result;
      const submission = message.submission;
      const commitMsg = `Add solution for ${submission.problem.name}`;

      let path = '';
      if (folderPath) {
        if (folderPath[folderPath.length - 1] != '/') {
          path = folderPath + '/';
        }
      }

      let filename = `${submission.problem.contestId}${
        submission.problem.index
      } ${submission.problem.name.replace(
        ' ',
        '-'
      )}.${getCodeforcesLangExtenson(submission.programmingLanguage)}`;
      path += filename;
      upload(selectedRepo, path, message.code, commitMsg);
    });
  }
};

export default codeforcesHandler;
