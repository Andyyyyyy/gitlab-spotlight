import { Command } from 'cmdk';
import { useEffect, useState } from 'react';
import useGroupsQuery from '../../src/useGroupsQuery';
import useProjectsQuery from '../../src/useProjectsQuery';

const openUrl = (url: string) => {
  window.open(url, '_blank')?.focus();
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

const CommandDialog = () => {
  const [open, setOpen] = useState(false);

  const [search, setSearch] = useState('');

  // Toggle the menu when ⌘K is pressed
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      console.log(e.metaKey);
      console.log({ open });

      if (e.key === 'b' && (e.metaKey || e.ctrlKey || e.altKey)) {
        setOpen((open) => !open);
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  const groups = useGroupsQuery();
  const projects = useProjectsQuery();

  return (
    <Command.Dialog open={open} onOpenChange={setOpen} label="GitLab Spotlight">
      <Command.Input value={search} onValueChange={setSearch} />
      <Command.Empty>No results found.</Command.Empty>
      <Command.List>
        <Command.Group heading="Go to">
          <Command.Item onSelect={() => goToProjectUrl('issues')}>Issues</Command.Item>
          <Command.Item onSelect={() => goToProjectUrl('boards')}>Boards</Command.Item>
          <Command.Item onSelect={() => goToProjectUrl('pipelines')}>Pipelines</Command.Item>
        </Command.Group>

        {!projects.data ? (
          <Command.Loading>Hang on…</Command.Loading>
        ) : (
          <Command.Group heading="Projects">
            {projects.data.map((project: any) => (
              <Command.Item onSelect={() => openUrl(project.web_url)}>
                {project.name}
              </Command.Item>
            ))}
          </Command.Group>
        )}
        {!groups.data ? (
          <Command.Loading>Hang on…</Command.Loading>
        ) : (
          <Command.Group heading="Groups">
            {groups.data.map((group: any) => (
              <Command.Item onSelect={() => openUrl(group.web_url)}>
                {group.name}
              </Command.Item>
            ))}
          </Command.Group>
        )}
      </Command.List>
    </Command.Dialog>
  );
};

export default CommandDialog;
