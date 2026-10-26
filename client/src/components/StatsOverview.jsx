import React, { useMemo } from 'react';
import { Files, GraduationCap, User, Briefcase, Landmark, FolderPlus } from 'lucide-react';

/**
 * Dashboard statistics displaying total document count and category breakdown.
 * Clicking any category card filters the list directly.
 */
export default function StatsOverview({ stats, selectedCategory, onSelectCategory }) {
  // useMemo: Memoizes the calculated card list and category totals so they are
  // only recomputed when the server stats or selected category changes, avoiding
  // redundant object creation on parent re-renders.
  const statCards = useMemo(() => {
    const total = stats?.totalDocuments || 0;
    const byCategory = stats?.byCategory || {
      College: 0,
      Personal: 0,
      Work: 0,
      Finance: 0,
      Other: 0
    };

    return [
      {
        id: 'All',
        label: 'Total Documents',
        count: total,
        icon: Files,
        active: selectedCategory === 'All'
      },
      {
        id: 'College',
        label: 'College',
        count: byCategory.College || 0,
        icon: GraduationCap,
        active: selectedCategory === 'College'
      },
      {
        id: 'Personal',
        label: 'Personal',
        count: byCategory.Personal || 0,
        icon: User,
        active: selectedCategory === 'Personal'
      },
      {
        id: 'Work',
        label: 'Work',
        count: byCategory.Work || 0,
        icon: Briefcase,
        active: selectedCategory === 'Work'
      },
      {
        id: 'Finance',
        label: 'Finance',
        count: byCategory.Finance || 0,
        icon: Landmark,
        active: selectedCategory === 'Finance'
      },
      {
        id: 'Other',
        label: 'Other',
        count: byCategory.Other || 0,
        icon: FolderPlus,
        active: selectedCategory === 'Other'
      }
    ];
  }, [stats, selectedCategory]);

  return (
    <section className="stats-grid" aria-label="Document statistics">
      {statCards.map((card) => {
        const IconComponent = card.icon;
        return (
          <div
            key={card.id}
            className={`stat-card ${card.active ? 'active' : ''}`}
            onClick={() => onSelectCategory(card.id)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                onSelectCategory(card.id);
              }
            }}
          >
            <div className="stat-header">
              <span className="stat-title">{card.label}</span>
              <IconComponent size={18} className="stat-icon" />
            </div>
            <div className="stat-value">{card.count}</div>
          </div>
        );
      })}
    </section>
  );
}
