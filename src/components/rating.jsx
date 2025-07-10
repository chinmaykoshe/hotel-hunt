import React from 'react';

function Rating({ value }) {
  return (
    <div>
      {Array.from({ length: 5 }, (_, i) => (
        <span key={i}>{i < value ? '⭐' : '☆'}</span>
      ))}
    </div>
  );
}

export default Rating;
