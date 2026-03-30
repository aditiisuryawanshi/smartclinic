import { useState, forwardRef, useImperativeHandle } from 'react';

const ToastManager = forwardRef((props, ref) => {
  const [toasts, setToasts] = useState([]);

  useImperativeHandle(ref, () => ({
    show(title, body, cls = '') {
      const id = Date.now();
      setToasts(t => [...t, { id, title, body, cls }]);
      setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 4500);
    }
  }));

  return (
    <div className="toast-stack">
      {toasts.map(t => (
        <div key={t.id} className={`toast ${t.cls}`}>
          <div className="toast-icon">
            {t.cls === 'wa-toast' ? '💬' : t.cls === 'alert-toast' ? '⚠️' : '🔔'}
          </div>
          <div>
            <div className="toast-title">{t.title}</div>
            <div className="toast-body">{t.body}</div>
          </div>
        </div>
      ))}
    </div>
  );
});

ToastManager.displayName = 'ToastManager';
export default ToastManager;