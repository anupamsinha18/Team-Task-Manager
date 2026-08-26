import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/common/Button';
import { Home, AlertCircle } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center bg-body-bg">
      <div className="p-4 rounded-full bg-danger-light text-danger mb-4">
        <AlertCircle size={48} />
      </div>
      <h1 className="text-4xl font-extrabold text-main mb-2">404 - Page Not Found</h1>
      <p className="text-muted text-sm max-w-md mb-6">
        The requested route or dashboard page does not exist or has been moved.
      </p>
      <Button icon={<Home size={18} />} onClick={() => navigate('/dashboard')}>
        Back to Dashboard
      </Button>
    </div>
  );
};
