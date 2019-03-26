// pages/open/open.js
const device = wx.getSystemInfoSync()
const W = device.windowWidth * 2
const H = device.windowHeight * 2
Page({

  /**
   * 页面的初始数据
   */
  data: {
    W,
    H,
    img: {
      url: 'https://fed.dev.hzmantu.com/oa-project/d601766c8c37cc9e70b88e4bbbc94b21.JPG',
      x: 0,
      y: 0,
      width: 200,
      height: 150,
    },
  },
  onReady () {
    this.loadImage()
  },
  loadImage () {
    let _this = this
    wx.getImageInfo({
      src: _this.data.img.url,
      success: (res) => {
        let img = _this.data.img
        img.width = res.width
        img.height = res.height
        img.url = res.path
        _this.setData({
          img,
        })
        _this.drawImg()
        console.log(res)
      }
    })
  },
  drawImg() {
    let ctx = wx.createCanvasContext('canvas', this)
    let { url, x, y, width, height } = this.data.img
    ctx.setFillStyle('#999')
    ctx.fillRect(0, 0, 300, 400)
    ctx.save()
    ctx.drawImage(url, 0, 0, 300, 300)
    ctx.restore()
    ctx.draw()
  },
})