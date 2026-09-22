interface MinorActsBadgeProps {
  size?: number;
}

export function MinorActsBadge({ size = 14 }: MinorActsBadgeProps) {
  return (
    <img
      className="minor-acts-badge"
      src={`${import.meta.env.BASE_URL}minor-acts-logo.svg`}
      alt="Minor Acts"
      title="Minor Acts"
      height={size}
    />
  );
}
