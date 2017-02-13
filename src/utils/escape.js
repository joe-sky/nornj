const ESCAPE_LOOKUP = {
  '&': '&amp;',
  '>': '&gt;',
  '<': '&lt;',
  '"': '&quot;',
  '\'': '&#x27;'
};

export default function escape(text) {
  if (text == null) {
    return '';
  }
  else if(!text.replace) {
    return text;
  }

  return text.replace(/[&><"']/g, match => ESCAPE_LOOKUP[match]);
}