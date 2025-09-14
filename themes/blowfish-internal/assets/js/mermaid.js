function css(name) {
  return "rgb(" + getComputedStyle(document.documentElement).getPropertyValue(name) + ")";
}

// 添加自定义样式
function addMermaidStyles() {
  const style = document.createElement('style');
  style.textContent = `
    /* Mermaid 图表容器样式 */
    .mermaid {
      background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
      border-radius: 12px;
      padding: 20px;
      margin: 20px 0;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      transition: all 0.3s ease;
    }
    
    .mermaid:hover {
      box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
      transform: translateY(-2px);
    }
    
    /* SVG 样式优化 */
    .mermaid svg {
      border-radius: 8px;
      background: white;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }
    
    /* 节点样式 */
    .mermaid .node rect,
    .mermaid .node circle,
    .mermaid .node ellipse,
    .mermaid .node polygon {
      filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
      transition: all 0.2s ease;
    }
    
    .mermaid .node:hover rect,
    .mermaid .node:hover circle,
    .mermaid .node:hover ellipse,
    .mermaid .node:hover polygon {
      filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.2));
      transform: scale(1.02);
    }
    
    /* 文字样式 */
    .mermaid .nodeLabel,
    .mermaid .edgeLabel {
      font-weight: 500;
      text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
    }
    
    /* 连接线样式 */
    .mermaid .edgePath path {
      stroke-width: 2;
      filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.1));
    }
    
    .mermaid .edgePath:hover path {
      stroke-width: 3;
      filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
    }
    
    /* 箭头样式 */
    .mermaid .arrowheadPath {
      filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.1));
    }
    
    /* 集群样式 */
    .mermaid .cluster rect {
      fill: rgba(255, 255, 255, 0.8);
      stroke: rgba(0, 0, 0, 0.1);
      stroke-width: 1;
      filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
    }
    
    /* 模态框中的图表样式 */
    .mermaid-modal .mermaid {
      background: white;
      box-shadow: none;
      border-radius: 0;
      padding: 0;
      margin: 0;
    }
    
    .mermaid-modal .mermaid:hover {
      transform: none;
      box-shadow: none;
    }
    
    .mermaid-modal svg {
      background: white;
      border-radius: 0;
      box-shadow: none;
    }
    
    /* 响应式设计 */
    @media (max-width: 768px) {
      .mermaid {
        padding: 15px;
        margin: 15px 0;
      }
      
      .mermaid svg {
        max-width: 100%;
        height: auto;
      }
    }
    
    /* 深色模式支持 */
    @media (prefers-color-scheme: dark) {
      .mermaid {
        background: linear-gradient(135deg, #2d3748 0%, #4a5568 100%);
      }
      
      .mermaid svg {
        background: #2d3748;
      }
      
      .mermaid .nodeLabel,
      .mermaid .edgeLabel {
        fill: #e2e8f0;
      }
    }
  `;
  document.head.appendChild(style);
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

// 自动应用节点样式
function applyNodeStyles(svg) {
  // 定义样式类
  const styleClasses = {
    rootNode: { fill: '#e3f2fd', stroke: '#1976d2', strokeWidth: '3px', color: '#1565c0' },
    investmentNode: { fill: '#f3e5f5', stroke: '#8e24aa', strokeWidth: '2px', color: '#7b1fa2' },
    systemNode: { fill: '#e8f5e8', stroke: '#388e3c', strokeWidth: '2px', color: '#2e7d32' },
    ipNode: { fill: '#fff3e0', stroke: '#f57c00', strokeWidth: '2px', color: '#ef6c00' },
    leafNode: { fill: '#fafafa', stroke: '#616161', strokeWidth: '1px', color: '#424242' }
  };
  
  // 获取所有节点
  const nodes = svg.querySelectorAll('.node');
  
  nodes.forEach(node => {
    const textElement = node.querySelector('.nodeLabel');
    if (textElement) {
      const text = textElement.textContent;
      
      // 根据文本内容判断节点类型
      let nodeType = 'leafNode';
      
      if (text.includes('被动收入')) {
        nodeType = 'rootNode';
      } else if (text.includes('投资') || text.includes('股息') || text.includes('债券') || text.includes('基金') || text.includes('加密货币')) {
        nodeType = 'investmentNode';
      } else if (text.includes('系统') || text.includes('公司') || text.includes('机器') || text.includes('SaaS') || text.includes('应用') || text.includes('API') || text.includes('连锁') || text.includes('教育') || text.includes('服务') || text.includes('硬件') || text.includes('软件') || text.includes('售卖机') || text.includes('共享')) {
        nodeType = 'systemNode';
      } else if (text.includes('IP') || text.includes('内容') || text.includes('创作') || text.includes('数字') || text.includes('产品') || text.includes('授权') || text.includes('课程') || text.includes('小说') || text.includes('音乐') || text.includes('游戏') || text.includes('平台') || text.includes('版权')) {
        nodeType = 'ipNode';
      }
      
      // 应用样式
      const style = styleClasses[nodeType];
      const rect = node.querySelector('rect, circle, ellipse, polygon');
      if (rect) {
        rect.setAttribute('fill', style.fill);
        rect.setAttribute('stroke', style.stroke);
        rect.setAttribute('stroke-width', style.strokeWidth);
      }
      
      // 设置文字颜色
      textElement.setAttribute('fill', style.color);
    }
  });
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
        
        // 应用自动样式
        applyNodeStyles(svg);
        
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

// 添加样式
addMermaidStyles();

// 等待 DOM 加载完成后再执行
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', enhanceMermaidDiagrams);
} else {
  enhanceMermaidDiagrams();
}

mermaid.initialize({
  theme: "base",
  themeVariables: {
    // 背景色 - 使用更柔和的颜色
    background: "#fafafa",
    // 主要颜色 - 使用渐变色系
    primaryColor: "#e3f2fd",
    primaryTextColor: "#1565c0",
    primaryBorderColor: "#1976d2",
    // 次要颜色
    secondaryColor: "#f3e5f5",
    secondaryTextColor: "#7b1fa2",
    secondaryBorderColor: "#8e24aa",
    // 第三级颜色
    tertiaryColor: "#e8f5e8",
    tertiaryTextColor: "#2e7d32",
    tertiaryBorderColor: "#388e3c",
    // 线条颜色
    lineColor: "#424242",
    // 字体设置
    fontFamily: "ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif",
    fontSize: "14px",
    // 节点样式
    nodeBkg: "#ffffff",
    nodeTextColor: "#333333",
    clusterBkg: "#f5f5f5",
    clusterTextColor: "#666666",
    // 边线样式
    edgeLabelBackground: "#ffffff",
    edgeLabelColor: "#333333",
    // 激活状态
    activeTaskBkgColor: "#e1f5fe",
    activeTaskBorderColor: "#0277bd",
    // 网格线
    gridColor: "#e0e0e0"
  },
  // 启用交互功能
  securityLevel: 'loose',
  // 流程图配置
  flowchart: {
    useMaxWidth: true,
    htmlLabels: true,
    curve: 'basis', // 使用更平滑的曲线
    padding: 20, // 增加内边距
    nodeSpacing: 50, // 节点间距
    rankSpacing: 50, // 层级间距
    diagramPadding: 20 // 图表内边距
  },
  // 序列图配置
  sequence: {
    useMaxWidth: true,
    wrap: true,
    width: 150,
    height: 65,
    boxMargin: 10,
    boxTextMargin: 5,
    noteMargin: 10,
    messageMargin: 35,
    messageAlign: 'center',
    mirrorActors: true,
    bottomMarginAdj: 1,
    actorFontSize: 14,
    actorFontFamily: 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif',
    actorFontWeight: '400',
    actorFontColor: '#333',
    signalFontSize: 12,
    signalFontFamily: 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif',
    signalFontWeight: '400',
    signalFontColor: '#333',
    labelFontSize: 12,
    labelFontFamily: 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif',
    labelFontWeight: '400',
    labelFontColor: '#333',
    activationWidth: 10,
    activationWidth: 10,
    width: 150,
    height: 65,
    boxMargin: 10,
    boxTextMargin: 5,
    noteMargin: 10,
    messageMargin: 35,
    messageAlign: 'center',
    mirrorActors: true,
    bottomMarginAdj: 1,
    actorFontSize: 14,
    actorFontFamily: 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif',
    actorFontWeight: '400',
    actorFontColor: '#333',
    signalFontSize: 12,
    signalFontFamily: 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif',
    signalFontWeight: '400',
    signalFontColor: '#333',
    labelFontSize: 12,
    labelFontFamily: 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif',
    labelFontWeight: '400',
    labelFontColor: '#333',
    activationWidth: 10
  },
  // 甘特图配置
  gantt: {
    useMaxWidth: true,
    leftPadding: 75,
    gridLineStartPadding: 35,
    fontSize: 11,
    fontFamily: 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif',
    sectionFontSize: 24,
    sectionFontFamily: 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif',
    numberSectionStyles: 4,
    axisFormat: '%m/%d',
    topAxis: false
  },
  // 饼图配置
  pie: {
    useMaxWidth: true,
    textPosition: 0.75
  },
  // 确保图表正确渲染
  startOnLoad: true
});