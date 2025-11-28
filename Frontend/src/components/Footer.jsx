import React from 'react';
import { useTranslation } from 'react-i18next';
import { MessageSquare } from 'lucide-react';

const Footer = ({ onContactClick }) => {
  const { t } = useTranslation();

  return (
    <footer className="relative z-10 bg-green-950 bg-opacity-70 backdrop-blur-sm border-t border-green-700 py-6 mt-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-center sm:text-left">
          <p className="text-green-300 text-sm mb-2">{t('footer.aboutDesc')}</p>
          <p className="text-green-400 text-xs">{t('footer.copyright')}</p>
        </div>
        <button
          onClick={onContactClick}
          className="flex items-center gap-2 bg-green-600 hover:bg-green-700 px-4 sm:px-6 py-2 rounded-lg transition font-semibold text-sm sm:text-base"
        >
          <MessageSquare className="w-4 h-4" />
          {t('footer.contact')}
        </button>
      </div>
    </footer>
  );
};

export default Footer;
