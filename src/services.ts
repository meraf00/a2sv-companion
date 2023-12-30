import { AuthContentScript } from './scripts';
import authHandler from './services/auth.service';

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.from === AuthContentScript) {
    authHandler(message, sender, sendResponse);
  }
});
