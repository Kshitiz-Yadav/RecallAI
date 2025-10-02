
import { useState, useRef } from 'react';

const Tooltip = ({ children, text }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const iconRef = useRef(null);

  const handleMouseEnter = () => {
    if (iconRef.current) {
      const rect = iconRef.current.getBoundingClientRect();
      setPosition({
        top: rect.top + rect.height / 2,
        left: rect.left
      });
    }
    setIsVisible(true);
  };

  return (
    <div className="relative inline-block">
      <div
        ref={iconRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={() => setIsVisible(false)}
      >
        {children}
      </div>
      {isVisible && (
        <div 
          className="fixed z-[100] w-64 px-3 py-2 text-sm text-white bg-gray-900 rounded-lg shadow-lg pointer-events-none"
          style={{
            top: `${position.top}px`,
            left: `${position.left - 272}px`,
            transform: 'translateY(-50%)'
          }}
        >
          {text}
          <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-full w-0 h-0 border-t-4 border-b-4 border-l-4 border-transparent border-l-gray-900"></div>
        </div>
      )}
    </div>
  );
};

export default Tooltip;