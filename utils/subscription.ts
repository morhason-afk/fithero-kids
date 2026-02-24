/**
 * Subscription gate.
 * - Challenges: first 4 free, 5th onward require subscription
 * - Hero customization: first 5 in each category (skin, outfit, accessory) free or diamonds, rest subscription
 * - Face customization: first 5 in each category (eyes, mouth, accessory, background) free or diamonds, rest subscription
 */

export const FREE_CHALLENGES_COUNT = 4
export const FREE_HEROES_COUNT = 5
export const FREE_FACE_OPTIONS_PER_CATEGORY = 5

export function challengeRequiresSubscription(challengeIndex: number): boolean {
  return challengeIndex >= FREE_CHALLENGES_COUNT
}

export function heroRequiresSubscription(optionIndex: number): boolean {
  return optionIndex >= FREE_HEROES_COUNT
}

export function faceOptionRequiresSubscription(optionIndexInCategory: number): boolean {
  return optionIndexInCategory >= FREE_FACE_OPTIONS_PER_CATEGORY
}
