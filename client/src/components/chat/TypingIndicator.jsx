import { motion } from "framer-motion";

const TypingIndicator = ({ name }) => {
  return (
    <div className="flex justify-start mb-2">
      <div className="border rounded-2xl rounded-bl-sm px-4 py-2">
        <div className="flex items-center gap-1">
          {name && (
            <span className="text-xs opacity-70 font-medium">{name}</span>
          )}

          {[0, 0.1, 0.2].map((delay, i) => (
            <motion.div
              key={i}
              animate={{ y: [0, -6, 0] }}
              transition={{
                duration: 0.7,
                repeat: Infinity,
                ease: "easeInOut",
                delay
              }}
              className="w-2 h-2 active rounded-full"
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default TypingIndicator;