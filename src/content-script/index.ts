// 创建一个style元素并添加到<head>中
// const styleElement = document.createElement('style')
// styleElement.type = 'text/css'
// styleElement.innerHTML = `
//   * {
//     white-space: pre-wrap;
//     overflow-wrap: break-word;
//   }
// `
// document.head.appendChild(styleElement)
export {}
setTimeout(() => {
  ;(function () {
    //用来保存未修改的元素的状态 9.7
    interface OriginalState {
      element: HTMLElement
      className: string
      style: string
    }

    let originalStates: OriginalState[] = []
    // 检查页面是否包含ID为'prompt-textarea'的<textarea>元素
    const promptTextarea = document.getElementById('prompt-textarea')
    if (!promptTextarea) {
      return // 如果不存在，则不执行后续操作
    }

    //Modify others
    const AUTO_CLASS = ['mx-auto', 'm-auto', 'my-auto', 'ml-auto', 'mr-auto']
    const MAX_CLASS = [
      'max-w-3xl',
      'max-w-[40rem]',
      'max-w-[48rem]',
      'lg:max-w-[40rem]',
      'xl:max-w-[48rem]',
      'lg:w-[calc(100%-115px)]',
    ]
    const BREAK_CLASS = ['break-all', 'break-words']
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

    function sharedLogic(node: any) {
      if (node.nodeType === 1) {
        // 1 是 Element 类型
        // console.log('已添加node.tagName', node.tagName)
        // 对所有子节点进行操作
        const childElements = node.querySelectorAll(
          '[class*="auto"], [class*="max"]' //, p, pre
        )
        // if (childElements) console.log('已找到childElements', childElements)
        modifyClass(childElements)
      }
    }

    function modifyClass(childElements: any) {
      childElements.forEach((childElement) => {
        if (
          !(childElement instanceof SVGElement) &&
          !checkForImg(childElement)
        ) {
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

          if (childElement.className.includes('max')) {
            removeClasses(childElement, MAX_CLASS)
          }

          // if (childElement.className.includes('break')) {
          //   removeClasses(childElement, BREAK_CLASS)
          // }

          removeSimilarClasses(
            childElement,
            // /^(xs|sm|md|lg|xl):max-w-\[.*\]$|^(xs|sm|md|lg|xl):max-w-\w+/
            /max/i
          )

          if (childElement.tagName === 'P' || childElement.tagName === 'PRE') {
            childElement.style.width = '100%' // 占满最大可用宽度
            childElement.style.overflowWrap = 'break-word'
          }
        }
      })
    }

    let attributeChange = false
    let attributeChangeTimeout

    // 创建一个Mutation Observer实例
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        // 检查变更是否来自于 id 为 "prompt-textarea" 的元素
        if (
          mutation.target.id !== 'prompt-textarea' &&
          typeof mutation.target.className === 'string' &&
          !mutation.target.className.includes('bg-token-text-primary')
        ) {
          // console.log('已添加mutation.type', mutation.type)
          if (mutation.type === 'childList') {
            // console.log('已添加mutation.addedNodes', mutation.addedNodes)
            //mutation.addedNodes有多个
            mutation.addedNodes.forEach((node) => {
              sharedLogic(node)
            })
          } else if (mutation.type === 'attributes') {
            //&& !attributeChange
            // 断开观察??????
            // observer.disconnect()
            //mutation.target只有一个
            // sharedLogic(mutation.target)
            // 清除之前的计时器
            clearTimeout(attributeChangeTimeout)

            // 设置新的计时器
            attributeChangeTimeout = setTimeout(() => {
              manualModification()
            }, 100) // 100 毫秒延迟
            // console.log('已触发attibutes的监视,mutation.target为', mutation.target)
            attributeChange = true
            // 重新开始观察
            // observer.observe(document.body, config)
            // console.log('已触发attibutes的监视：', mutation.target)
          }
        }
      })
    })

    // 配置观察选项
    const config = { attributes: true, childList: true, subtree: true }

    // 从 chrome.storage 获取初始状态
    chrome.storage.local.get(['isObserving'], (result) => {
      if (result.isObserving) {
        // 开始观察整个文档
        console.log('开始观察整个文档，这是插件启动时应该触发的')
        observer.observe(document.body, config)
      }
    })

    // 监听来自 background.js 的消息
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
      if (message.action === 'toggleFullScreen') {
        chrome.storage.local.get(['isObserving'], (result) => {
          let isObserving = result.isObserving || false
          if (isObserving) {
            undoModification()
            observer.disconnect()
          } else {
            manualModification()
            observer.observe(document.body, config)
          }
          // 更新并保存状态
          isObserving = !isObserving
          chrome.storage.local.set({ isObserving })
          // 刷新当前网页
          // window.location.reload()
        })
      }
    })

    // chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    //   if (message.action === 'manualModification') {
    //     manualModification()
    //   }
    // })

    // chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    //   if (message.action === 'undoModification') {
    //     undoModification()
    //   }
    // })

    function manualModification() {
      const childElements = document.querySelectorAll(
        '[class*="auto"], [class*="max"], p, pre'
      )
      modifyClass(childElements)
      console.log('manualModification')
    }

    function undoModification() {
      originalStates.forEach((state) => {
        state.element.className = state.className
        state.element.style.cssText = state.style
      })
      // 清空原始状态数组，以便于下次使用
      originalStates = []
      console.log('undoModification')
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
  })()
}, 1000) // 延迟 执行
