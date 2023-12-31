import { CodeforcesEvent } from '../events';
import { CodeforcesSubmission } from '../lib/codeforce/types';
import { CodeforcesContentScript } from '../scripts';
import {
  getSubmissionCodeAndTimeTaken,
  getUserHandle,
} from './codeforces/parseui';

const header = document.getElementById('header');
const pushBtn = document.createElement('button');

header.insertBefore(pushBtn, header.querySelector('.lang-chooser'));

pushBtn.style.position = 'absolute';
pushBtn.style.top = '50%';
pushBtn.style.right = '50%';
pushBtn.style.transform = 'translateX(60%)';

pushBtn.innerText = 'Push Last Submission';

pushBtn.addEventListener('click', async () => {
  chrome.runtime.sendMessage(
    {
      from: CodeforcesContentScript,
      type: CodeforcesEvent.GET_LAST_SUBMISSION,
      codeforcesHandle: getUserHandle(),
    },
    async (response: CodeforcesSubmission) => {
      const { timeTaken, code } = await getSubmissionCodeAndTimeTaken(
        response.id.toString()
      );

      chrome.runtime.sendMessage(
        {
          from: CodeforcesContentScript,
          type: CodeforcesEvent.PUSH_LAST_SUBMISSION_TO_SHEETS,
          codeforcesHandle: getUserHandle(),
          code,
          timeTaken,
          submission: response,
        },
        (response) => {
          console.log(response);
        }
      );
    }
  );
});
