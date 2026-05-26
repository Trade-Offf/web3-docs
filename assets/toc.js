/**
 * 巴别塔 doc — 自动 TOC 生成 + scroll-spy
 *
 * 在每个文档页的 <script> 里引用此文件即可。
 * 依赖 #page-toc 容器存在于 sidebar 中。
 */
(function () {
  'use strict';

  function buildToc() {
    const container = document.getElementById('page-toc');
    if (!container) return;

    const main = document.querySelector('.main');
    if (!main) return;

    // 收集所有带 id 的 h2 / h3
    const headings = Array.from(
      main.querySelectorAll('h2[id], h3[id], [id].section-anchor + .section > h2')
    );

    // 也抓 section-anchor 对应的 h2（常见于 div.section 结构）
    const sections = Array.from(main.querySelectorAll('.section-anchor'));
    const allItems = [];

    if (sections.length > 0) {
      // 结构：<div class="section-anchor" id="xxx"></div> 紧接 <h2>
      sections.forEach(anchor => {
        const id = anchor.id;
        if (!id) return;
        // h2 可能是 anchor 的下一个兄弟，也可能在父 section 里
        let h = anchor.nextElementSibling;
        while (h && h.tagName !== 'H2' && h.tagName !== 'H3') {
          h = h.nextElementSibling;
        }
        if (!h) {
          const parent = anchor.closest('.section');
          if (parent) h = parent.querySelector('h2, h3');
        }
        if (h) {
          allItems.push({ id, text: h.textContent.replace(/^\d+\s*/, '').trim(), level: parseInt(h.tagName[1]) });
        }
      });
    }

    // 补充直接带 id 的 h2/h3（non-section 页面结构）
    headings.forEach(h => {
      const id = h.id;
      if (!id) return;
      const already = allItems.find(i => i.id === id);
      if (!already) {
        allItems.push({ id, text: h.textContent.trim(), level: parseInt(h.tagName[1]) });
      }
    });

    if (allItems.length === 0) return;

    // 渲染 TOC
    const title = document.createElement('div');
    title.className = 'toc-title';
    title.textContent = 'ON THIS PAGE';
    container.appendChild(title);

    allItems.forEach(item => {
      const a = document.createElement('a');
      a.href = '#' + item.id;
      a.textContent = item.text;
      if (item.level === 3) a.classList.add('h3');
      a.addEventListener('click', e => {
        e.preventDefault();
        const target = document.getElementById(item.id);
        if (target) {
          const top = target.getBoundingClientRect().top + window.scrollY - 80;
          window.scrollTo({ top, behavior: 'smooth' });
        }
      });
      container.appendChild(a);
    });

    // Scroll-spy via IntersectionObserver
    const links = Array.from(container.querySelectorAll('a'));
    const targets = allItems.map(i => document.getElementById(i.id)).filter(Boolean);

    let activeId = null;

    const setActive = id => {
      if (activeId === id) return;
      activeId = id;
      links.forEach(a => {
        const isActive = a.getAttribute('href') === '#' + id;
        a.classList.toggle('toc-active', isActive);
      });
    };

    // 使用 scroll 事件 + getBoundingClientRect 方式，更可靠
    const onScroll = () => {
      const scrollTop = window.scrollY;
      let current = null;
      for (let i = targets.length - 1; i >= 0; i--) {
        const el = targets[i];
        const top = el.getBoundingClientRect().top + window.scrollY;
        if (scrollTop >= top - 100) {
          current = allItems[i].id;
          break;
        }
      }
      if (current) setActive(current);
      else if (allItems.length > 0) setActive(allItems[0].id);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll(); // 初始化
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', buildToc);
  } else {
    buildToc();
  }
})();
