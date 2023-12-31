import { AuthContentScript, LeetcodeContentScript } from './scripts';
import authHandler from './services/auth.service';
import leetcodeHandler from './services/leetcode.service';

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.from === AuthContentScript) {
    authHandler(message, sender, sendResponse);
    return true;
  } else if (message.from === LeetcodeContentScript) {
    console.log('we are here');
    leetcodeHandler(message, sender, sendResponse);
    return true;
  }
});
