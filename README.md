# cos-album
[demo](https://github.com/Lruihao/cos-album-demo)

## Step1
```html
<link rel="stylesheet" type="text/css" href="cos-album.min.css?v=1.1.3">
<script type="text/javascript" src="cos-album.min.js?v=1.1.3"></script>
```

## Step2
```js
<script type="text/javascript">
  new Cosalbum({
    'xmlLink': 'https://img-xxxxxxxxxx.cos.ap-chengdu.myqcloud.com',
    'prependTo': '',
    'viewNum': 4,
    'imgUrl': '//img.lruihao.cn'
  });
</script>
```

## Params
| param     | type   | description                        |
| :-------- | :----- | :--------------------------------- |
| xmlLink   | String | 需要解析的騰訊云COS桶XML鏈接         |
| prependTo | String | 可選解析相冊到某個節點,默認: 'body'   |
| viewNum   | Number | 每個相冊顯示的照片數目,默認: 4        |
| imgUrl    | String | 图片CDN链接,雙擊複製URL Since: 1.1.2 |

> [**详细说明**](https://lruihao.cn/posts/cos-album.html)  
