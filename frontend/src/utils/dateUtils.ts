import { parseISO, differenceInYears, differenceInMonths, differenceInDays, subYears, subMonths } from 'date-fns'
import type { Age } from '../types'

/**
 * 指定された誕生日とイベント日から月齢（年、月、日）を計算します。
 * @param birthDateString 誕生日 (YYYY-MM-DD形式の文字列)
 * @param eventDateString イベント日 (YYYY-MM-DD形式の文字列)
 * @returns {Age | null} 計算された月齢オブジェクト、または日付が無効な場合はnull
 */
export const calculateAgeAtEvent = (birthDateString: string, eventDateString: string): Age | null => {
    try {
        const birthDate = parseISO(birthDateString)
        const eventDate = parseISO(eventDateString)

        if (isNaN(birthDate.getTime()) || isNaN(eventDate.getTime())) {
            console.error('Invalid date format')
            return null
        }

        if (eventDate < birthDate) {
            console.error('Event date cannot be before birth date')
            return null
        }

        const years = differenceInYears(eventDate, birthDate)
        const dateAfterYears = subYears(eventDate, years)

        const months = differenceInMonths(dateAfterYears, birthDate)
        const dateAfterMonths = subMonths(dateAfterYears, months)

        const days = differenceInDays(dateAfterMonths, birthDate)

        return { years, months, days }
        
    } catch (error) {
        console.error('Error calculating age at event:', error)
        return null
    }
}

/**
 * Ageオブジェクトを人間が読みやすい形式の文字列に変換します。
 * @param age 月齢オブジェクト (Age | null)
 * @returns {string} フォーマットされた月齢文字列、または「月齢未計算」
 */

export const formatAge = (age: Age | null): string => {
    if (!age) return 'Age not calculated'
    return `${age.years}years ${age.months}months ${age.days}days`
}
