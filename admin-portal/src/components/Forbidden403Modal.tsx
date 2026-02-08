import React, { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import './Forbidden403Modal.css';

interface Forbidden403ModalProps {
  isOpen?: boolean;
  onClose?: () => void;
  requiredRoles?: string[];
}

const Forbidden403Modal: React.FC<Forbidden403ModalProps> = ({
  isOpen: externalIsOpen = false,
  onClose: externalOnClose,
  requiredRoles: externalRequiredRoles = [],
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(externalIsOpen);
  const [requiredRoles, setRequiredRoles] = useState<string[]>(externalRequiredRoles);

  // Memoize external required roles to avoid infinite loops
  const memoizedExternalRoles = useMemo(
    () => externalRequiredRoles,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [JSON.stringify(externalRequiredRoles)]
  );

  // Listen for API 403 errors
  useEffect(() => {
    const handleApi403Error = (event: Event) => {
      const customEvent = event as CustomEvent;
      setIsOpen(true);
      if (customEvent.detail?.requiredRoles) {
        setRequiredRoles(customEvent.detail.requiredRoles);
      }
    };

    window.addEventListener('api403Error', handleApi403Error);
    return () => window.removeEventListener('api403Error', handleApi403Error);
  }, []);

  // Update local state only when external props actually change
  useEffect(() => {
    setIsOpen(externalIsOpen);
  }, [externalIsOpen]);

  useEffect(() => {
    setRequiredRoles(memoizedExternalRoles);
  }, [memoizedExternalRoles]);

  const handleClose = () => {
    setIsOpen(false);
    if (externalOnClose) {
      externalOnClose();
    }
  };

  const handleBackHome = () => {
    handleClose();
    navigate('/');
  };

  if (!isOpen) return null;

  return (
    <div className="forbidden-403-overlay">
      <div className="forbidden-403-modal">
        <div className="forbidden-403-header">
          <h1 className="forbidden-403-icon">🔒</h1>
          <h2 className="forbidden-403-title">{t('errors.forbidden')}</h2>
        </div>

        <div className="forbidden-403-content">
          <p className="forbidden-403-message">{t('errors.forbidden_403')}</p>
          <p className="forbidden-403-detail">{t('errors.forbidden_message')}</p>

          {requiredRoles && requiredRoles.length > 0 && (
            <div className="forbidden-403-roles">
              <h3 className="forbidden-403-roles-title">
                {requiredRoles.length === 1
                  ? t('errors.roleRequired')
                  : t('errors.rolesRequired')}
              </h3>
              <ul className="forbidden-403-roles-list">
                {requiredRoles.map((role) => (
                  <li key={role} className="forbidden-403-role-item">
                    <code className="forbidden-403-role-code">{role}</code>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <p className="forbidden-403-contact">{t('errors.contactAdmin')}</p>
        </div>

        <div className="forbidden-403-footer">
          <button
            className="forbidden-403-btn forbidden-403-btn-primary"
            onClick={handleBackHome}
          >
            {t('errors.backToHome')}
          </button>
          <button
            className="forbidden-403-btn forbidden-403-btn-secondary"
            onClick={handleClose}
          >
            {t('common.close') || 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Forbidden403Modal;
