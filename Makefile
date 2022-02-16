dev:
	deno run --allow-net --allow-read --watch server.ts

reload:
	ls -d **/* | entr reload-browser Firefox

