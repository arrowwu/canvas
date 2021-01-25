import React, { useRef, useEffect } from 'react'
import './styles.css'

const Canvas = props => {

  let startX, startY, offsetX, offsetY
  let isDragable = false

  const images = []
  images[0] = {
    obj: null,
    src: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQQo1eGiEdtPXgaEmSlOGNt7qcbyc09h6BqJQ&usqp=CAU',
    x:0, 
    y:0, 
    width: 100,
    height: 100,
    isDragging:false
  }

  images[1] = {
    obj: null,
    src: 'https://action.scholastic.com/content/dam/classroom-magazines/action/issues/2019-20/040120/superman-becomes-a-star-superheroes-take-over-the-world/07-ACT-040120-p26-PT-Superman-HR.jpg',
    x:500, 
    y:0, 
    width: 100,
    height: 100,
    isDragging:false
  }


  const canvasRef = useRef(null)

  const clear = ctx => {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
    
    ctx.canvas.width  = window.innerWidth
    ctx.canvas.height = window.innerWidth*9/16
    ctx.fillStyle = 'yellow'
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height)
  }

  const loadImages = ctx => {
    for(const img of images){
      const image = new Image()
      image.onload = () => {
        ctx.drawImage(image, img.x, img.y, img.width, img.height)
        img.obj = image
      }
      image.src = img.src
    } 
  }
  
  const drawImages = ctx => {
    clear(ctx)
    for(const img of images){
      if(img.isDragging) {
        ctx.strokeStyle = 'green'
        ctx.lineWidth = 2
        ctx.strokeRect(img.x, img.y, img.width, img.height)
      }   
      ctx.drawImage(img.obj, img.x, img.y, img.width, img.height)
    } 
  }

  const placeOnTop = index => {
    let top = images[index]
    images.splice(index, 1)
    images.push(top)    
  } 

  const onMouseDown = (e, context) => {
    let isFound = false
    let topImageIdx = 0
    // get cursor position
    const cx=parseInt(e.clientX)
    const cy=parseInt(e.clientY)
  
    // find if cursor is inside any image, starting from the top image
    isDragable=false
    for(let i = images.length-1; i>=0; i--){
        if(cx>images[i].x && cx<images[i].x+images[i].width && cy>images[i].y && cy<images[i].y+images[i].height){
          isFound = true
          isDragable=true
          images[i].isDragging=true

          //save the cursor position
          startX=cx
          startY=cy

          //save the offset position of cursor inside the image
          offsetX = cx-images[i].x
          offsetY = cy-images[i].y
          topImageIdx = i
          break
        }    
    }
    if(isFound) {   
      if(topImageIdx !== images.length) placeOnTop(topImageIdx)
      drawImages(context)
    }
  }

  const onMouseUp = context => {
    let isFound = false
    for(const img of images){
        if(img.isDragging) {
          img.isDragging=false
          isFound = true
        }
    }
    if(isFound) drawImages(context)
  }

  const onMouseMove = (e, context) => {
    if(!isDragable) return

    for(let img of images){
      if(img.isDragging){
        // get the current cursor position
        var cx=parseInt(e.clientX)
        var cy=parseInt(e.clientY)

        //make sure image won't be dragged out of the canvas boundry
        if(cx>context.canvas.width-img.width+offsetX) cx = context.canvas.width-img.width+offsetX
        if(cx<offsetX) cx = offsetX
        if(cy>context.canvas.height-img.height+offsetY) cy = context.canvas.height-img.height+offsetY
        if(cy<offsetY) cy = offsetY

        img.x+=cx-startX
        img.y+=cy-startY
        break
      }
    }

    drawImages(context)

    startX=cx
    startY=cy
  }
  
  useEffect(() => {
    const canvas = canvasRef.current
    const context = canvas.getContext('2d')

    clear(context)
    loadImages(context)

    document.addEventListener('mousedown', e => onMouseDown(e, context))
    document.addEventListener('mouseup', () => onMouseUp(context))
    document.addEventListener('mousemove', e => onMouseMove(e, context))
  })
  
  return <canvas ref={canvasRef}/> 
}

export default Canvas
