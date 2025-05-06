import React from 'react';
import { useAuth } from './authContext';
import { logActivity } from './activityLogger';

// Higher-order component to wrap forms and other interactive components to log activities
export const withActivityLog = <P extends object>(
  Component: React.ComponentType<P>,
  entityType: string
) => {
  const WithActivityLog: React.FC<P> = (props) => {
    const { currentUser } = useAuth();

    const logUserActivity = async (action: string, details: string, entityId?: string) => {
      if (!currentUser) return;
      
      await logActivity({
        userId: currentUser.uid,
        action,
        details,
        entityId,
        entityType
      });
    };

    return <Component {...props} logActivity={logUserActivity} />;
  };

  return WithActivityLog;
};