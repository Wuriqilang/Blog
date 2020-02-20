const generateOverride = (params = {}) => {
  let result = ''

  // 主题色
  if (params.headerBgColor && params.headerBgColor !== '#000') {
    result += `
      .head, .info,
      .no-cover,
      .navigation a,
      .footer-rss,
      .item .item-image {
        background-color: ${params.headerBgColor};
      }

      .item:hover h2,
      .prev-post a:hover, .post-archives a:hover {
        color: ${params.headerBgColor};
      }

      .tags .tag:hover {
        border-color: ${params.headerBgColor};
      }

      .post-content a:hover {
        color: ${params.headerBgColor};
        border-color: ${params.headerBgColor};
      }
      
    `
  }

  if (params.customCss) {
    result += `
      ${params.customCss}
    `
  }

  return result
}

module.exports = generateOverride
