import { motion } from 'framer-motion'

export const PageLoader = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <motion.div
        className="flex flex-col items-center gap-4"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="relative">
          <motion.div
            className="w-12 h-12 rounded-full border-4 border-primary/20"
            style={{ borderTopColor: 'hsl(var(--primary))' }}
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          />
        </div>
        <p className="text-sm text-muted-foreground">Загрузка...</p>
      </motion.div>
    </div>
  )
}
