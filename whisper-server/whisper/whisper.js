const chokidar = require("chokidar");
const { exec } = require("child_process");
const uploadDir = "./uploads";

class transcriber {
	constructor() {
		this.transcriptionQueue = [];
		this.watcher = undefined;
	}

	startWhisperIntegration() {
		console.log("starting upload watcher...");
		this.watcher = this.setupWatcher();
		console.log("upload watcher started.");

		console.log("starting transriber...");
		this.startTranscriptionProcess();
	}

	// Setup chokidar file watcher for new uploads
	setupWatcher() {
		let watcher = chokidar.watch(uploadDir, {
			ignored: /(^|[\/\\])\../,
			persistent: true,
		});

		const log = console.log.bind(console);

		watcher.on("add", (file) => {
			log(`File ${file} has been added`);
			this.transcriptionQueue.push(file);
		});

		return watcher;
	}

	// Forever process to watch queue for newly queued file to transcribe
	async startTranscriptionProcess() {
		console.log("staring transcription process...");
		while (true) {
			await sleep(100);
			if (this.transcriptionQueue.length > 0) {
				console.log("queue is not empty, starting transcription process...");
				let file = this.transcriptionQueue.shift();
				console.log(`beginning transcription of ${file}`);
				this.transcribe(file);
			}
		}
	}

	// Transcribe a given file with whisper
	transcribe(file) {
		let command = `whisper ${file} --model base`;
		console.log(`executing whisper command: ${command}`);
		exec(command, (error, stdout, stderr) => {
			if (error) {
				console.log(`error: ${error.message}`);
				return;
			}
			if (stderr) {
				console.log(`stderr: ${stderr}`);
				return;
			}
			console.log(`stdout: ${stdout}`);
		});
	}
}

// Helper function to sleep for a time
function sleep(time) {
	return new Promise((resolve) => setTimeout(resolve, time));
}

module.exports = { transcriber };
