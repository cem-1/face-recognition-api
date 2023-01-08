const handleProfileGet = (req,res,db) => {
    const {id} = req.params;
    db.select("*").from("users").where({
        id: id,
    }).then(user => {
        res.json(user[0]);
        console.log("###LOG RECORD###");
        console.log("fetched data");
        console.log(Date());
        console.log(user[0]);
    })

}

module.exports = {
    handleProfileGet: handleProfileGet,
}