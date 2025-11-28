import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { submitContact } from '../api/api';
import { useNotification } from './NotificationProvider';

const ContactModal = ({ onClose }) => {
  const { t } = useTranslation();
  const { showError, showSuccess } = useNotification();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!name || !email || !message) {
      showError(t('common.error'));
      return;
    }

    if (message.length < 10) {
      showError(t('contact.error'));
      return;
    }

    setLoading(true);
    try {
      const response = await submitContact({ name, email, message });
      showSuccess(response.data.message || t('contact.success'));
      onClose();
    } catch (error) {
      console.error('Failed to submit contact form:', error);
      const errorMessage = error.response?.data?.details || t('contact.error');
      showError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-green-950 bg-opacity-80 flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-green-900 to-emerald-900 border border-green-600 rounded-xl p-6 sm:p-8 max-w-md w-full">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl sm:text-2xl font-bold">{t('contact.title')}</h3>
          <button onClick={onClose} className="text-green-300 hover:text-white text-xl sm:text-2xl">×</button>
        </div>
        <p className="text-green-200 mb-6 text-sm">{t('contact.subtitle')}</p>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-2 text-green-300">{t('contact.name')}</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t('contact.name')}
              className="w-full bg-green-900 bg-opacity-40 border border-green-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-green-400 text-sm sm:text-base"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2 text-green-300">{t('contact.email')}</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="w-full bg-green-900 bg-opacity-40 border border-green-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-green-400 text-sm sm:text-base"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2 text-green-300">{t('contact.message')}</label>
            <textarea
              rows="4"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={t('contact.message')}
              className="w-full bg-green-900 bg-opacity-40 border border-green-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-green-400 text-sm sm:text-base"
            ></textarea>
          </div>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold py-3 rounded-lg transition flex items-center justify-center gap-2 text-sm sm:text-base"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                {t('contact.sending')}
              </>
            ) : (
              t('contact.send')
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ContactModal;
