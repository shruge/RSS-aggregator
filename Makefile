install:
	npm ci

build:
	npm run build

lint:
	npx eslint .

fix-all:
	npx eslint --fix .
