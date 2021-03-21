## Views

Show page views without the server.

[中文文档](./README_CN.md)

<br/>

### What

- Display page views dynamically now.
- Easy to set up and use by anyone.
- Support `svg` / `react hooks`

<br/>

> We identify your unique identity through cache, referer and others, and return a dynamic SVG element.
> In addition, `views` also provides custom SVG styles, for more information, see the [documentation](https://views-docs.unix.bio).

<br/>

### Usage

1. Create [Pull Request](https://github.com/unix/views/pulls) to submit your domain.
2. Add `img` to your own page:

```html
<img src"https://views.unix.bio/svg?key=myblog.com" />
```

&nbsp;&nbsp;&nbsp;&nbsp;<img width="80" height="48" src="https://views.unix.bio/svg?key=myblog.com" />

<br/>

**[Learn more at Documentation](https://views-docs.unix.bio)**

### Additional instructions

For performance and cost reasons,`views` can only be displayed **on your own website**,
it can't work in GitHub(README.md) NPM or other places. You can also donate this project to help me do better.

<br/>

### License

[MIT](./LICENSE)
