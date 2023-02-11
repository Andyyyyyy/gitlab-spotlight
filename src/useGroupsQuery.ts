import { useQuery } from 'react-query';
import LinkHeader from 'http-link-header';
import { useLocalStorage } from './useLocalStorage';

const groups = (token: string) => {
  const [groups, setGroups] = useLocalStorage<string>('gitlabGroups', '{}');
  const [timestamp, setTimestamp] = useLocalStorage<string>(
    'gitlabTimestamp',
    '0'
  );

  useQuery(
    'groups',
    async () => {
      const groups = [];
      let hasMorePages = true;
      let groupsFetchUrl = `${
        import.meta.env.VITE_GITLAB_URL
      }groups?pagination=keyset&per_page=100`; //todo config
      while (hasMorePages) {
        const response = await fetch(groupsFetchUrl, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.headers.has('Link')) {
          const linkheader = LinkHeader.parse(
            response.headers.get('Link') as string
          );
          if (linkheader.has('rel', 'next')) {
            const reference = linkheader.rel('next');
            groupsFetchUrl = reference[0].uri;
          } else {
            hasMorePages = false;
          }
        } else {
          hasMorePages = false;
        }
        groups.push(response.json());
      }
      return Promise.all(groups);
    },
    {
      select: (data) => data.flat(),
      onSuccess: (data) => {
        setGroups(JSON.stringify(data));
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        setTimestamp(tomorrow.getTime().toString());
      },
      enabled:
        Object.keys(JSON.parse(groups)).length == 0 ||
        parseInt(timestamp) < new Date().getTime(),
    }
  );
  return JSON.parse(groups) as { [key: string]: any };
};

export default groups;
