"use client";

import { motion } from "framer-motion";
import { ArrowRight, BarChart3, DollarSign, LineChart } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center">
      <div className="container mx-auto px-4 py-16 sm:py-24">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="text-center space-y-12"
        >
          <motion.h1
            className="text-5xl sm:text-7xl font-bold text-gray-900 dark:text-white"
            initial={{ y: 20 }}
            animate={{ y: 0 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
          >
            GRI Referral Platform
          </motion.h1>

          <motion.p
            className="text-xl sm:text-2xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            Empower your network, grow your business.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-6 justify-center items-center"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.6 }}
          >
            <motion.a
              href="/dashboard"
              className="group px-8 py-3 rounded-full bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-lg font-semibold hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors duration-200 flex items-center gap-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Get Started
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </motion.a>
            <motion.a
              href="/login"
              className="px-8 py-3 rounded-full border-2 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white text-lg font-semibold hover:border-gray-900 dark:hover:border-white transition-colors duration-200"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Sign In
            </motion.a>
          </motion.div>
        </motion.div>

        <motion.div
          className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
        >
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              className="p-6 rounded-2xl bg-gray-50 dark:bg-gray-800 hover:shadow-xl transition-shadow duration-200"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 + index * 0.2, duration: 0.6 }}
              whileHover={{ y: -5 }}
            >
              <feature.icon className="w-12 h-12 text-gray-900 dark:text-white mb-4" />
              <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                {feature.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}

const features = [
  {
    title: "Track Referrals",
    description:
      "Monitor your referrals in real-time with detailed analytics and insights.",
    icon: BarChart3,
  },
  {
    title: "Earn Rewards",
    description:
      "Get rewarded for successful referrals with our competitive commission structure.",
    icon: DollarSign,
  },
  {
    title: "Performance Insights",
    description:
      "Access detailed performance metrics and improve your referral strategy.",
    icon: LineChart,
  },
];
