const mongoose = require('mongoose'); 

const userSchema = new mongoose.Schema({ 
    name: { 
        type: String, 
        required: true 
    }, 

    description: { 
        type: String, 
        required: true,  
    }, 

    amount: 
    {   type: String, 
        required: true 
    }, 

    price: 
    {   type: Number, 
        required: true 
    }, 

    image: { 
        type: String, 
        required: true 
    }, 

    created: { 
        type: Date, 
        required: true, 
        default: Date.now 
    } 
}); 
    
    const component = mongoose.model('component', userSchema);

    module.exports = component;