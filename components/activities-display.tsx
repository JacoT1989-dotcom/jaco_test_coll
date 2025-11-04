'use client';

import { useQuery } from '@apollo/client/react';
import { GET_ACTIVITIES } from '@/lib/queries';

interface ActivitiesDisplayProps {
  latitude: number;
  longitude: number;
}

interface Activity {
  name: string;
  score: number;
  reason: string;
}

interface GetActivitiesData {
  getActivities: Activity[];
}

export function ActivitiesDisplay({ latitude, longitude }: ActivitiesDisplayProps) {
  const { data, loading, error } = useQuery<GetActivitiesData>(GET_ACTIVITIES, {
    variables: { latitude, longitude },
  });

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">Activity Rankings</h3>
        <div className="space-y-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 dark:bg-red-900 rounded-lg shadow-lg p-6">
        <p className="text-red-700 dark:text-red-100">Error loading activities</p>
      </div>
    );
  }

  const activities = data?.getActivities;

  if (!activities) {
    return null;
  }

  const getScoreColor = (score: number) => {
    if (score >= 70) return 'bg-green-500';
    if (score >= 40) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">Activity Rankings</h3>
      <div className="space-y-4">
        {activities.map((activity, index) => (
          <div
            key={index}
            className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4"
          >
            <div className="flex justify-between items-center mb-2">
              <h4 className="font-semibold text-gray-900 dark:text-gray-100">
                {activity.name}
              </h4>
              <span className="text-lg font-bold text-gray-900 dark:text-gray-100">
                {activity.score}
              </span>
            </div>

            <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2.5 mb-2 overflow-hidden">
              <div
                className={`h-2.5 rounded-full transition-all ${getScoreColor(activity.score)}`}
                style={{ width: `${activity.score}%` }}
              ></div>
            </div>

            <p className="text-sm text-gray-600 dark:text-gray-400">
              {activity.reason}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
