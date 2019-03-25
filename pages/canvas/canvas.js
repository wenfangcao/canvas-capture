// pages/canvas/canvas.js
let device = wx.getSystemInfoSync()
Page({
  data: {
    showHover: true,
    starttouch: null,
    nextTouch: null,
    originalCanvasCtx: null,
    img: {
      url: 'https://fed.dev.hzmantu.com/oa-project/621c7cdb0cf4f8df46a164288d73580d.jpeg',
      x: 0,
      y: 0,
      width: 200,
      height: 150,
    },
    originalCanvas: {
      originalSize: {
        width: device.screenWidth,
        height: device.screenHeight,
      },
    },
    moveCanvas: {
      moveSize: {
        width: device.screenWidth,
        height: device.screenHeight,
      },
    }
  },
  onReady () {
    this.drawImage()
    // this.drawMove()
  },
  touchstart (e) {
    console.log(e)
    if (e.touches.length === 1) {
      this.setData({
        starttouch: e.touches
      })
    }
  },
  touchmove (e) {
    if (e.touches.length === 1) {
      // console.log("单滑了")
      // this.moveImg(e)
    }
  },
  touchend (e) {
    let nowTouch = e.changedTouches[0]
    let starttouch = this.data.starttouch[0]
    let offsetX = nowTouch.x - starttouch.x
    let offsetY = nowTouch.y - starttouch.y
    let img = this.data.img
    img.x = img.x + offsetX
    img.y = img.y + offsetY
    console.log('touchend', e)
    this.drawImg()
  },
  moveImg (e) {
    let nowTouch = e.touches[0]
    let starttouch = this.data.starttouch[0]
    let offsetX = nowTouch.x - starttouch.x
    let offsetY = nowTouch.y - starttouch.y
    console.log(offsetX, offsetY)
    let img = this.data.img
    let x = img.x + offsetX
    let y = img.y + offsetY
    let { url, width, height } = this.data.img
    this.drawImg({ url, x, y, width, height })
  },
  toggleHover () {
    this.drawImage()
    // this.setData({
    //   showHover: !this.data.showHover
    // }, ()=> {
    //   if (this.data.showHover) {
    //     this.drawMove()
    //   }
    // })
  },
  drawImage () {
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
        console.log('getImageInfo', res)
      }
    })
    let ctx = wx.createCanvasContext('originalCanvas', this)
    this.setData({
      originalCanvasCtx: ctx
    })
  },
  drawImg (img) {
    let {url, x, y, width, height} = img ? img : this.data.img
    let ctx = this.data.originalCanvasCtx
    ctx.drawImage(url, x, y, width, height)
    ctx.draw()
  },
  drawMove () {
    let ctx = wx.createCanvasContext("moveCanvas", this)
    let [x, y, w, h] = [100, 100, 100, 100]
    this.drawRectangle(ctx, {x, y, w, h})
  },
  drawRectangle (ctx, rect) {
    let size = this.data.moveCanvas.moveSize
    console.log(rect)
    console.log(size)
    // 绘制半透明遮罩
    ctx.setFillStyle('rgba(0,0,0,0.5)')
    ctx.fillRect(0, 0, size.width, size.height)
    // 清除选中区域的半透明遮罩，使选中区域高亮
    ctx.setFillStyle('rgba(0,0,0,0)')
    ctx.clearRect(rect.x, rect.y, rect.w, rect.h)
    //绘制选中边框

    ctx.setStrokeStyle('white')
    ctx.setLineWidth(2)
    ctx.beginPath()
    ctx.moveTo(rect.x, rect.y)
    ctx.lineTo(rect.x + rect.w, rect.y)
    ctx.lineTo(rect.x + rect.w, rect.y + rect.h)
    ctx.lineTo(rect.x, rect.y + rect.h)
    ctx.lineTo(rect.x, rect.y)

    ctx.stroke()
    ctx.closePath()
    ctx.draw()
  }

})