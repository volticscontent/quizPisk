import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAnalytics } from '../hooks/useAnalytics';

interface RedirectStepProps {
  step: string;
  redirectUrl: string;
}

export function RedirectStep({ step, redirectUrl }: RedirectStepProps) {
  const router = useRouter();
  const { sendEvent } = useAnalytics();
    
  useEffect(() => {
    sendEvent('Lead', {
      step: step,
      redirect_url: redirectUrl,
      environment: 'production',
      session_id: sessionId,
      email: email,
      phone: phone
    });
  }, [step, redirectUrl, sendEvent]);
        
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="text-center">
        <h1 className="text-2xl font-bold">Redirecionando...</h1>
      </div>
    </div>
  );
}   
