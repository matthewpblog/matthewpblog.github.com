const fsc = require('fs-cheerio');
const fs = require('fs').promises;
const path = require('path');
const converter = require('@tryghost/html-to-mobiledoc');

const BASE = __dirname + '/../../../public/programming';

async function run() {
  let files = await fs.readdir(BASE);

  let redirects = [];

  let importData = {
    db: [
      {
        "meta": {
          "exported_on": 1597712028731,
          "version": "3.29.1"
        },
        data: {
          "posts": [],
          "tags": [],
          "users": [],
          "posts_tags": [],
          "posts_authors": [],
          "roles_users": []
        }
      }
    ]
  };

  let id = 1;

  for(let file of files) {
    if(file !== 'index.html' && file.endsWith('.html')) {
      let pth = path.join(BASE, file);
      let $ = await fsc.readFile(pth);

      let title = $('title').text().trim();
      let publishedAt = $('time').text().trim()
      let mainHtml = $('main').html()
      let mobiledoc = JSON.stringify(converter.toMobiledoc(mainHtml));
      let description = $('meta[property="og:description"]').attr('content');
      let slug = file.replace('.html', '')
      
      let post = {
        id,
        title, mobiledoc, slug,
        status: 'published'
      };

      if(!publishedAt) {
        publishedAt = 'January 1, 2015';
      }
      post.published_at = new Date(publishedAt).valueOf();

      if(description) {
        post.meta_description = description.trim();
      }

      importData.db[0].data.posts.push(post);
      redirects.push({
        from: `/${file}`,
        to: `/${slug}/`,
        permanent: true
      });

      id++;
    }
  }

  await fs.writeFile('import.json', JSON.stringify(importData), 'utf8');
  await fs.writeFile('redirects.json', JSON.stringify(redirects), 'utf8');
}

run();