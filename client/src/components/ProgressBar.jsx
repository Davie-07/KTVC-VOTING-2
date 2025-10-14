export default function ProgressBar({ value, max, label, className = '' }) {
  const percentage = max > 0 ? Math.round((value / max) * 100) : 0;
  
  return (
    <div className={`progress-container ${className}`}>
      <div className="progress-header">
        <span className="progress-label">{label}</span>
        <span className="progress-value">{value} votes ({percentage}%)</span>
      </div>
      <div className="progress-bar">
        <div 
          className="progress-fill" 
          style={{ width: `${percentage}%` }}
          data-percentage={percentage}
        />
      </div>
    </div>
  );
}
