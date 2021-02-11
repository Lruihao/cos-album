# cos-album
[demo](https://github.com/Lruihao/cos-album-demo)

## Step1
```html
<link rel="stylesheet" type="text/css" href="cos-album.min.css?v=1.1.6">
<script type="text/javascript" src="cos-album.min.js?v=1.1.6"></script>
```

## Step2
```js
<script type="text/javascript">
  new Cosalbum({
    'xmlLink': 'https://img-xxxxxxxxxx.cos.ap-chengdu.myqcloud.com',
    'prependTo': '.cos-album',
    'viewNum': 8,
    'copyUrl': 'https://img.lruihao.cn'
  });
</script>
```

## Params
| param     | type   | description                        |
| :-------- | :----- | :--------------------------------- |
| xmlLink   | String | 需要解析的騰訊云COS桶XML鏈接         |
| prependTo | String | 可選解析相冊到某個節點,默認: 'body'  |
| viewNum   | Number | 每個相冊顯示的照片數目,默認: 4       |
| copyUrl   | String | CDN 链接,雙擊複製 URL Since: 1.1.6  |
| imgType   | String | 图片類型 Since: 1.1.6              |
| videoType | String | 視頻類型 Since: 1.1.6              |

> [**详细说明**](https://lruihao.cn/posts/cos-album.html)  
