import sanitizeHtmlLib from 'sanitize-html';

export function sanitizeHtml(input) {
  if (!input || typeof input !== 'string') return '';

  // Use sanitize-html with a conservative allowlist to prevent XSS
  return sanitizeHtmlLib(input, {
    allowedTags: sanitizeHtmlLib.defaults.allowedTags.concat([
      'img',
      'h1',
      'h2',
      'h3',
      'h4',
      'h5',
      'h6'
    ]),
    allowedAttributes: {
      a: ['href', 'name', 'target', 'rel'],
      img: ['src', 'alt', 'width', 'height', 'loading'],
      '*': ['class']
    },
    allowedSchemesByTag: {
      a: ['http', 'https', 'mailto'],
      img: ['http', 'https', 'data']
    },
    allowProtocolRelative: false,
    transformTags: {
      'a': (tagName, attribs) => {
        // enforce noopener on target=_blank
        if (attribs.target === '_blank') {
          attribs.rel = attribs.rel ? attribs.rel + ' noopener noreferrer' : 'noopener noreferrer';
        }
        return { tagName, attribs };
      }
    }
  });
}
