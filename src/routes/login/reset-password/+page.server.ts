import type { PageServerLoad } from './$types';

export const load: PageServerLoad = ({ url }: { url: URL }) => {
  const token = url.searchParams.get('token');

  if (!token) {
    return { token: '' };
  }

  return { token };
};
