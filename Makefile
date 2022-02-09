dev:
	deno run --allow-net --allow-read --watch --import-map import_map.json server.js

reload:
	ls -d **/* | entr reload-browser Firefox

