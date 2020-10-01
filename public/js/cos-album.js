/**
 * Name       ：cos-album.js
 * Version    : 1.1.2
 * Description: Cosalbum 基於騰訊云COS桶的“動態”相冊抽象類
 * Updated on : 2020/10/1 13:23
 * Author     : Lruihao http://lruihao.cn
 */

Cosalbum = function Cosalbum() {

  /**
   * 渲染DOM
   * @param {String} xmlLink 需要解析的騰訊云COS桶XML鏈接
   * @param {String} prependTo 可選解析相冊到某個節點,e.g. '.myalbum','#myalbum',默认'body'
   * @param {Number} viewNum 每個相冊顯示的照片數目,默認: 4
   * @param {String} imgUrl 图片CDN链接
   */
  var _renderDom = function (xmlLink, prependTo, viewNum, imgUrl) {
    let content = _getContent(xmlLink);
    let cosAlbum = document.createElement('div');
    let insert = document.querySelector(prependTo || 'body');
    cosAlbum.className = 'cos-album';
    for (let i = 0; i < content.length; i++) {
      //相册与封面
      let $photoBox = document.createElement('div');
      let $cover = document.createElement('div');
      let $title = document.createElement('div');
      let titleContent = content[i][0].url.slice(0, -1);
      $title.innerHTML = titleContent;
      $title.className = 'title';
      $cover.appendChild($title);
      $cover.className = 'cover';
      $cover.style.cssText = `background: url(${xmlLink}/${titleContent}/封面.jpg);`;
      $photoBox.appendChild($cover);
      $photoBox.className = 'photoBox';
      cosAlbum.appendChild($photoBox);

      for (let j = 1; j < content[i].length && j < viewNum + 1; j++) {
        let $photo = document.createElement('div');
        let $img = document.createElement('img');
        let $desc = document.createElement('span');
        let $upDate = document.createElement('span');
        $photo.className = 'photo';
        $img.setAttribute('src', `${xmlLink}/${titleContent}/${content[i][j].url}`);
        $img.setAttribute('alt', content[i][j].url);
        if (imgUrl) {
          _addCopyListener($img, `${imgUrl}/${titleContent}/${content[i][j].url}`);
        }
        $desc.innerHTML = content[i][j].url.slice(0, -4);
        $upDate.innerHTML = _timeSince(content[i][j].date);
        $upDate.title = content[i][j].date;
        $photo.appendChild($img);
        $photo.appendChild($desc);
        $photo.appendChild($upDate);
        $photoBox.appendChild($photo);
      }
      //插入指定元素第一个子元素
      insert.insertBefore(cosAlbum, insert.firstChild);

      if (content[i].length > viewNum) {
        let $moreItem = document.createElement('div');
        let $btnMore = document.createElement('button');
        $moreItem.className = 'more';
        $btnMore.className = 'btn-more';
        $btnMore.innerHTML = '加載更多';
        $btnMore.addEventListener('click', function () {
          _moreClick(this, content[i], viewNum, xmlLink, imgUrl);
        });
        $moreItem.appendChild($btnMore);
        $photoBox.appendChild($moreItem);
      }
    }
  };

  /**
   * 獲取圖片的名稱和上傳日期
   * @param {String} xmlLink 需要解析的騰訊云COS桶XML鏈接
   * @return {Array} content 包含名稱和日期的二維數組，content[x][0]為單個相冊名稱
   */
  var _getContent = function (xmlLink) {
    xmlDoc = _loadXMLDoc(xmlLink);
    let urls = xmlDoc.querySelectorAll('Key');
    let date = xmlDoc.querySelectorAll('LastModified');
    let photoBox = -1;
    let photo = 0;
    let content = new Array();
    for (let i = 0; i < urls.length; i++) {
      let info = urls[i].innerHTML;
      let upDate = date[i].innerHTML.slice(0, 19).replace(/T/g, ' ');
      let length = info.indexOf('/');
      if (length === -1) {
        //排除根目錄文件
        continue;
      }
      if (length === info.length - 1) {
        //相冊目錄
        content[++photoBox] = new Array();
        content[photoBox][0] = {
          'url': info,
          'date': upDate
        };
        photo = 1;
      } else {
        //相冊圖片
        content[photoBox][photo++] = {
          'url': info.slice(length + 1),
          'date': upDate
        };
      }
    }
    return content;
  };

  /**
   * 加載XML
   * @param {String} xmlLink 需要解析的騰訊云COS桶XML鏈接
   * @return {Object} xmlDoc XML文檔節點對象
   */
  var _loadXMLDoc = function (xmlUrl) {
    try {
      //Internet Explorer
      xmlDoc = new ActiveXObject('Microsoft.XMLDOM');
    } catch (e) {
      try {
        //Firefox, Mozilla, Opera, etc.
        xmlDoc = document.implementation.createDocument('', '', null);
      } catch (e) {
        alert(e.message);
      }
    }
    try {
      xmlDoc.async = false;
      xmlDoc.load(xmlUrl);
    } catch (e) {
      try {
        //Google Chrome
        let chromeXml = new XMLHttpRequest();
        chromeXml.open('GET', xmlUrl, false);
        chromeXml.send(null);
        xmlDoc = chromeXml.responseXML.documentElement;
      } catch (e) {
        alert(e.message);
      }
    }
    return xmlDoc;
  };

  /**
   * 獲取更多圖片
   * @param {Object} obj button對象本身
   * @param {Array} contentX 單個相冊的數組，相當於content[x]
   * @param {Number} viewNum 每個相冊顯示的照片數目,默認: 4
   * @param {String} xmlLink 需要解析的騰訊云COS桶XML鏈接
   * @param {String} imgUrl 图片CDN链接
   */
  var _moreClick = function (obj, contentX, viewNum, xmlLink, imgUrl) {
    let $photoBox = obj.parentNode.parentNode;
    let num = $photoBox.childNodes.length - 1;
    let titleContent = contentX[0].url.slice(0, -1);
    $photoBox.removeChild(obj.parentNode);
    for (let i = num; i < contentX.length && i < num + viewNum; i++) {
      let url = contentX[i].url;
      let $photo = document.createElement('div');
      let $img = document.createElement('img');
      let $desc = document.createElement('span');
      let $upDate = document.createElement('span');
      $photo.className = 'photo';
      $img.setAttribute('src', `${xmlLink}/${titleContent}/${url}`);
      $img.setAttribute('alt', url);
      if (imgUrl) {
        _addCopyListener($img, `${imgUrl}/${titleContent}/${url}`);
      }
      $desc.innerHTML = url.slice(0, -4);
      $upDate.innerHTML = _timeSince(contentX[i].date);
      $upDate.title = contentX[i].date;
      $photo.appendChild($img);
      $photo.appendChild($desc);
      $photo.appendChild($upDate);
      $photoBox.appendChild($photo);
    }
    if (contentX.length > num + viewNum) {
      $photoBox.appendChild(obj.parentNode);
    }
  };

  /**
   * 雙擊複製圖片鏈接
   * @param {Element} $img 圖片DOM元素
   * @param {String} imgUrl 圖片地址
   */
  var _addCopyListener = function ($img, imgUrl) {
    $img.addEventListener('dblclick', function () {
      let $copyNode = document.querySelector('.copy-node');
      $copyNode.value = imgUrl;
      $copyNode.select();
      try {
        document.execCommand('copy');
      } catch (err) {
        console.log('浏览器不支持此复制操作！');
      }
      console.log('复制成功！');
    });
  };

  /**
   * 將時間字串轉換為時間差距字串，如：1小時之前、50秒之前等
   * @param {String} date 時間字串
   * @returns {String} 時間差距字串
   * @function
   */
  var _timeSince = (date) => {
    if (!date) {
      return;
    }
    let dateTS = new Date(date.replace(/-/g, '/'));
    let seconds = Math.floor((new Date() - dateTS) / 1000);
    let interval = Math.floor(seconds / 31536000);
    interval = Math.floor(seconds / 2592000);
    interval = Math.floor(seconds / 86400);
    if (interval >= 4) {
      return date.slice(0, -3);
    }
    if (interval >= 1) {
      return interval + " 天前";
    }
    interval = Math.floor(seconds / 3600);
    if (interval >= 1) {
      return interval + " 小時前";
    }
    interval = Math.floor(seconds / 60);
    if (interval >= 1) {
      return interval + " 分鐘前";
    }
    return "剛剛";
  };

  /**
   * Cosalbum 基於騰訊云COS桶的“動態”相冊
   * @param {Object} option 
   * @param {String} option.xmlLink 需要解析的騰訊云COS桶XML鏈接
   * @param {String} option.prependTo 可選解析相冊到某個節點,e.g. '.myalbum','#myalbum',默认'body'
   * @param {Number} option.viewNum 每個相冊顯示的照片數目,默認: 4
   * @param {String} option.imgUrl 图片CDN链接
   * @namespace Cosalbum
   * @class Cosalbum
   * @author Lruihao http://lruihao.cn
   */
  function Cosalbum(option) {
    var _proto = Cosalbum.prototype;
    this.option = option || {};
    this.xmlLink = option.xmlLink || '';
    this.prependTo = option.prependTo || 'body';
    this.viewNum = option.viewNum || 4;
    this.imgUrl = option.imgUrl || '';
    if (this.imgUrl) {
      //复制 imgUrl 的节点
      let $copyNode = document.createElement('input');
      $copyNode.className = 'copy-node';
      document.body.appendChild($copyNode);
    }
    _renderDom(this.xmlLink, this.prependTo, this.viewNum, this.imgUrl);
  }
  return Cosalbum;
}();
