(function(d){
  let enableFootnotes = false
  if (d.currentScript) {
    enableFootnotes = d.currentScript.dataset['enableFootnotes'] ==  'true'
  }
  renderFootnotes = function () {
    const removeEl = (el) => {
        if (!el) return;
        el.remove ? el.remove() : el.parentNode.removeChild(el);
    };

    const insertAfter = (target, sib) => {
        target.after ? target.after(sib) : (
            target.parentNode.insertBefore(sib, target.nextSibling)
        );
    };

    const insideOut = (el) => {
        var p = el.parentNode, x = el.innerHTML,
            c = document.createElement('div');  // a tmp container
        insertAfter(p, c);
        c.appendChild(el);
        el.innerHTML = '';
        el.appendChild(p);
        p.innerHTML = x;  // let the original parent have the content of its child
        insertAfter(c, c.firstElementChild);
        removeEl(c);
    };

    document.querySelectorAll('.footnotes > ol > li[id^="fn"], #refs > div[id^="ref-"]').forEach(function (fn) {
        a = document.querySelectorAll('a[href="#' + fn.id + '"]');
        if (a.length === 0) return;
        a.forEach(function (el) { el.removeAttribute('href') });
        a = a[0];
        side = document.createElement('div');
        side.className = 'side side-right';
        if (/^fn/.test(fn.id)) {
            side.innerHTML = fn.innerHTML;
            var number = a.innerText;   // footnote number
            side.firstElementChild.innerHTML = '<span class="bg-number">' + number +
                '</span> ' + side.firstElementChild.innerHTML;
            removeEl(side.querySelector('a[href^="#fnref"]'));  // remove backreference
            a.parentNode.tagName === 'SUP' && insideOut(a);
        } else {
            side.innerHTML = fn.outerHTML;
            a = a.parentNode;
        }
        insertAfter(a, side);
        a.classList.add('note-ref');
        removeEl(fn);
    })
    document.querySelectorAll('.footnotes, #refs').forEach(function (fn) {
        var items = fn.children;
        if (fn.id === 'refs') return items.length === 0 && removeEl(fn);
        // there must be a <hr> and an <ol> left
        if (items.length !== 2 || items[0].tagName !== 'HR' || items[1].tagName !== 'OL') return;
        items[1].childElementCount === 0 && removeEl(fn);
    });
  };
  if (enableFootnotes) {
    renderFootnotes()
  }
})(document);
