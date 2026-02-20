import { motion } from "framer-motion";
import photo1 from "../memories/photo1.jpeg";
import photo2 from "../memories/photo2.jpeg";
import photo3 from "../memories/photo3.jpeg";
import photo4 from "../memories/photo4.jpeg";
import video1 from "../memories/video1.mp4";

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
                    photo1,
                    photo2,
                    photo3,
                    photo4,
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
                    <source src={video1} type="video/mp4" />
                </video>
            </motion.div>
        </motion.div>
    );
}
