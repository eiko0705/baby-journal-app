export interface Age {
    years: number
    months: number
    days: number
}

export interface Achievement {
    id: string
    date: string
    title: string
    description: string
    ageAtEvent: Age | null
    tags: string[]
    photo?: string
}

export type NewAchievementPayload = Omit<Achievement, 'id'>

export interface ChildProfile {
    id: string
    nickname: string
    gender: string
    birthday: string
    createdAt: string
    updatedAt: string
}


