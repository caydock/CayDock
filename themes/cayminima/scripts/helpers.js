hexo.extend.helper.register('get_related_posts', function(post) {
  let relatedPosts = [];
  let firstTag = post.tags && post.tags.length > 0 ? post.tags.first().name : null;

  if (firstTag) {
    this.site.posts.forEach(p => {
      if (p._id !== post._id && p.tags && p.tags.some(tag => tag.name === firstTag)) {
        relatedPosts.push(p);
      }
    });
  }

  // 随机排序并取 4 篇
  return relatedPosts.sort(() => 0.5 - Math.random()).slice(0, 4);
});