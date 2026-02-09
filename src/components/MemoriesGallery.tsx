import { motion } from "framer-motion";

export default function MemoriesGallery() {
    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mt-6"
        >
            <h2 className="text-2xl font-bold text-white mb-4">
                💖 Some Beautiful Memories
            </h2>

            {/* Photos */}
            <div className="grid grid-cols-2 gap-4 mb-6">
                {[
                    "/memories/photo1.jpg",
                    "/memories/photo2.jpg",
                    "/memories/photo3.jpg",
                    "/memories/photo4.jpg",
                ].map((src, i) => (
                    <motion.img
                        key={i}
                        src={src}
                        whileHover={{ scale: 1.06 }}
                        className="rounded-2xl h-32 w-full object-cover shadow-lg cursor-pointer"
                    />
                ))}
            </div>

            {/* Video */}
            <motion.div
                whileHover={{ scale: 1.02 }}
                className="rounded-2xl overflow-hidden shadow-xl"
            >
                <video controls className="w-full">
                    <source src="/memories/video1.mp4" type="video/mp4" />
                </video>
            </motion.div>
        </motion.div>
    );
}
