

// // // // class shape {
// // // //     constructor(color) {
// // // //         this.color = color;
// // // //     }

// // // //     paint() {
// // // //         console.log("painting");
// // // //     }
// // // // }

// // // // class rectangle extends shape {
// // // //     constructor(length, width) {
// // // //         super(color);
// // // //     }
// // // //     hey() {
// // // //         console.log(this)
// // // //     }
// // // // }

// // // const fs = require("fs")
// // // function redfilepromisified(filename,standard){
// // //     return new Promise((resolve,reject)=>{
// // //         fs.readFile(filename,standard,function(err,data){
// // //             if(err){
// // //                 reject(err)
// // //             }
// // //             else{
// // //                 resolve(data)
// // //             }
// // //         })
// // //     })
// // // }

// // // redfilepromisified("a.txt","utf-8").then((data)=>{
// // //     console.log(data)
// // // }).catch((err)=>{
// // //     console.log(err)
// // // })
// // const { error } = require('console')
// // const fs = require('fs')

// // function readfilePromise(filename,standard){
// //     return new Promise((resolve,reject)=>{

// //         fs.readFile(filename,standard,function(err,data){
// //             if(err){
// //                 reject(err)
// //             }
// //             else{
// //                 resolve(data)
// //             }
// //         })
// //     })
// // }

// // // readfilePromise("a.txt","utf-8").then((data)=>{
// // //     console.log(data)
// // // }).catch((err)=>{
// // // console.log(err)
// // // })

// // function writeFilePromise(filename,wtw){
// //     return new Promise((resolve,reject)=>{
// //         fs.writeFile(filename,wtw,function(err){
// //             if(err)[
// //                 reject(err)
// //             ]
// //             else{
// //                 resolve
// //             }
// //         })
// //     })
// // }

// // // writeFilePromise("a.txt","what's up dude").then(()=>{
// // //     console.log("write succesfully")
// // // }).catch((err)=>{
// // // console.log(err)
// // // })


// // // function writeandreadfilePromise(filename,wtw,standard){

// // //     return new Promise((resolve,reject)=>{
// // //        readfilePromise(filename,standard).then(()=>{
// // //         writeFilePromise(filename,standard)
// // //         resolve("read and write  succesfully")
// // //        }).catch(()=>{
// // //         reject("error")
// // //        })

// // //        })
    
// // // }

// // // writeandreadfilePromise("aa.txt","moni rockstar","utf-8").then((s)=>{
// // // console.log(s)
// // // }).catch((error)=>{
// // //     console.log(error)
// // // })


// // let p = new Promise((resolve,reject)=>{

// //     resolve("1")
// //     resolve("3")
// // })

// // setInterval(() => {

// //     p.then((data)=>{
// //         console.log("no of times"+ data)
// //     })
// // }, 1000);

// const fs= require("fs")

// function readfilePromisified(filepath,encoding){
// return new Promise((resolve,reject)=>{
  
//      fs.readFile(filepath,encoding,(err,data)=>{
//         if(err){
//             reject()
//         }
//         else{
//             resolve(data)
//     }
//     })
 
// })

// }

// function writeFilePromise(filepath,content){
//     return new Promise((resolve,reject)=>{
//         fs.writeFile(filepath,content,(err)=>{
//             if(err){
//                 reject()
//             }
            
//         })
//     })
// }

// async function maint( ) {
//     let r = await readfilePromisified("a.txt","utf-8")
//     r=r.trim()
//     let w = await writeFilePromise("a.txt",r)
    
    
// }

// fs.writeFile("a.txt","ding ding",function(data){
//     console.log(data)

// })

const fs = require('fs')

async function readfile(filepath,encoding) {
    try{
    await fs.readFile(filepath,encoding)
    }
    catch(e){
console.log("error")
    }
    
}
async function name() {
    let p= await readfile("a.txt","utf-8")
    console.log(p)

}

name()