const path = require('path');
const pluginSyntaxHighlight = require('@11ty/eleventy-plugin-syntaxhighlight');
const pluginRss = require('@11ty/eleventy-plugin-rss');

const monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

module.exports = function(eleventyConfig) {
  eleventyConfig.setTemplateFormats([ 'md', 'njk' ]);

  eleventyConfig.addPlugin(pluginSyntaxHighlight);
  eleventyConfig.addPlugin(pluginRss);

  eleventyConfig.addFilter('relUrl', (url, pageUrl) => {
    if(pageUrl.endsWith('.html')) {
      pageUrl = path.dirname(pageUrl);
    }
    let rel = path.relative(pageUrl, url);
    if(rel[0] !== '.') rel = './' + rel;
    return rel;
  });

  eleventyConfig.addFilter('formatDate', date => {
    let monthName = monthNames[date.getUTCMonth()];
    let day = date.getUTCDate();
    let year = date.getUTCFullYear();

    return `${monthName} ${day}, ${year}`;
  });

  eleventyConfig.addFilter('indexed', collection => {
    return collection.filter(post => {
      return !post.data.tags.includes('noindex');
    });
  });
};