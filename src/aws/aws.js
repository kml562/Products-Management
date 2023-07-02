import AWS from "aws-sdk"


AWS.config.update({
    accessKeyId: "AKIAY3L35MCRZNIRGT6N",
    secretAccessKey: "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",
    region: "ap-south-1"
})

const uploadFile= async (file) =>{
    return new Promise( function(resolve, reject) {
     let s3= new AWS.S3({apiVersion: '2006-03-01'}); 
 
     var uploadParams= {
         ACL: "public-read",
         Bucket: "classroom-training-bucket", 
         Key: "abc/" + file.originalname, 
         Body: file.buffer
     }
 
 
     s3.upload( uploadParams, function (err, data ){
         if(err) {
             return reject({"error": err})
         }
         console.log(data)
         console.log("file uploaded succesfully")
         return resolve(data.Location)
     })
 
    })
}
 
export const uploadData= async function(req, res){

    try{
        let files= req.files
        console.log(files)
        if(files && files.length>0){
            //upload to s3 and get the uploaded link
            // res.send the link back to frontend/postman
            let uploadedFileURL= await uploadFile( files[0] )
            res.status(201).send({msg: "file uploaded succesfully", data: uploadedFileURL})
        }
        else{
            res.status(400).send({ msg: "No file found" })
        }
        
    }
    catch(err){
        res.status(500).send({msg: err})
    }
    
}


