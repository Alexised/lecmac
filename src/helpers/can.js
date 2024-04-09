export function can(permission){
    let count=false;
    const userDetail = JSON.parse(localStorage.getItem('user'));
    if(userDetail.permissions && userDetail.permissions.data.length>0){
        userDetail.permissions.data.forEach((val) => {
            if (val.name === permission) {
                count=true;
                return true;
            }
        })
    }
    else{
        count=false;
        return false;
    }
return count;
}

/*const can= (permission=>{


    const userDetail = JSON.parse(localStorage.getItem('user'));
if(userDetail.permissions && userDetail.permissions.data.length>0){

        userDetail.permissions.data.forEach((val) => {
            if (val.name === permission) {
                return true;
            }
        })
    }
    else{
        return false;
    }
})
console.log(can('add-branch'));*/



