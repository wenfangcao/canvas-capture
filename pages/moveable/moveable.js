// pages/open/open.js
const device = wx.getSystemInfoSync()
const W = device.windowWidth * 2
const H = device.windowHeight * 2

Page({
  data: {
    W,
    H,
    lineX: 0,
    lineY: 0,
    headImg: 'https://fed.dev.hzmantu.com/oa-project/36b535bd3578340fc73bd332dd6dd608.png',
    img: {
      url: 'https://fed.dev.hzmantu.com/oa-project/d601766c8c37cc9e70b88e4bbbc94b21.JPG',
      x: W,
      y: H,
      width: 200,
      height: 150,
    },
    offset: {
      x: 0,
      y: 0
    },
    offsetLine: {
      // 400  this.data.line.width,height
      x: 0,
      y: 0 
    },
    scale: 1,
    scaleLine: 1,
    showMove: true,
    canvas: {
      width: '400vw',
      height: '400vh'
    },
    outLine: {
      width: W,
      height: H
    },
    line: {
      width: 590,
      height: 826
    },
    touchStart: {},
    baseXY: {
      x: 0,
      y: 0
    }
  },
  changeShowMove () {
    this.setData({
      scale: 2
    })
  },
  onReady () {
    this.loadImage()
  },
  onChange (e) {
    this.data.offset = e.detail
    console.log(e.detail)
  },
  onScale (e) {
    this.data.offset = e.detail
    this.data.scale = e.detail.scale
  },
  touchLineStart (e) {
    this.setData({
      touchStart: e.touches[0],
      baseXY: {
        x: this.data.offset.x,
        y: this.data.offset.y
      }
    })
  },
  onChangeLine (e) {
    let offsetX = e.touches[0].clientX - this.data.touchStart.clientX
    let offsetY = e.touches[0].clientY - this.data.touchStart.clientY
    let offset = {
      x: this.data.baseXY.x + offsetX,
      y: this.data.baseXY.y + offsetY
    }
    this.setData({
      offset,
    })
    console.log(this.data.offset)
  },
  loadImage () {
    let _this = this
    wx.getImageInfo({
      src: _this.data.img.url,
      success: (res) => {
        let img = _this.data.img
        let W = this.data.outLine.width
        let H = this.data.outLine.height
        let largeW = res.width > W
        let largeH = res.height > H
        img.width = res.width
        img.height = res.height
        if (largeW) {
          img.width = W
          img.height = (W / res.width) * res.height
          largeH = img.height > H
        }
        if (largeH) {
          img.height = H
          img.width = res.width * (H / res.height)
        } 
        img.url = res.path
        _this.setData({
          img,
        })
        console.log('getImageInfo', res)
      }
    })
  },
  drawImg () {
    let ctx = wx.createCanvasContext('canvas', this)
    let { url, x, y, width, height } = this.data.img
    width *= this.data.scale
    height *= this.data.scale
    ctx.setFillStyle('#fff')
    ctx.fillRect(0, 0, this.data.W * 4, this.data.H * 4)
    ctx.save()
    ctx.drawImage(url, x, y, width, height)
    ctx.restore()
    ctx.draw(false, () => {
      this.cropImage()
    })
  },
  cropImage () {
    let {x, y} = this.calculateXY()
    let [w, h] = [this.data.line.width, this.data.line.height]
    console.log(x, y, w, h)
    wx.canvasToTempFilePath({
      x: x,
      y: y,
      width: w,
      height: h,
      // destWidth: w,
      // destHeight: h,
      canvasId: 'canvas',
      success: function (res) {
        let tempFilePath = res.tempFilePath
        wx.hideLoading()
        wx.previewImage({
          current: 0,
          urls: [tempFilePath]
        })
      },
      fail(res) {
        wx.hideLoading()
        wx.showModal({
          title: '截取失败',
          content: res.errMsg
        })
      }
    })
  },
  calculateXY () {
    let {W, H} = this.data
    let offset = this.data.offset
    let [topLeftX, topLeftY] = [this.data.offsetLine.x + (W - this.data.line.width) / 2, this.data.offsetLine.y + (H - this.data.line.height) / 2]
    let cropX = (topLeftX - offset.x * 2)
    let cropY = (topLeftY - offset.y * 2)
    console.log({ x: cropX, y: cropY })
    return { x: cropX + this.data.W, y: cropY + this.data.H}
  }
})