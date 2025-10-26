import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IconAlertCircle } from "@tabler/icons-react";

export default function DeleteAccountModal({ isOpen, onClose }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-40 bg-black/80 backdrop-blur-sm"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Modal */}
          <motion.div
            className="fixed inset-0 flex justify-center items-center z-50 p-4"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
          >
            <div className="relative w-full max-w-lg rounded-xl shadow-lg bg-zinc-900 p-6">
              {/* Body */}
              <div className="text-center flex flex-col items-center space-y-4">
                <IconAlertCircle className="w-16 h-16 text-red-500" />
                <h2 className="text-xl font-bold text-gray-100">
                  Welcome to the Account Menu
                </h2>
                <p className="text-sm text-gray-300 px-4">
                  Here you can manage your account settings and preferences.For the sake of this Hackathon demo,
                  there won't be no extensive menu or login logout functionality.
                </p>
              </div>

              {/* Footer */}
              <div className="mt-6 flex flex-col sm:flex-row justify-center gap-3">
                <button
                  onClick={onClose}
                  className="w-full sm:w-auto mb-2 sm:mb-0 bg-zinc-800 px-5 py-2 text-sm font-medium text-gray-200 rounded-full shadow-sm hover:shadow-lg hover:bg-zinc-700 transition"
                >
                  Cancel
                </button>
                <button
                  className="w-full sm:w-auto mb-2 sm:mb-0 bg-red-500 border border-red-500 px-5 py-2 text-sm font-medium text-white rounded-full shadow-sm hover:shadow-lg hover:bg-red-600 transition"
                >
                    Log Out
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
