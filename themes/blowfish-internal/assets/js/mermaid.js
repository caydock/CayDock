function css(name) {
  return "rgb(" + getComputedStyle(document.documentElement).getPropertyValue(name) + ")";
}

// 简单的缩放和拖拽功能
function addZoomAndPanToSvg(svg) {
  let scale = 1;
  let translateX = 0;
  let translateY = 0;
  let isDragging = false;
  let startX, startY, startTranslateX, startTranslateY;
  
  // 鼠标滚轮缩放
  svg.addEventListener('wheel', (e) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    scale = Math.max(0.5, Math.min(3, scale * delta));
    updateTransform();
  });
  
  // 拖拽功能
  svg.addEventListener('mousedown', (e) => {
    isDragging = true;
    startX = e.clientX;
    startY = e.clientY;
    startTranslateX = translateX;
    startTranslateY = translateY;
    svg.style.cursor = 'grabbing';
  });
  
  document.addEventListener('mousemove', (e) => {
    if (isDragging) {
      const deltaX = e.clientX - startX;
      const deltaY = e.clientY - startY;
      translateX = startTranslateX + deltaX;
      translateY = startTranslateY + deltaY;
      updateTransform();
    }
  });
  
  document.addEventListener('mouseup', () => {
    isDragging = false;
    svg.style.cursor = 'default';
  });
  
  // 更新变换
  function updateTransform() {
    svg.style.transform = `translate(${translateX}px, ${translateY}px) scale(${scale})`;
  }
  
  // 重置变换
  function resetTransform() {
    scale = 1;
    translateX = 0;
    translateY = 0;
    updateTransform();
  }
  
  // 返回重置函数，供外部调用
  return resetTransform;
}

// 增强 Mermaid 图表功能
function enhanceMermaidDiagrams() {
  const mermaidDivs = document.querySelectorAll("div.mermaid");
  
  for (const div of mermaidDivs) {
    const preElement = div.querySelector("pre");
    if (preElement) {
      div.textContent = preElement.textContent;
    }
  }
  
  // 等待 Mermaid 渲染完成
  setTimeout(() => {
    const renderedMermaidDivs = document.querySelectorAll("div.mermaid");
    
    renderedMermaidDivs.forEach(div => {
      const svg = div.querySelector('svg');
      if (svg && !div.hasAttribute('data-enhanced')) {
        div.setAttribute('data-enhanced', 'true');
        
        // 添加点击放大功能
        div.style.cursor = 'pointer';
        div.title = '点击查看大图';
        
        div.addEventListener('click', () => {
          // 检查是否已经存在模态框
          const existingModal = document.querySelector('.mermaid-modal');
          if (existingModal) {
            return; // 如果模态框已存在，不重复创建
          }
          
          // 创建模态框
          const modal = document.createElement('div');
          modal.className = 'mermaid-modal';
          modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.9);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 10000;
            cursor: pointer;
          `;
          
          const modalContent = document.createElement('div');
          modalContent.style.cssText = `
            width: 95%;
            height: 95%;
            background: white;
            border-radius: 8px;
            position: relative;
            overflow: hidden;
            display: flex;
            justify-content: center;
            align-items: center;
          `;
          
          // 克隆 SVG
          const svgClone = svg.cloneNode(true);
          svgClone.style.cssText = `
            width: 100%;
            height: 100%;
            display: block;
            transform-origin: center center;
          `;
          
          modalContent.appendChild(svgClone);
          modal.appendChild(modalContent);
          
          // 添加关闭按钮
          const closeBtn = document.createElement('button');
          closeBtn.innerHTML = '×';
          closeBtn.style.cssText = `
            position: absolute;
            top: 15px;
            right: 20px;
            background: rgba(0, 0, 0, 0.7);
            border: none;
            font-size: 24px;
            cursor: pointer;
            color: white;
            z-index: 10001;
            width: 40px;
            height: 40px;
            border-radius: 50%;
            display: flex;
            justify-content: center;
            align-items: center;
          `;
          closeBtn.onclick = () => {
            document.body.removeChild(modal);
            // 清理事件监听器
            document.removeEventListener('keydown', handleEsc);
          };
          modalContent.appendChild(closeBtn);
          
          // 添加缩放控制按钮
          const zoomControls = document.createElement('div');
          zoomControls.style.cssText = `
            position: absolute;
            bottom: 20px;
            right: 20px;
            z-index: 10001;
            display: flex;
            flex-direction: column;
            gap: 10px;
          `;
          
          const zoomInBtn = document.createElement('button');
          zoomInBtn.innerHTML = '+';
          zoomInBtn.style.cssText = `
            background: rgba(0, 0, 0, 0.7);
            border: none;
            color: white;
            width: 40px;
            height: 40px;
            border-radius: 50%;
            font-size: 18px;
            cursor: pointer;
            display: flex;
            justify-content: center;
            align-items: center;
          `;
          
          const zoomOutBtn = document.createElement('button');
          zoomOutBtn.innerHTML = '−';
          zoomOutBtn.style.cssText = `
            background: rgba(0, 0, 0, 0.7);
            border: none;
            color: white;
            width: 40px;
            height: 40px;
            border-radius: 50%;
            font-size: 18px;
            cursor: pointer;
            display: flex;
            justify-content: center;
            align-items: center;
          `;
          
          const resetBtn = document.createElement('button');
          resetBtn.innerHTML = '⌂';
          resetBtn.style.cssText = `
            background: rgba(0, 0, 0, 0.7);
            border: none;
            color: white;
            width: 40px;
            height: 40px;
            border-radius: 50%;
            font-size: 16px;
            cursor: pointer;
            display: flex;
            justify-content: center;
            align-items: center;
          `;
          
          zoomControls.appendChild(zoomInBtn);
          zoomControls.appendChild(zoomOutBtn);
          zoomControls.appendChild(resetBtn);
          modalContent.appendChild(zoomControls);
          
          // 点击外部关闭
          modal.addEventListener('click', (e) => {
            if (e.target === modal) {
              document.body.removeChild(modal);
              document.removeEventListener('keydown', handleEsc);
            }
          });
          
          // ESC 键关闭
          const handleEsc = (e) => {
            if (e.key === 'Escape') {
              document.body.removeChild(modal);
              document.removeEventListener('keydown', handleEsc);
            }
          };
          document.addEventListener('keydown', handleEsc);
          
          document.body.appendChild(modal);
          
          // 添加缩放和拖拽功能，获取重置函数
          const resetTransform = addZoomAndPanToSvg(svgClone);
          
          // 绑定控制按钮事件
          zoomInBtn.onclick = () => {
            const currentScale = parseFloat(svgClone.style.transform.match(/scale\(([^)]+)\)/)?.[1] || '1');
            const newScale = Math.min(currentScale * 1.2, 3);
            const currentTranslate = svgClone.style.transform.match(/translate\(([^)]+)\)/);
            if (currentTranslate) {
              svgClone.style.transform = `translate(${currentTranslate[1]}) scale(${newScale})`;
            } else {
              svgClone.style.transform = `scale(${newScale})`;
            }
          };
          
          zoomOutBtn.onclick = () => {
            const currentScale = parseFloat(svgClone.style.transform.match(/scale\(([^)]+)\)/)?.[1] || '1');
            const newScale = Math.max(currentScale / 1.2, 0.5);
            const currentTranslate = svgClone.style.transform.match(/translate\(([^)]+)\)/);
            if (currentTranslate) {
              svgClone.style.transform = `translate(${currentTranslate[1]}) scale(${newScale})`;
            } else {
              svgClone.style.transform = `scale(${newScale})`;
            }
          };
          
          resetBtn.onclick = resetTransform;
        });
      }
    });
  }, 2000);
}

// 等待 DOM 加载完成后再执行
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', enhanceMermaidDiagrams);
} else {
  enhanceMermaidDiagrams();
}

mermaid.initialize({
  theme: "base",
  themeVariables: {
    background: css("--color-neutral"),
    primaryColor: css("--color-primary-200"),
    secondaryColor: css("--color-secondary-200"),
    tertiaryColor: css("--color-neutral-100"),
    primaryBorderColor: css("--color-primary-400"),
    secondaryBorderColor: css("--color-secondary-400"),
    tertiaryBorderColor: css("--color-neutral-400"),
    lineColor: css("--color-neutral-600"),
    fontFamily:
      "ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,segoe ui,Roboto,helvetica neue,Arial,noto sans,sans-serif",
    fontSize: "16px",
  },
  // 启用交互功能
  securityLevel: 'loose',
  // 启用点击事件
  flowchart: {
    useMaxWidth: true,
    htmlLabels: true
  },
  // 确保图表正确渲染
  startOnLoad: true
});