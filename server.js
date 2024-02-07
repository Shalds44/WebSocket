import express from "express";
import path from "path";
import * as url from 'url';
import { Server } from "socket.io";
import { Socket } from "dgram";
import fs from "fs";
import { writeFile } from 'fs/promises';
import { readFile } from 'fs/promises';

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

const app = express();
const serverNode = app.listen(4000);

app.use(express.static(__dirname, { index: false}));

app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
})

const ios = new Server(serverNode)
const admin = ios.of("/admin")

ios.on('connection', (socket) => {
    console.log("connected on / " + socket.id)
    socket.on('message', (msg) => {
        console.log(msg)
    })

    socket.join('ma super room')
    // socket.leave("ma super room")

    // ios.to("ma super room").emit('message')
    // socket.to('ma super room').emit('message')
})

admin.on('connection', (socket) => {
    console.log("connected on admin " + socket.id)
    socket.on("chatMessage", (msg) => {
        console.log(msg)
        admin.emit("chatMessage", msg)
    })
    socket.on("canvasClick", (posClick) => {
        console.log(posClick)
        admin.emit("canvasClick", posClick)
    })

    socket.on("saveImage", async (saveImage) => {
        try {
            await writeFile("./saveImage.json", JSON.stringify(saveImage))
            console.log("ecriture")

        } catch (error) {
            console.log(error)
        }
    })

    socket.on("restoreImage", async() => {
        console.log("ddd")
        try {
            const restoreImage = await readFile("./saveImage.json", "utf8")
            admin.emit("restoreImage", restoreImage)

        } catch (error) {
            console.log(error)
        }
    })
    

    // admin.clients((error, clients) => {
    //     console.log(clients)
    // })
})