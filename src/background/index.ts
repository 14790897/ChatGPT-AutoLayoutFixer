chrome.commands.onCommand.addListener(async (command) => {
  if (command === 'toggleFullScreen') {
    //发送一个消息到内容脚本，告诉它开始或停止 Mutation Observer
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const activeTab = tabs[0]
      if (activeTab.id && activeTab.url) {
        // 使用正则表达式检查 URL 是否匹配
        const regex = /^https?:\/\/chat\.openai\.com\/.*$/
        if (regex.test(activeTab.url)) {
          // 如果 URL 匹配，则执行相应的操作
          chrome.tabs.sendMessage(activeTab.id, { action: 'toggleFullScreen' })
        } else {
          // 如果 URL 不匹配，可以执行其他操作或不执行任何操作
          console.log('URL does not match.')
        }
      }
    })

    // chrome.tabs.query({ url: '*://chat.openai.com/*' }, (tabs) => {
    //   tabs.forEach((tab) => {
    //     if (tab.id) {
    //       chrome.tabs.reload(tab.id)
    //     }
    //   })
    // })
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

chrome.commands.onCommand.addListener(function (command) {
  if (command === 'manualModification') {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      const activeTab = tabs[0]
      if (activeTab.id && activeTab.url) {
        chrome.tabs.sendMessage(activeTab.id, { action: 'manualModification' })
      }
    })
  }
})

chrome.commands.onCommand.addListener(function (command) {
  if (command === 'undoModification') {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      const activeTab = tabs[0]
      if (activeTab.id && activeTab.url) {
        chrome.tabs.sendMessage(activeTab.id, { action: 'undoModification' })
      }
    })
  }
})

