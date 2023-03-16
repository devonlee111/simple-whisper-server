const { exec } = require("child_process");

let url = "http://localhost:8000/put";
let file = "test.mp3"

exec(`curl -T ${file} ${url}`, (error, stdout, stderr) => {
	if (error) {
		console.log(`error: ${error.message}`);
	}
	if (stderr) {
		console.log(`stderr: ${stderr}`);
	}
	console.log(`stdout: ${stdout}`);
});

