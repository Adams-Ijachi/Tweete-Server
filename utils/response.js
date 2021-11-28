

export const userResponse = (user) =>{
    return {
        "id":user._id,
        "email":user.email,
        "username":user.username,
        "created_at":user.createdAt
        
    }
}