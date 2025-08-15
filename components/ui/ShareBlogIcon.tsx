'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';

export default function ShareBlogIcon() {
  const [showToast, setShowToast] = useState(false);
  const [toastMsg, setToastMsg] = useState('');
  const hideTimerRef = useRef<number | null>(null);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (hideTimerRef.current) {
        window.clearTimeout(hideTimerRef.current);
      }
    };
  }, []);

  const show = useCallback((msg: string) => {
    setToastMsg(msg);
    setShowToast(true);
    if (hideTimerRef.current) {
      window.clearTimeout(hideTimerRef.current);
    }
    hideTimerRef.current = window.setTimeout(() => {
      setShowToast(false);
    }, 1500); // show for 1.5s
  }, []);

  const copy = useCallback(async () => {
    if (typeof window === 'undefined') return; // SSR guard
    const fullUrl = window.location.href;

    try {
      await navigator.clipboard.writeText(fullUrl);
      show('Link copied');
    } catch {
      // Fallback if clipboard API is blocked
      try {
        const textarea = document.createElement('textarea');
        textarea.value = fullUrl;
        textarea.setAttribute('readonly', '');
        textarea.style.position = 'fixed';
        textarea.style.top = '0';
        textarea.style.left = '0';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        show('Link copied');
      } catch {
        show('Failed to copy');
      }
    }
  }, [show]);

  return (
    <>
      <button
        onClick={copy}
        className="hover:text-gray-600 transition-colors"
        aria-label="Copy link"
      >
        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"
          />
        </svg>
      </button>

      {/* Lightweight toast */}
      <div
        className={`fixed bottom-6 left-1/2 -translate-x-1/2 transform transition-all duration-200 
          ${showToast ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 pointer-events-none'}
        `}
        role="status"
        aria-live="polite"
      >
        <div className="flex items-center gap-2 rounded-md bg-gray-900 text-white px-3 py-2 shadow-lg ring-1 ring-black/5">
          <svg className="h-4 w-4 text-green-400" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
          <span className="text-sm">{toastMsg}</span>
        </div>
      </div>
    </>
  );
}
