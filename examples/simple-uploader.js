const { exec } = require("child_process");

let url = "http://localhost:8000/put";
let file = "test.txt";

exec(`curl -T ${file} ${url}`, (error, stdout, stderr) => {

});

