import { handleGithubIssuePage } from './handleGithubIssuePage'

export const background_handleTab = async (
  tab: chrome.tabs.Tab,
  options?: {
    type: 'open'
  }
) => {
  if (!tab.url || !tab.id) return
  if (tab.url.includes('github.com') && tab.url.includes('/issues/')) {
    handleGithubIssuePage(tab)
  }
}
