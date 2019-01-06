const fsc = require('fs-cheerio');

let REG_ESCAPE_ALL = /[<>&]/g;
let now = new Date();

function escape(txt) {
  return txt.replace(REG_ESCAPE_ALL, function(match) {
    switch(match) {
      case '&':
        return '&amp;';
      case '<':
        return '&lt;';
      case '>':
        return '&gt;';
      default:
        return match;
    }
  });
}

function feed(entries) {
  return `<?xml version="1.0" encoding="utf-8"?>
  <feed xmlns="http://www.w3.org/2005/Atom">
    <title>Matthew Phillips Programming Blog</title>
    <subtitle>Musings on things. Mostly JavaScript / Web.</subtitle>
    <link href="https://matthewphillips.info/programming/atom.xml" rel="self" />
    <link href="https://matthewphillips.info/programming/index.html" />
    <id>https://matthewphillips.info/programming/index.html</id>
    <updated>${now.toISOString()}</updated>
    ${entries.join('\n')}
  </feed>`
}

function entry(el) {
  let title = escape(el.find('a').text());
  let href = el.find('a').attr('href').substr(1);
  let url = `https://matthewphillips.info/programming${href}`;
  let time = new Date(el.find('time').text());

  return `<entry>
    <title>${title}</title>
    <link href="${url}" />
    <id>${url}</id>
    <updated>${time.toISOString()}</updated>
    <author><name>Matthew Phillips</name></author>
  </entry>`;
}

async function run() {
  let $ = await fsc.readFile(__dirname + '/../../../public/programming/index.html');
  let articles = $('.articles article');

  let entries = [];

  articles.each((i, el) => {
    let $el = $(el);
    let hasTime = $el.find('time').html().length;

    if(hasTime && entries.length < 21) {
      entries.push(entry($el, $));
    }
  });

  let atom = feed(entries);
  console.log(atom);
}

run();