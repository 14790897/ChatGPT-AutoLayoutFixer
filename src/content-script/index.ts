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

//用来保存未修改的元素的状态 9.7
interface OriginalState {
  element: HTMLElement
  className: string
  style: string
}

let originalStates: OriginalState[] = []

//Modify others
const AUTO_CLASS = ['mx-auto', 'm-auto', 'my-auto', 'ml-auto', 'mr-auto']

// 定义一个函数来移除特定类名
const removeClasses = (element, classesToRemove) => {
  classesToRemove.forEach((cls) => {
    if (element.classList.contains(cls)) {
      element.classList.remove(cls)
    }
  })
}

function removeSimilarClasses(element, pattern) {
  const classes = Array.from(element.classList)
  classes.forEach((cls) => {
    if (pattern.test(cls)) {
      element.classList.remove(cls)
    }
  })
}

// 创建一个Mutation Observer实例
const observer = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    // console.log('已添加mutation.type', mutation.type)
    if (mutation.type === 'childList') {
      // console.log('已添加mutation.addedNodes', mutation.addedNodes)
      mutation.addedNodes.forEach((node) => {
        // console.log('已添加node.nodeType', node.nodeType)
        if (node.nodeType === 1) {
          // 1 是 Element 类型
          console.log('已添加node.tagName', node.tagName)

          // 如果新添加的节点有子节点，也对子节点进行相同的操作
          const childElements = node.querySelectorAll(
            '[class*="auto"], [class*="max"], p, pre'
          )
          modifyClass(childElements)

        }
      })
    }
  })
})

// 配置观察选项
const config = { attributes: false, childList: true, subtree: true }


// 从 chrome.storage 获取初始状态
chrome.storage.local.get(['isObserving'], (result) => {
  if (result.isObserving) {
    // 开始观察整个文档
    observer.observe(document.body, config)
  }
})

// 监听来自 background.js 的消息
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'toggleFullScreen') {
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
    })
  }
})

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'manualModification') {
    manualModification()
  }
})

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'undoModification') {
    undoModification()
  }
})

function manualModification() {
  const childElements = document.querySelectorAll(
    '[class*="auto"], [class*="max"], p, pre'
  );
  modifyClass(childElements)
}

function undoModification() {
  originalStates.forEach((state) => {
    state.element.className = state.className
    state.element.style.cssText = state.style
  })
  // 清空原始状态数组，以便于下次使用
  originalStates = []
}

function modifyClass(childElements: any) {
  childElements.forEach((childElement) => {
    if (!checkForImg(childElement)) {
      // 保存原始状态
      originalStates.push({
        element: childElement,
        className: childElement.className,
        style: childElement.style.cssText,
      })

      // 根据元素的类名或标签名进行相应的操作
      if (childElement.className.includes('auto')) {
        removeClasses(childElement, AUTO_CLASS)
      }

      // if (childElement.className.includes('md:max-w-3xl')) {
      //   childElement.classList.remove('md:max-w-3xl')
      // }
      removeSimilarClasses(
        childElement,
        /^(xs|sm|md|lg|xl):max-w-\[.*\]$|^(xs|sm|md|lg|xl):max-w-\w+/
      )

      if (childElement.tagName === 'P' || childElement.tagName === 'PRE') {
        childElement.style.width = '100%' // 占满最大可用宽度
        childElement.style.overflowWrap = 'break-word'
      }
    }
  })
}

function checkForImg(element, depth = 0) {
  if (depth >= 10) return false

  const imgElement = element.querySelector('img[alt="User"]')
  if (imgElement) return true

  for (const child of element.children) {
    if (checkForImg(child, depth + 1)) return true
  }

  return false
}
