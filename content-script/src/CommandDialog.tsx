import { Command } from 'cmdk';
import { useEffect, useState } from 'react';
import useGroupsQuery from '../../src/useGroupsQuery';
import useProjectsQuery from '../../src/useProjectsQuery';
import { WithBadge } from './WithBadge';

const openUrl = (url: string) => {
  window.location.href = url;
};

const goToProjectUrl = (url: string) => {
  const currentUrl = new URL(document.URL);
  const pathSegments = currentUrl.pathname.split('/');
  if (pathSegments.length < 2) return;

  const group = pathSegments[1];
  const project = pathSegments[2];

  const newUrl = `${currentUrl.origin}/${group}/${project}/-/${url}`;
  window.location.href = newUrl;
};
interface Props { 
  token: string;
}
const CommandDialog = (props: Props) => {
  const [open, setOpen] = useState(false);

  const [search, setSearch] = useState('');

  // Toggle the menu when ⌘K is pressed
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey || e.altKey)) {
        setOpen((open) => !open);
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  const groups = useGroupsQuery(props.token);
  const projects = useProjectsQuery(props.token);

  return (
    <Command.Dialog loop open={open} onOpenChange={setOpen} label="GitLab Spotlight">
      <Command.Input value={search} onValueChange={setSearch} />
      <Command.Empty>No results found.</Command.Empty>
      <Command.List>
        <Command.Group heading="Springe zu">
          <Command.Item onSelect={() => goToProjectUrl('issues')}>
            Issues
          </Command.Item>
          <Command.Item onSelect={() => goToProjectUrl('boards')}>
            Boards
          </Command.Item>
          <Command.Item onSelect={() => goToProjectUrl('pipelines')}>
            Pipelines
          </Command.Item>
        </Command.Group>

        {Object.keys(projects).length == 0 ? (
          <Command.Loading>Hang on…</Command.Loading>
        ) : (
          <Command.Group heading="Projekte">
            {projects.map((project: any) => (
              <Command.Item onSelect={() => openUrl(project.web_url)} >
                <WithBadge badgeTitle='Projekt'>{project.name}</WithBadge> 
              </Command.Item>
            ))}
          </Command.Group>
        )}
        {Object.keys(groups).length == 0 ? (
          <Command.Loading>Hang on…</Command.Loading>
        ) : (
          <Command.Group heading="Gruppen">
            {groups.map((group: any) => (
              <Command.Item onSelect={() => openUrl(group.web_url)}>
                <WithBadge badgeTitle='Gruppe'>{group.name}</WithBadge>
              </Command.Item>
            ))}
          </Command.Group>
        )}
      </Command.List>
    </Command.Dialog>
  );
};

export default CommandDialog;
