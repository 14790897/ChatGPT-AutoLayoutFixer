// 创建一个style元素并添加到<head>中
const styleElement = document.createElement('style')
styleElement.type = 'text/css'
styleElement.innerHTML = `
  * {
    white-space: pre-wrap;
    overflow-wrap: break-word;
  }
`
document.head.appendChild(styleElement)

//Modify others
// const WIDTH_CLASSES = ['w-[calc(100%-50px)]', 'lg:w-[calc(100%-115px)]']
const AUTO_CLASS = ['mx-auto', 'm-auto', 'my-auto', 'ml-auto', 'mr-auto']

// 定义一个函数来移除特定类名
const removeClasses = (element, classesToRemove) => {
  classesToRemove.forEach((cls) => {
    if (element.classList.contains(cls)) {
      element.classList.remove(cls)
    }
  })
  // const classes = element.className.split(' ')
  // const filteredClasses = classes.filter((cls) => !cls.includes('auto'))
  // element.className = filteredClasses.join(' ')
}

// 创建一个Mutation Observer实例
const observer = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    if (mutation.type === 'childList') {
      mutation.addedNodes.forEach((node) => {
        if (node.nodeType === 1) {
          // 1 是 Element 类型
          // 移除 'auto' 边距类名
          if (node.className && node.className.includes('auto')) {
            removeClasses(node, AUTO_CLASS)
          }

          // // 移除特定宽度类名
          // if (
          //   node.className &&
          //   (node.className.includes('w-[calc') ||
          //     node.className.includes('lg:w-[calc'))
          // ) {
          //   removeClasses(node, [
          //     'w-[calc(100%-50px)]',
          //     'lg:w-[calc(100%-115px)]',
          //   ])
          // }

          // 如果新添加的节点有子节点，也对子节点进行相同的操作
          const childElementsForClasses =
            node.querySelectorAll('[class*="auto"]')
          childElementsForClasses.forEach((childElement) =>
            removeClasses(childElement, [...AUTO_CLASS])
          )

          // 设置新添加的 <p> 和 <pre> 标签的宽度
          if (node.tagName === 'P' || node.tagName === 'PRE') {
            node.style.width = '100%' // 占满最大可用宽度
            node.style.overflowWrap = 'break-word'
          }

          const childElementsForWidth = node.querySelectorAll('p, pre')
          childElementsForWidth.forEach((childElement) => {
            childElement.style.width = '100%' // 占满最大可用宽度
            childElement.style.overflowWrap = 'break-word'
          })

          if (node.className && node.className.includes('md:max-w-3xl')) {
            node.classList.remove('md:max-w-3xl')
          }
          // 如果新添加的节点有子节点，也对子节点进行相同的操作
          const childElementsForMaxWidth =
            node.querySelectorAll('.md\\:max-w-3xl')
          childElementsForMaxWidth.forEach((childElement) => {
            childElement.classList.remove('md:max-w-3xl')
          })
        }
      })
    }
  })
})

// 配置观察选项
const config = { attributes: false, childList: true, subtree: true }


// const sidebarElement = document.querySelector('span[data-state="closed"]')
// observer.observe(sidebarElement, { attributes: true, subtree: true })

// 从 chrome.storage 获取初始状态
chrome.storage.local.get(['isObserving'], (result) => {
  if (result.isObserving) {
    // 开始观察整个文档
    observer.observe(document.body, config)
  }
});

// 监听来自 background.js 的消息
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "toggleFullScreen") {
    chrome.storage.local.get(['isObserving'], (result) => {
      let isObserving = result.isObserving || false
      if (isObserving) {
        observer.disconnect()
      } else {
        observer.observe(document.body, config)
      }
      // 更新并保存状态
      isObserving = !isObserving
      chrome.storage.local.set({ isObserving })
      // 刷新当前网页
      window.location.reload()
    });
  }
});
