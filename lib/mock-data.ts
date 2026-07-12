export type ChannelStatus = "online" | "offline"

export interface Channel {
  id: string
  name: string
  game: string
  viewers: number
  status: ChannelStatus
  idle: boolean // currently being auto-watched
  watchedMinutes: number
  favorite: boolean
  language: string
  /** Tailwind gradient classes used for the avatar fallback */
  avatarFrom: string
  avatarTo: string
}

export const channels: Channel[] = [
  {
    id: "shroud",
    name: "shroud",
    game: "VALORANT",
    viewers: 12400,
    status: "online",
    idle: true,
    watchedMinutes: 45,
    favorite: true,
    language: "English",
    avatarFrom: "from-rose-500",
    avatarTo: "to-orange-500",
  },
  {
    id: "xqc",
    name: "xQc",
    game: "Just Chatting",
    viewers: 8200,
    status: "online",
    idle: true,
    watchedMinutes: 72,
    favorite: true,
    language: "English",
    avatarFrom: "from-emerald-500",
    avatarTo: "to-teal-500",
  },
  {
    id: "pokimane",
    name: "Pokimane",
    game: "Fortnite",
    viewers: 5100,
    status: "online",
    idle: true,
    watchedMinutes: 28,
    favorite: true,
    language: "English",
    avatarFrom: "from-fuchsia-500",
    avatarTo: "to-pink-500",
  },
  {
    id: "summit1g",
    name: "summit1g",
    game: "GTA V",
    viewers: 0,
    status: "offline",
    idle: false,
    watchedMinutes: 0,
    favorite: false,
    language: "English",
    avatarFrom: "from-sky-500",
    avatarTo: "to-blue-600",
  },
  {
    id: "ninja",
    name: "Ninja",
    game: "Fortnite",
    viewers: 3300,
    status: "online",
    idle: false,
    watchedMinutes: 0,
    favorite: false,
    language: "English",
    avatarFrom: "from-indigo-500",
    avatarTo: "to-violet-600",
  },
  {
    id: "amouranth",
    name: "Amouranth",
    game: "Just Chatting",
    viewers: 2100,
    status: "online",
    idle: false,
    watchedMinutes: 0,
    favorite: false,
    language: "English",
    avatarFrom: "from-amber-500",
    avatarTo: "to-yellow-500",
  },
  {
    id: "tarik",
    name: "tarik",
    game: "VALORANT",
    viewers: 0,
    status: "offline",
    idle: false,
    watchedMinutes: 0,
    favorite: true,
    language: "English",
    avatarFrom: "from-red-500",
    avatarTo: "to-rose-600",
  },
  {
    id: "lirik",
    name: "LIRIK",
    game: "Variety",
    viewers: 1500,
    status: "online",
    idle: false,
    watchedMinutes: 0,
    favorite: false,
    language: "English",
    avatarFrom: "from-cyan-500",
    avatarTo: "to-teal-600",
  },
]

export interface ClaimRecord {
  id: string
  time: string
  channel: string
  points: number
}

export const claimHistory: ClaimRecord[] = [
  { id: "c1", time: "15:32", channel: "shroud", points: 50 },
  { id: "c2", time: "15:20", channel: "xQc", points: 50 },
  { id: "c3", time: "14:55", channel: "Pokimane", points: 50 },
  { id: "c4", time: "14:30", channel: "shroud", points: 250 },
  { id: "c5", time: "14:05", channel: "xQc", points: 50 },
  { id: "c6", time: "13:40", channel: "Pokimane", points: 50 },
  { id: "c7", time: "13:15", channel: "shroud", points: 50 },
]

export const todayStats = {
  pointsEarned: 1247,
  channelsIdle: 3,
  hoursIdle: 2.5,
  dailyGoal: 2000,
  adsBlocked: 3,
}

export const dashboardStats = {
  weeklyHours: 12.5,
  weeklyChange: 23,
  monthlyPoints: 8234,
  monthlyGoalPercent: 80,
}

export type PriorityMode = "balanced" | "spread" | "focused"

export function formatViewers(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`
  return `${n}`
}

export function formatWatched(minutes: number): string {
  if (minutes >= 60) return `${(minutes / 60).toFixed(1)}h`
  return `${minutes}min`
}
