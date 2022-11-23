const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb://localhost:27017';

 function findAll() {
    
    MongoClient.connect(url).then(function(db){
        console.log('1');
        const mydb =   db.db("mydb");
        console.log('2');
        let collection =   mydb.collection('customers');
        console.log('3');
        let cursor =   collection.find({}).limit(10);
        console.log('4');
         cursor.forEach(doc => console.log(doc));
        console.log('5');
    }).catch( err => console.log(err) )
    
}
        
    
setTimeout(()=>{
    findAll();
    console.log('iter');
}, 5000);