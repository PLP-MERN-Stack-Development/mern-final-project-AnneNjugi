import React, { useState } from 'react';
import { submitContact } from '../api/api';
import { useNotification } from './NotificationProvider';

const ContactModal = ({ onClose }) => {
  const { showError, showSuccess } = useNotification();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!name || !email || !message) {
      showError('Please fill in all fields');
      return;
    }

    if (message.length < 10) {
      showError('Please provide a message with at least 10 characters');
      return;
    }

    setLoading(true);
    try {
      const response = await submitContact({ name, email, message });
      showSuccess(response.data.message || 'Thank you for reaching out! We will get back to you soon.');
      onClose();
    } catch (error) {
      console.error('Failed to submit contact form:', error);
      const errorMessage = error.response?.data?.details || 'Failed to send message. Please try again.';
      showError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-green-950 bg-opacity-80 flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-green-900 to-emerald-900 border border-green-600 rounded-xl p-8 max-w-md w-full">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold">Contact Us</h3>
          <button onClick={onClose} className="text-green-300 hover:text-white text-2xl">×</button>
        </div>
        <p className="text-green-200 mb-6 text-sm">Have questions or feedback? We'd love to hear from you!</p>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-2 text-green-300">Your Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              className="w-full bg-green-900 bg-opacity-40 border border-green-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-green-400"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2 text-green-300">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="w-full bg-green-900 bg-opacity-40 border border-green-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-green-400"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2 text-green-300">Message</label>
            <textarea
              rows="4"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Tell us what's on your mind..."
              className="w-full bg-green-900 bg-opacity-40 border border-green-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-green-400"
            ></textarea>
          </div>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold py-3 rounded-lg transition flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Sending...
              </>
            ) : (
              'Send Message'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ContactModal;
