const canvas = document.getElementById("canvas")
const ctx = canvas.getContext("2d")

const canvasSave = document.getElementById("canvas-save")
const ctxSave = canvasSave.getContext("2d")

function getMousePosition(canvas, event) {
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    return {x:x,y:y}
}
const draw = (event) =>{
    const posClick = getMousePosition(canvas, event);
    ctx.fillRect(posClick.x,posClick.y,5,5)
    admin.emit("canvasClick", posClick)

}
let saveImage;
const mouseMove = (state)=>{
    if(state == "down"){
        canvas.addEventListener("mousemove", draw)
    }else{
        canvas.removeEventListener("mousemove", draw)
        saveImage = ctx.getImageData(0,0,300,300)
    }
}

canvas.addEventListener("click", (event) =>{
    const posClick = getMousePosition(canvas, event);
    ctx.fillRect(posClick.x,posClick.y,5,5)
    admin.emit("canvasClick", posClick)
})

canvas.addEventListener("mousedown", (event) =>{
    mouseMove("down")
})

canvas.addEventListener("mouseup", (event) =>{
    mouseMove("up")
})

const saveButton = document.getElementById("saveButton")
const restoreButton = document.getElementById("restoreButton")

saveButton.addEventListener("click", () =>{
    // ctxSave.putImageData(saveImage,0,0)
    admin.emit("saveImage", saveImage)
})

restoreButton.addEventListener("click", () =>{
    // ctxSave.putImageData(saveImage,0,0)
    admin.emit("restoreImage")
})

admin.on("canvasClick", (posClickServer)=>{
    ctx.fillRect(posClickServer.x,posClickServer.y,5,5)
})

admin.on("restoreImage", (restoreImageServer)=>{
    const jsonObject = JSON.parse(restoreImageServer);
    const typedArray = new Uint8ClampedArray(jsonObject.data.data)
    const imageDatad = new ImageData(typedArray, 300, 300);
    ctxSave.putImageData(imageDatad, 0, 0)
})

