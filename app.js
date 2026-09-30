// 第 4 课：页面交互 —— 阅读进度条、当前栏目高亮、“返回顶部”按钮。
//
// 前提：导航用原生锚点 <a href="#skills">，不用 JS 也能跳转。
// 本文件只做“渐进增强”：JS 不加载时页面照样能读，只是少了这些提示。
//
// 维护提示：增删栏目时**本文件不用改**。
//   栏目标题直接取导航文字，栏目位置由 HTML 的 <section id="..."> 自动识别。

// ===================== 准备：把要用到的元素抓到手 =====================
const progressBar = document.querySelector('#reading-progress')
const indicator = document.querySelector('#section-indicator')
const toTopButton = document.querySelector('#to-top')
const navLinks = document.querySelectorAll('nav a')

// 页面上所有栏目：hero 是首屏，section 是其余栏目，两类都要。
const sections = document.querySelectorAll('main .hero[id], main section[id]')

// 用导航文字当栏目名，省去单独维护一张对照表：'#about' → '关于'
const sectionNames = new Map()
navLinks.forEach(link => sectionNames.set(link.getAttribute('href'), link.textContent.trim()))

// ===================== TODO 01 · 点按钮平滑回到页面顶部 =====================
toTopButton.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
  // 回顶后地址栏的 # 还停在原栏目，手动同步，避免徽标与画面不一致。
  history.replaceState(null, '', location.pathname)
  showCurrent('#about')
})

// ===================== TODO 02 · 滚过六成屏高，按钮才浮现 =====================
// 按钮怎么淡入由 CSS 的 .to-top.is-visible 决定，JS 只管什么时候加这个类。
function handleScroll() {
  // 用 innerHeight 的比例而不是写死像素，手机和电脑都合适。
  toTopButton.classList.toggle('is-visible', window.scrollY > window.innerHeight * 0.6)
  updateProgress() // 顺便更新进度条
}
// 滚动一秒触发几十次，所以两件事合用一个监听器，减少开销。
window.addEventListener('scroll', handleScroll)

// ===================== TODO 03 · 顶部阅读进度条 =====================
function updateProgress() {
  const scrollable = document.documentElement.scrollHeight - window.innerHeight
  // 页面太短时 scrollable 为 0，除以 0 会得到 NaN，必须先挡一下。
  const ratio = scrollable > 0 ? window.scrollY / scrollable : 0
  progressBar.style.width = `${ratio * 100}%`
}

// ===================== TODO 04 · 导航高亮 + 右下角栏目名 =====================
function showCurrent(hash) {
  const current = hash || '#about' // 没有 # 时默认首屏，否则一进页面什么都不高亮
  indicator.textContent = sectionNames.get(current) || '' // 取不到就留空，别出现 undefined

  navLinks.forEach(link => {
    const isCurrent = link.getAttribute('href') === current
    link.classList.toggle('is-current', isCurrent) // 外观交给 CSS 的 nav a.is-current
    // 无障碍：告诉读屏软件当前在哪一项。
    if (isCurrent) link.setAttribute('aria-current', 'location')
    else link.removeAttribute('aria-current')
  })
}

// ===================== TODO 05 · 点导航、按前进/后退，高亮都跟着走 =====================
window.addEventListener('hashchange', () => showCurrent(location.hash))
// 直接打开 index.html#skills 时 hash 没“变化”，不会触发 hashchange，所以还要先手动跑一次。
showCurrent(location.hash)
updateProgress() // 刷新时页面可能已在中间，进度条先算一次

// ===================== 已写好的部分：两处 IntersectionObserver 效果 =====================

// （一）往下滚，高亮自己跟着换。
// 用浏览器底层的观察器，而不是在 scroll 里反复算位置：只在真的进出屏幕时通知，更省性能。
const spy = new IntersectionObserver(
  entries => {
    for (const entry of entries) {
      if (entry.isIntersecting) showCurrent(`#${entry.target.id}`)
    }
  },
  // 判定范围上下各收窄 45%，即“滚到屏幕中间才算进入”，否则高亮会来回乱跳。
  { rootMargin: '-45% 0px -45% 0px' },
)
sections.forEach(section => spy.observe(section))

// （二）栏目进入屏幕时淡入上移。
// 同一个工具换一组参数：露出 15% 即可，且只淡入一次（unobserve 后不再观察）。
const reveal = new IntersectionObserver(
  (entries, observer) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue
      entry.target.classList.add('is-visible')
      observer.unobserve(entry.target)
    }
  },
  { threshold: 0.15 },
)
sections.forEach(section => reveal.observe(section))
