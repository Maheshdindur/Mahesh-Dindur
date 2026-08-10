import React from 'react';

export const SectionLabel = ({ number, title, mainHeading }) => {
  return (
    <div className="section-label-header">
      <div className="section-tag">
        <span>{number}</span>
        <span>—</span>
        <span>{title}</span>
      </div>
      {mainHeading && <h2 className="section-heading">{mainHeading}</h2>}
    </div>
  );
};
