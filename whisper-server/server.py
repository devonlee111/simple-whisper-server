import os
import time
import uuid
import http.server as server
import whisper
import threading
from queue import Queue

PORT = 8000
UPLOAD_DIR = "./uploads"

def transcribe(file):
	model = whisper.load_model("base")
	result = model.transcribe(file)
	del model
	return result["text"]

class HTTPRequestHandler(server.SimpleHTTPRequestHandler):
	"""Extend SimpleHTTPRequestHandler to handle PUT requests"""
	def do_PUT(self):
		"""Save a file following a HTTP PUT request"""
		filename = str(uuid.uuid4())
		filename = os.path.join(UPLOAD_DIR, filename)

		# Don't overwrite files
		if os.path.exists(filename):
			self.send_response(409, 'Conflict')
			self.end_headers()
			reply_body = '"%s" already exists\n' % filename
			self.wfile.write(reply_body.encode('utf-8'))
			return

		file_length = int(self.headers['Content-Length'])
		with open(filename, 'wb') as output_file:
			output_file.write(self.rfile.read(file_length))

		"""Perform transcription"""
		transcription = transcribe(filename)

		"""Send response"""
		self.send_response(201, 'Created')
		self.end_headers()
		reply_body = transcription
		self.wfile.write(reply_body.encode('utf-8'))

		"""Cleanup"""
		os.remove(filename)

if __name__ == '__main__':
	if not os.path.exists(UPLOAD_DIR):
		os.makedirs(UPLOAD_DIR)

	webServer = server.HTTPServer(("", PORT), HTTPRequestHandler)
	try:
		webServer.serve_forever()
	except KeyboardInterrupt:
		pass

	webServer.server_close()
	print("Server stopped.")

