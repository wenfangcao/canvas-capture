//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    motto: 'Hello World',
    img1: 'http://fed.dev.hzmantu.com/oa-project/fe516bedb06bb074cc93ba2999a45faf.png',
    img2: 'http://fed.dev.hzmantu.com/oa-project/04566a355beb490eed833ed43eb4067f.JPG',
    index: 0,
    touchList: [
    ],
  },
  onLoad: function () {
   
  },
  changeImg() {
    this.setData({
      index: this.data.index === 0 ? 1 : 0
    })
    console.log(this.data.index)
  },
  previewImg(e) {
    let src = e.target.dataset.src
    console.log(e.target.dataset.src)
    wx.previewImage({
      urls: [
        this.data.img1,
        this.data.img2
      ],
    })
  },
  longPress(e) {
    let { pageX, pageY } = e.changedTouches[0]
    this.data.touchList.push({
      pageX,
      pageY
    })
    console.log(e)
    console.log('pageX', pageX, ' pageY', pageY)
    this.setData({
      touchList: this.data.touchList
    })
  }
})
