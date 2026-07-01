import { clsx } from 'clsx';
import type { Status } from '../../types';
import { STATUS_BADGE, STATUS_LABEL } from '../../types';

interface Props {
  status: Status;
  size?: 'sm' | 'md';
}

export default function Badge({ status, size = 'sm' }: Props) {
  return (
    <span className={clsx(
      'inline-flex items-center rounded-full font-medium',
      STATUS_BADGE[status],
      size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-sm'
    )}>
      {STATUS_LABEL[status]}
    </span>
  );
}
