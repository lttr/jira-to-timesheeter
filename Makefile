dev:
	deno run --allow-net --allow-read --watch server.js

reload:
	ls -d **/* | entr reload-browser Firefox

