import React from 'react';
import { motion } from 'framer-motion';
import MaskedComponent from './ui/masked-component';
import Image from 'next/image';

interface MemeBattleCardProps {
  left: {
    name: string;
    subtitle?: string;
    avatar: {
      src: string;
      alt: string;
    };
    theme: {
      backgroundColor: string;
      textColor: string;
    };
  };
  right: {
    name: string;
    subtitle?: string;
    avatar: {
      src: string;
      alt: string;
    };
    theme: {
      backgroundColor: string;
      textColor: string;
    };
  };
  isHot?: boolean;
  onClick?: () => void;
  className?: string;
}

const MemeBattleCard: React.FC<MemeBattleCardProps> = ({
  left,
  right,
  isHot = false,
  onClick,
  className,
}) => {
  return (
    <MaskedComponent
    as={motion.div}
    whileHover={{ scale: 1.02, boxShadow: "0 8px 24px rgba(0,0,0,0.2)" }}
    whileTap={{ scale: 0.97 }}
    transition={{ type: "spring", stiffness: 300, damping: 20 }}
    className={`relative cursor-pointer w-[120px] sm:w-[150px] md:w-[250px] shadow-lg overflow-hidden ${className}`}
    onClick={onClick}
    style={{
      aspectRatio: '3/4',
      background: '#222', // fallback
    }}
    shape='octagon'
    borderWidth='2px'
    >
      {/* Diagonal Split */}
      <div className="absolute inset-0 z-0 pointer-events-none hidden md:block">
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: `linear-gradient(135deg, ${left.theme.backgroundColor} 0% 35%, black 35% 65%, ${right.theme.backgroundColor} 65% 100%)`,
            width: '100%',
            height: '100%',
          }}
        />
      </div>

      <div className="absolute inset-0 z-10 pointer-events-none hidden md:block">
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: `linear-gradient(135deg, transparent 0% 35%, black 35% 65%, transparent 65% 100%)`,
            width: '100%',
            height: '100%',
          }}
        />
      </div>

      {/* Diagonal Split - mobile screen */}
      <div className="absolute inset-0 z-0 pointer-events-none md:hidden">
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: `linear-gradient(135deg, ${left.theme.backgroundColor} 0% 40%, black 40% 60%, ${right.theme.backgroundColor} 60% 100%)`,
            width: '100%',
            height: '100%',
          }}
        />
      </div>

      <div className="absolute inset-0 z-10 pointer-events-none md:hidden">
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: `linear-gradient(135deg, transparent 0% 40%, black 40% 60%, transparent 60% 100%)`,
            width: '100%',
            height: '100%',
          }}
        />
      </div>

      

      {/* Hot indicator */}
      {isHot && (
        <MaskedComponent
          as={motion.div}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="absolute top-1 right-1 md:top-4 md:right-4 z-20 bg-red-500 w-12"
        >
            <div className="bg-red-500 text-white text-xs px-2 py-1 font-bold shadow rounded-lg">
              hot!
            </div>
          </MaskedComponent>
      )}

      {/* Left Competitor (Top Left) */}
      <div className="absolute top-2 left-2 md:top-6 md:left-6 flex flex-col items-start">
        <div
          className="text-xs md:text-2xl font-bold tracking-wide"
          style={{ color: left.theme.textColor, textShadow: '0 2px 8px #0006' }}
        >
          {left.name}
        </div>
        <div className="w-10 h-10 md:w-20 md:h-20 rounded-full overflow-hidden border-2 border-white shadow-lg mb-2">
          <Image
            src={left.avatar.src}
            alt={left.avatar.alt}
            className="w-full h-full object-cover"
            width={80}
            height={80}
            unoptimized
          />
        </div>
        {left.subtitle && (
          <div
            className="text-xs md:text-lg font-semibold mt-1"
            style={{ color: '#27ae60', textShadow: '0 1px 4px #0005' }}
          >
            {left.subtitle}
          </div>
        )}
      </div>

      {/* Right Competitor (Bottom Right) */}
      <div className="absolute bottom-2 right-2 md:bottom-6 md:right-6 flex flex-col items-end">
        <div className="w-10 h-10 md:w-20 md:h-20 rounded-full overflow-hidden border-2 border-white shadow-lg mb-2">
          <Image
            src={right.avatar.src}
            alt={right.avatar.alt}
            className="w-full h-full object-cover"
            width={80}
            height={80}
            unoptimized
          />
        </div>
        <div
          className="text-base md:text-2xl font-bold tracking-wide"
          style={{ color: right.theme.textColor, textShadow: '0 2px 8px #0006' }}
        >
          {right.name}
        </div>
        {right.subtitle && (
          <div
            className="text-xs md:text-lg font-semibold mt-1"
            style={{ color: '#e74c3c', textShadow: '0 1px 4px #0005' }}
          >
            {right.subtitle}
          </div>
        )}
      </div>

      {/* VS Divider */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5 }}
        className="flex items-center justify-center absolute inset-0 z-20"
      >
        <div className="text-white text-base md:text-3xl font-bold rounded bg-transparent drop-shadow-lg">
          VS
        </div>
      </motion.div>
    </MaskedComponent>
  );
};

export default MemeBattleCard;