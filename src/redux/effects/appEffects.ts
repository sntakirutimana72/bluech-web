import { createSelector } from "@reduxjs/toolkit"
import { inboxSelector } from './inboxEffects'
import { peopleSelector } from './peopleEffects'

export const statusesSelector = createSelector(
  [peopleSelector, inboxSelector],
  (people, inbox) => ({
    peopleStatus: people.status,
    inboxStatus: inbox.status,
  })
)
