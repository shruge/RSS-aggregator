install:
	npm ci

build:
	npm run build

serve:
	npm run serve

lint:
	npx eslint .

fix-all:
	npx eslint --fix .
