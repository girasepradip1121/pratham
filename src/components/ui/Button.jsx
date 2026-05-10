import { motion } from 'framer-motion';

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className = '', 
  onClick, 
  ...props 
}) => {
  const variants = {
    primary: 'bg-primary-500 text-black hover:bg-primary-400 shadow-[0_0_20px_rgba(245,158,11,0.2)]',
    outline: 'border border-white/10 hover:border-primary-500/50 hover:bg-primary-500/5 text-white',
    ghost: 'hover:bg-white/5 text-gray-400 hover:text-white',
    accent: 'bg-white text-black hover:bg-gray-200'
  };

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg font-semibold'
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`rounded-full transition-all duration-300 flex items-center justify-center gap-2 ${variants[variant]} ${sizes[size]} ${className}`}
      onClick={onClick}
      {...props}
    >
      {children}
    </motion.button>
  );
};

export default Button;
