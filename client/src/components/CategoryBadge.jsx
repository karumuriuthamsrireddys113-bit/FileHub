import React from 'react';
import { Tag } from 'lucide-react';

/**
 * CategoryBadge displays a color-coded tag for document categories
 */
export default function CategoryBadge({ category }) {
  const normalized = (category || 'Other').toLowerCase();
  
  const badgeClass = `badge badge-${normalized}`;

  return (
    <span className={badgeClass}>
      <Tag size={11} />
      {category || 'Other'}
    </span>
  );
}
