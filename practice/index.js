

// // class shape {
// //     constructor(color) {
// //         this.color = color;
// //     }

// //     paint() {
// //         console.log("painting");
// //     }
// // }

// // class rectangle extends shape {
// //     constructor(length, width) {
// //         super(color);
// //     }
// //     hey() {
// //         console.log(this)
// //     }
// // }

// const fs = require("fs")
// function redfilepromisified(filename,standard){
//     return new Promise((resolve,reject)=>{
//         fs.readFile(filename,standard,function(err,data){
//             if(err){
//                 reject(err)
//             }
//             else{
//                 resolve(data)
//             }
//         })
//     })
// }

// redfilepromisified("a.txt","utf-8").then((data)=>{
//     console.log(data)
// }).catch((err)=>{
//     console.log(err)
// })
const { error } = require('console')
const fs = require('fs')

function readfilePromise(filename,standard){
    return new Promise((resolve,reject)=>{

        fs.readFile(filename,standard,function(err,data){
            if(err){
                reject(err)
            }
            else{
                resolve(data)
            }
        })
    })
}

// readfilePromise("a.txt","utf-8").then((data)=>{
//     console.log(data)
// }).catch((err)=>{
// console.log(err)
// })

function writeFilePromise(filename,wtw){
    return new Promise((resolve,reject)=>{
        fs.writeFile(filename,wtw,function(err){
            if(err)[
                reject(err)
            ]
            else{
                resolve
            }
        })
    })
}

// writeFilePromise("a.txt","what's up dude").then(()=>{
//     console.log("write succesfully")
// }).catch((err)=>{
// console.log(err)
// })


function writeandreadfilePromise(filename,wtw,standard){

    return new Promise((resolve,reject)=>{
       readfilePromise(filename,standard).then(()=>{
        writeFilePromise(filename,standard)
        resolve("read and write  succesfully")
       }).catch(()=>{
        reject("error")
       })

       })
    
}

writeandreadfilePromise("aa.txt","moni rockstar","utf-8").then((s)=>{
console.log(s)
}).catch((error)=>{
    console.log(error)
})


