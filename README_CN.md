## Views

0 配置展示属于你的页面阅读量。

<br/>

### 什么是 `views`

- 动态、即时地展示页面浏览量。
- 适合所有人、无需配置、更易于使用。
- 开源而且免费的服务。
- 支持 `svg` / `react hooks`

<br/>

> 我们通过 `cache` / `referer` 等方式来鉴别你和你的页面唯一性，同时返回为请求返回一个动态 SVG 元素以记录和显示浏览量。
> 除此之外，`views.show` 还提供定制 SVG (数字) 的样式，更多相关信息，可以参见 [文档](https://views-docs.unix.bio)。

<br/>

### 如何使用

1. 创建一个 [Pull Request](https://github.com/unix/views/pulls) 来提交你独立站点的域名，以获得使用许可。
2. 添加 `img` 元素到你的页面即可:

```html
<img src"https://views.unix.bio/svg?key=myblog.com" />
```

&nbsp;&nbsp;&nbsp;&nbsp;<img width="80" height="48" src="https://views.unix.bio/svg?key=myblog.com" />

<br/>

**[在文档中了解更多](https://views-docs.unix.bio)**

<br/>

### 额外说明

出于性能和费用考虑，`views` 只能为你的独立站点提供服务，不能在 GitHub(README.md) NPM 或者其他地方工作。
当然，你也可以捐助我以帮助项目运营与发展。

<br/>

### 许可证

[MIT](./LICENSE)
