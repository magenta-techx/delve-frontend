export const getInitials = (name: string) => {
  const names = name.trim().split(' ').filter(Boolean);
  if (names.length === 0) return '';
  if (names.length === 1) {
    return names[0]?.substring(0, 2).toUpperCase() ?? '';
  }
  return (
    (names[0]?.charAt(0).toUpperCase() ?? '') +
    (names[1]?.charAt(0).toUpperCase() ?? '')
  );
};

export const convertToTitleCase = (str: string) => {
  return str
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

export const converKebabAndSnakeToTitleCase = (str: string) => {
  const words = str.split(/[-_]/).filter(Boolean);
  const titledWords = words.map(
    word => word.charAt(0).toUpperCase() + word.slice(1)
  );
  return titledWords.join(' ');
};

export const truncateString = (str: string, maxLength: number) => {
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength - 3) + '...';
};
