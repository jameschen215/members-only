import { format } from 'date-fns';

export const capitalize = (word: string) => {
  return word.slice(0, 1).toUpperCase() + word.slice(1);
};

export function formatDate(date: Date, fmt = 'yyyy-MM-dd') {
  return format(date, fmt);
}
