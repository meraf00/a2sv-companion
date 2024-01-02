import { getLeetcodeVersion } from './leetcode/common';
import oldUi from './leetcode/old';
import newUi from './leetcode/new';
import { removeContent } from './leetcode/common';

const onMutation = (observer: MutationObserver) => {
  let hide = true;

  if (
    window.location.href.includes('submissions') &&
    window.location.href.includes('https://leetcode.com/problems/')
  ) {
    hide = false;
  }

  try {
    if (getLeetcodeVersion() === 'NEW') {
      if (hide) {
        removeContent(observer, observe);
      } else {
        newUi.injectContent(observer, observe);
      }
    } else {
      if (hide) {
        removeContent(observer, observe);
      } else {
        oldUi.injectContent(observer, observe);
      }
    }
  } catch (e) {
    console.log(e);
  }
};

const mutationObserver: MutationObserver = new MutationObserver(() =>
  onMutation(mutationObserver)
);

const observe = () => {
  mutationObserver.observe(document.body, {
    childList: true,
    subtree: true,
  });
};

observe();
