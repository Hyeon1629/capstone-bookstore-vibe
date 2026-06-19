interface SpecialtyTagsProps {
  tags: string[];
}

export function SpecialtyTags({ tags }: SpecialtyTagsProps) {
  if (tags.length === 0) return null;
  return (
    <div className="px-5 pb-1 pt-1">
      <div className="font-mono text-[10.5px] text-paper-mute font-semibold tracking-[0.4px] uppercase mb-2">
        전문 분야
      </div>
      <div className="flex flex-wrap gap-1.5">
        {tags.map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center px-2.5 py-1 rounded-full bg-surface-01 border border-hairline font-ui text-[11.5px] font-medium text-paper-dim tracking-tight"
          >
            #{tag}
          </span>
        ))}
      </div>
    </div>
  );
}
