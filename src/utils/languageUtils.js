/**
 * 从URL路径中检测语言
 * @param {string} pathname - URL路径
 * @returns {object} - { language: string, cleanPath: string }
 */
export function detectLanguageFromPath(pathname) {
  // 检查是否是中文路径
  if (pathname.startsWith('/zh-cn')) {
    return {
      language: 'zh',
      cleanPath: pathname.replace('/zh-cn', '') || '/'
    };
  }
  
  // 英文路径不需要特殊处理，直接返回
  
  // 默认英文
  return {
    language: 'en',
    cleanPath: pathname
  };
}

/**
 * 生成多语言链接
 * @param {string} path - 基础路径
 * @param {string} language - 语言代码
 * @returns {string} - 完整的多语言路径
 */
export function generateMultilingualPath(path, language) {
  if (language === 'zh') {
    return `/zh-cn${path}`;
  }
  return path; // 英文不需要前缀
}
