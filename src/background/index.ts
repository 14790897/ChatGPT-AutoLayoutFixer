chrome.commands.onCommand.addListener(async (command) => {
  if (command === 'toggleFullScreen') {
    //发送一个消息到内容脚本，告诉它开始或停止 Mutation Observer
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const activeTab = tabs[0]
      if (activeTab.id) {
        chrome.tabs.sendMessage(activeTab.id, { action: 'toggleFullScreen' })
      }
    })
  }
})

chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    // 扩展被安装时，设置 isObserving 为 true
    chrome.storage.local.set({ isObserving: true }, () => {
      console.log('isObserving has been set to true')
    })
    }
     chrome.tabs.query({ url: '*://chat.openai.com/*' }, (tabs) => {
       tabs.forEach((tab) => {
         if (tab.id) {
           chrome.tabs.reload(tab.id)
         }
       })
     })
})

