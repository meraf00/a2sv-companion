import { getLeetcodeVersion } from './leetcode/common';
import oldUi from './leetcode/old';

const onMutation = (observer: MutationObserver) => {
  try {
    if (getLeetcodeVersion() === 'NEW') {
    } else {
      oldUi.injectContent(observer, observe);
    }
  } catch (e) {}
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
