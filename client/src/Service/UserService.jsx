import axios from 'axios'
import Cookies from 'js-cookie'


export const getUserSession=()=>{
    const data=Cookies.get('userId')
    if(data){
        return data
    }
    return false
}

export const getUserDetails=(id)=>{
    return new Promise(async(resolve,reject)=>{
        try {
            const config={
                method:'get',
                url:'/user',
                params:{
                    _id:id
                }
            }

            const response=await axios(config)
            return resolve(response.data)
        } catch (error) {
            return reject(error)
        }
    })
}

export const SignIn=(name,pass)=>{
    return new Promise(async(resolve,reject)=>{
        try {
            const config={
                method:'get',
                url:'/signin',
                params:{
                    Name:name,
                    Password:pass
                },
                withCredentials:true
             }
             const response=await axios(config)
             Cookies.set('userId',response.data[0]._id)
             return resolve(response.data[0])
        } 
        catch (error) {
            return reject(error.response.data)
        }
    })
}

export const SignUp=(name,pass)=>{
    return new Promise(async(resolve,reject)=>{
        try {
            const config={
                method:'post',
                url:'/signup',
                data:{
                    Name:name,
                    Password:pass
                },
                withCredentials:true
             }
             const response=await axios(config)
             Cookies.set('userId',response.data._id)
             return resolve(response.data)
        } 
        catch (error) {
            return reject(error.message)
        }
    })
}

export const LogOut=()=>{
    Cookies.remove('userId')
    return
}


export const SearchFriend=(name)=>{
    return new Promise(async(resolve,reject)=>{
        try {
           const config={
            method:'get',
            url:'/searchfriend',
            params:{
                Name:name
            }
           } 

           const response=await axios(config)
           return resolve(response.data)
        } catch (error) {
            console.log(error)
            return reject(error)
        }
    })
}


export const SaveDocument=(obj,Invites)=>{
    return new Promise(async(resolve,reject)=>{
        try {
            const config={
                method:'post',
                url:'/createdoc',
                data: {
                    obj: obj,
                    Invites: Invites
                  }
            }
            const response=await axios(config)
            return resolve(response)
        } catch (error) {
            return reject(error)
        }
    })
}


export const GetRequest=(id)=>{
    return new Promise(async(resolve,reject)=>{
        try {
            const config={
                method:'get',
                url:'/getrequest',
                params:{
                    _id:id
                }
            }
            const response=await axios(config)
            return resolve(response.data)
        } catch (error) {
            return reject(error)
        }
    })
}

export const AcceptRequest=(userId,docId)=>{
    return new Promise(async(resolve,reject)=>{
        try {
            const config={
                method:'post',
                url:'/acceptrequest',
                data:{            
                    UserId:userId,
                    DocId:docId
                }
            }
            const response=await axios(config)
            return resolve(response.data)
        } catch (error) {
            return reject(error)
        }
    })
}

export const DeleteRequest=(id)=>{
    return new Promise(async(resolve,reject)=>{
        try {
            const config={
                method:'delete',
                url:'/deleterequest',
                params:{
                    _id:id
                }
            }
            await axios(config)
            return resolve("success")
        } catch (error) {
            return reject(error)
        }
    })
}

export const GetDocuments=(id)=>{
    return new Promise(async(resolve,reject)=>{
        try {
            const config={
                method:'get',
                url:'/getdocument',
                params:{
                    _id:id
                }
            }

            const response=await axios(config)
            return resolve(response.data)
            
        } catch (error) {
            return reject(error)
        }
    })
}


export const DeleteDocument=(id)=>{
    return new Promise(async(resolve,reject)=>{
        try {
            const config={
                method:'delete',
                url:'/deletedocument',
                params:{
                    _id:id
                }
            }
            await axios(config)
            return resolve("sucess")
            
        } catch (error) {
            return reject (error)
        }
    })
}


export const GetDocumentDetails=(id,userid)=>{
    return new Promise(async(resolve,reject)=>{
        try {
            const config={
                method:'get',
                url:'/documentdetails',
                params:{
                    _id:id,
                    UserId:userid
                }
            }

            const response=await axios(config)
            return resolve(response.data[0])
        } catch (error) {
            return reject(error)
        }
    })
}


export const DeleteAccess=(docid,userid)=>{
    return new Promise(async(resolve,reject)=>{
        try {
            const config={
                method:'put',
                url:'/deleteaccess',
                params:{
                    DocId:docid,
                    UserId:userid
                }
            }

          const response= await axios(config)
            return resolve(response.data)
        } catch (error) {
            return reject (error)
        }
    })
}


export const SendInvite=(senderid,receiverid,docid)=>{
    return new Promise(async(resolve,reject)=>{
        try {
            const config={
                method:'post',
                url:'/sendinvite',
                data:{
                    senderid:senderid,
                    receiverid:receiverid,
                    docid:docid
                }
            }
            await axios(config)
            return resolve(true)
            
        } catch (error) {
            return reject(error)
        }
    })
}

