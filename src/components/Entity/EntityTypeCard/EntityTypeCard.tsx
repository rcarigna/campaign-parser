import { EntityKind } from '@/types';
import type { EntityMetadata } from '@/types';

type EntityTypeCardProps = {
  metadata: EntityMetadata;
  isSelected: boolean;
  onClick: (kind: EntityKind) => void;
};

export const EntityTypeCard = ({
  metadata,
  isSelected,
  onClick,
}: EntityTypeCardProps) => {
  const { kind, emoji, label, description } = metadata;

  return (
    <div
      className={`p-4 rounded-lg border cursor-pointer transition-all duration-200 ${
        isSelected
          ? 'bg-blue-100 border-blue-300 ring-2 ring-blue-200'
          : 'bg-white border-gray-200 hover:bg-gray-50 hover:border-gray-300'
      }`}
      onClick={() => onClick(kind)}
      role='button'
      tabIndex={0}
      aria-pressed={isSelected}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick(kind);
        }
      }}
    >
      <div className='text-2xl mb-2 text-center'>{emoji}</div>
      <div className='text-sm font-medium text-gray-700 text-center mb-1'>
        {label}
      </div>
      <div className='text-xs text-gray-500 text-center'>{description}</div>
    </div>
  );
};
