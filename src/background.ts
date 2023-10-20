import { background_handleTab } from './listeners/background/background_handleTab'
import { IssuesState } from './listeners/background/handleGithubIssuePage'
import { bgHandleCommand } from './listeners/shortcutCommands/bgHandleCommand'
import { background_getCurrentTab } from './utils/background_getCurrentTab'
import { setSync } from './utils/chromeStoragePromises'
import { syncKeys } from './utils/syncKeys'

function polling() {
  setTimeout(polling, 1000 * 30)
}

polling()

setSync(syncKeys.issues, {
  currentVoteCountIndex: 0,
  voteCounts: [],
  prevIssuesUrl: '',
  started: false,
} as IssuesState)

chrome.tabs.onActivated.addListener(async (activeInfo) => {
  chrome.tabs.get(activeInfo.tabId, (tab) => {
    background_handleTab(tab)
  })
})

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  background_handleTab(tab, {
    type: 'open',
  })
})

// listen to focused windows tab
chrome.windows.onFocusChanged.addListener(async (windowId) => {
  if (windowId === chrome.windows.WINDOW_ID_NONE) {
    // No window is focused. All Chrome windows are blurred.
    return
  }
  const tab = await background_getCurrentTab()
  background_handleTab(tab)
})

chrome.commands.onCommand.addListener(function (command, tab) {
  bgHandleCommand(command, tab)
})
