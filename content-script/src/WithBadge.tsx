interface Props {
  children: React.ReactNode;
  badgeTitle: string;
}

export const WithBadge = (props: Props) => {
  return (
    <div className="itemBadge">
      <span>{props.children}</span>
      {props.badgeTitle && (
        <span className="itemBadgeTitle">{props.badgeTitle}</span>
      )}
    </div>
  );
};
