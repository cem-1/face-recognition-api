const Clarifai = require('clarifai');


const handleApiCall = (req,res) => {
    var IMAGE_URL = req.body.input;
    const USER_ID = 'e6u...';
    const PAT = 'c9f...';
    const APP_ID = '366...';
    const MODEL_ID = 'face-detection';  

    const raw = JSON.stringify({
    "user_app_id": {
        "user_id": USER_ID,
        "app_id": APP_ID
    },
    "inputs": [
        {
            "data": {
                "image": {
                    "url": IMAGE_URL
                }
            }
        }
    ]
    });

    const requestOptions = {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Authorization': 'Key ' + PAT
        },
        body: raw
    };

    fetch("https://api.clarifai.com/v2/models/" + MODEL_ID + "/outputs", requestOptions).then(response =>response.text()).then(response => JSON.parse(response)).then(data => res.json(data))
    .catch(err => res.status(400).json("unable to work with api"));
}


const handleImage = (req,res,db)=>{
    const {id} = req.body;
    db("users").where("id","=",id).increment("entries",1).returning("entries").then(entries => {
        res.json(entries[0].entries);
    }).catch(err=> res.status(400).json("unable to catch data"));
}

module.exports = {
    handleImage: handleImage,
    handleApiCall: handleApiCall,
}