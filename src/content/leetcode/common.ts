export const getLeetcodeVersion = () => {
  if (document.getElementById('__next')) return 'NEW';
  return 'OLD';
};
