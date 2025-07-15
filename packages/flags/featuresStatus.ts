import { features } from './config';

export function isEnabled(feature: keyof typeof features): boolean {
  const now = new Date();
  const featureStatus = features[feature];

  if (!featureStatus) {
    return false; // Feature not found
  }

  if (typeof featureStatus === 'boolean') {
    return featureStatus; // Feature is simply enabled or disabled
  }

  if ('isEnabled' in featureStatus) {
    return featureStatus.isEnabled();
  }

  if ('start' in featureStatus && 'end' in featureStatus) {
    const start = new Date(featureStatus.start);
    const end = new Date(featureStatus.end);
    return now >= start && now <= end; // Check if current time is within the start and end times
  }

  if ('scheduled' in featureStatus) {
    return false
  }

  return false;
}

export function getStartOrScheduled(feature: keyof typeof features, defaultValue: Date | null = null): Date | null {
  const featureStatus = features[feature];

  if (!featureStatus) {
    return defaultValue; // Feature not found
  }

  if (typeof featureStatus === 'boolean') {
    return defaultValue; // No start time for boolean features
  }

  if ('start' in featureStatus) {
    return new Date(featureStatus.start); // Return start time if available
  }

  if ('scheduled' in featureStatus) {
    return new Date(featureStatus.scheduled); // Return scheduled time if available
  }

  return defaultValue; // No applicable date found
}

export function getEndOrDeadline(feature: keyof typeof features, defaultValue: Date | null = null): Date | null {
  const featureStatus = features[feature];

  if (!featureStatus) {
    return defaultValue; // Feature not found
  }

  if (typeof featureStatus === 'boolean') {
    return defaultValue; // No end time for boolean features
  }

  if ('end' in featureStatus) {
    return new Date(featureStatus.end); // Return end time if available
  }

  if ('deadline' in featureStatus) {
    return new Date(featureStatus.deadline); // Return deadline time if available
  }

  return defaultValue; // No applicable date found
}
