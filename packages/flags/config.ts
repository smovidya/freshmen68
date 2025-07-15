export const features= {
  "login": true,
  "registering": {
    start: "2025-07-19T12:00:00+07:00",
    end: "2025-07-21T23:59:59+07:00",
  },
  "team-joining": {
    start: "2025-07-19T12:00:00+07:00",
    end: "2025-07-21T23:59:59+07:00",
  },
  "group-choosing": {
    start: "2025-07-19T12:00:00+07:00",
    end: "2025-07-21T23:59:59+07:00",
  },
  "group-announcement": {
    scheduled: "2025-07-22T12:00:00+07:00",
  },
  "game-start": {
    scheduled: "2025-07-26T12:00:00+07:00",
  },
  "game-playing": {
    isEnabled() {
      // allow between 12:00 to 17:00 on 2026-07-26 to 2025-07-29
      const now = new Date();
      const hours = now.getHours();
      const start = new Date("2025-07-26T12:00:00+07:00");
      const end = new Date("2025-07-29T17:00:00+07:00");
      return now >= start && now <= end && hours >= 12 && hours <= 17
    },
  }
} satisfies Record<string, EventAvailability>;

/**
 * Represents a date-time string in ISO 8601 format with Thailand timezone (+07:00).
 * Example: "2025-07-19T12:00:00+07:00"
 */
type FestivalDateTime = `${string}-${string}-${string}T${string}:${string}:${string}+07:00`;

/**
 * Represents an event/activity that runs during a specific time window.
 * Both registration periods and activity sessions use this pattern.
 */
type EventTimeWindow = {
  /**
   * When the event/activity opens or becomes available.
   * Example: "2025-07-19T12:00:00+07:00"
   */
  start: FestivalDateTime;
  /**
   * When the event/activity closes or ends.
   * Example: "2025-07-21T23:59:59+07:00"
   */
  end: FestivalDateTime;
}

/**
 * Represents an event/activity that is scheduled for the future.
 * Used for announcements, planned activities, or upcoming features.
 */
type ScheduledEvent = {
  /**
   * The scheduled date and time when the event will occur.
   * Example: "2025-07-22T12:00:00+07:00"
   */
  scheduled: FestivalDateTime;
}

/**
 * Represents an event/activity with a deadline.
 * Used for submissions, registrations, or time-sensitive actions.
 */
type EventWithDeadline = {
  /**
   * The deadline until which the event/activity remains available.
   * Example: "2025-07-21T23:59:59+07:00"
   */
  deadline: FestivalDateTime;
}

/**
 * Represents an event/activity that is always available or permanently disabled.
 * Used for features that don't depend on time constraints.
 */
type AlwaysAvailable = boolean;

/**
 * Custom switch type for event availability.
 */
type CustomSwitch = {
  isEnabled: () => boolean;
}

/**
 * Union type representing all possible states of a festival event or activity.
 */
type EventAvailability = EventTimeWindow | ScheduledEvent | AlwaysAvailable | EventWithDeadline | CustomSwitch;
