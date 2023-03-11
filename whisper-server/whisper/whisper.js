const chokidar = require("chokidar");
const { exec } = require("child_process");
const uploadDir = "../uploads";

export class transciber {
	constructor() {
		this.transcriptionQueue = [];
		this.watcher = undefined;
	}

	startWhisperIntegration() {
		this.watcher = setupWatcher();
		this.startTranscriptionProcess;
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
		while (true) {
			await sleep(100);
			if (this.transcriptionQueue.length > 0) {
				file = this.transcriptionQueue.shift();
				this.transcribe(file);
			}
		}
	}

	// Transcribe a given file with whisper
	transcribe(file) {
		exec(`whisper ${file} --model medium`, (error, stdout, stderr) => {
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
