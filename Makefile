all: hint test minify doc

hint:
	@jshint subcollider.dev.js

test:
	@mocha

minify:
	@uglifyjs --unsafe -nm -nc -o ./subcollider.js ./subcollider.dev.js

doc:
	@docco --template ./misc/docco.jst ./subcollider.dev.js
	@mv ./docs/subcollider.dev.html ./index.html
	@rm -rf ./docs

clear:
	@rm -r subcollider.js

.PHONY: test
