export const getLocalStorage = (key: string) => {
  return new Promise((resolve, _) => {
    chrome.storage.local.get([key], (result) => {
      resolve(result[key]);
    });
  });
};
