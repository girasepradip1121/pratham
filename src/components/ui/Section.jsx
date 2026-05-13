import { motion } from 'framer-motion';

const Section = ({
  children,
  id,
  className = '',
  containerClassName = '',
  initial = { opacity: 0, y: 20 },
  whileInView = { opacity: 1, y: 0 },
  viewport = { once: true, margin: "-100px" },
  transition = { duration: 0.6, ease: "easeOut" }
}) => {
  return (
    <section id={id} className={`py-5 relative overflow-hidden ${className}`}>
      <motion.div
        initial={initial}
        whileInView={whileInView}
        viewport={viewport}
        transition={transition}
        className={`max-w-7xl mx-auto px-6 ${containerClassName}`}
      >
        {children}
      </motion.div>
    </section>
  );
};

export default Section;
