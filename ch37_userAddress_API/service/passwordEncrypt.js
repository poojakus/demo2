import bcrypt from 'bcrypt'

const passWordencrypt=async(pass)=>{
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash({pass:pass}, salt);

}

export default passWordencrypt